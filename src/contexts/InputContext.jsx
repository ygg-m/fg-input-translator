import _ from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Combo, Input, Wrapper } from "../components/index";
import {
  followUp,
  guiltyGear,
  kingOfFighters,
  moveInputs,
  persona,
  specialInputs,
  streetFighter,
  techPatterns,
  wrapMechs,
} from "../data/index";

const InputContext = createContext();

export const useInput = () => useContext(InputContext);

export const InputProvider = ({ children }) => {
  // States
  const [rawInput, setRawInput] = useState(() => {
    return localStorage.getItem("rawInput") || "";
  });

  const [gameList] = useState([
    guiltyGear,
    streetFighter,
    kingOfFighters,
    persona,
  ]);
  const [gameInputs, setGameInputs] = useState(() => {
    const savedGameName = localStorage.getItem("gameName");
    const isUndefined = savedGameName !== "undefined";
    if (isUndefined) {
      const savedGameInputs = gameList.filter(
        (e) => e[0].name === savedGameName
      );
      return savedGameInputs[0];
    }
    //
    return guiltyGear;
  });

  const [allInputs, setAllInputs] = useState(
    () =>
      _.flatten([
        techPatterns,
        followUp,
        gameInputs,
        specialInputs,
        moveInputs,
      ]),
    []
  );
  const [allRegexes, setAllRegexes] = useState();
  const [output, setOutput] = useState(() => readInputs(rawInput), [rawInput]);
  const [load, setLoad] = useState(false);

  // Functions
  function saveInLocalStorage() {
    localStorage.setItem("rawInput", rawInput);
    if (gameInputs) localStorage.setItem("gameName", gameInputs[0]?.name);
  }

  function loadLocalStorage() {
    const savedRawInput = localStorage.getItem("rawInput");
    setRawInput(savedRawInput || "");

    // game
    const savedGameName = localStorage.getItem("gameName");
    const isUndefined = savedGameName !== "undefined";
    if (isUndefined) {
      const savedGameInputs = gameList.filter(
        (e) => e[0].name === savedGameName
      );
      setGameInputs(savedGameInputs[0]);
    }
    //
    else setGameInputs(guiltyGear);
  }

  function testRegex(list, input) {
    return list.find((move) => {
      if (move.regex.test(input)) return move;
    });
  }

  function createCombo(arr) {
    let current = [];
    const result = [];

    arr.forEach((item, i) => {
      const isFollowUp = item.props?.inputObj?.type === "follow-up";
      const nextItem = arr[i + 1];
      const wrappedItem = <Combo key={uuidv4()}>{current}</Combo>;
      if (typeof nextItem === "undefined") result.push(wrappedItem);
      if (isFollowUp) {
        result.push(wrappedItem);
        result.push(item);
        current = [];
      } else {
        current.push(item);
      }
    });

    return result;
  }

  function createInput(input) {
    if (!input) return input;
    if (Array.isArray(input)) return input.map((e) => createInput(e));
    if (typeof input === "Symbol(react.element)") return input;
    if (typeof input === "object") return input;

    // try to get the move object by testing it's regex against the input
    const moveObj = testRegex(allInputs, input);
    if (moveObj) return createInputComponent(moveObj);
    else return input;
  }

  function createInputComponent(obj, techComponent) {
    // if there's no obj, return not found
    if (!obj) return "not found";
    if (!techComponent) return <Input inputObj={obj} key={uuidv4()} />;
    if (techComponent)
      return <Input tech={techComponent} inputObj={obj} key={uuidv4()} />;
  }

  function createRegex(list) {
    // create regexes based on movelist file
    const regexes = list.map((e) => {
      if (!e) return "";
      return e.regex;
    });
    if (!regexes.length > 0) return;

    // return a unique regex based on the regexes
    return new RegExp(
      `(${regexes.map((regex) => regex.source).join("|")})`,
      "g"
    );
  }

  function splitByRegex(str, regex) {
    // split string based on the regex
    const split = str.split(regex);
    const filterEmpty = split.filter((e) => e !== "");
    const filterUndefined = filterEmpty.filter((e) => e !== undefined);

    return filterUndefined;
  }

  function joinStrings(arr, obj) {
    // return a string and transform objects into "✥" so they count as one character and you can get the proper index
    if (obj)
      return arr
        .map((e) => {
          if (typeof e === "string") return e;
          else return "✥";
        })
        .join("");

    if (!obj)
      return arr.reduce((acc, curr) => {
        if (typeof curr === "string") {
          if (acc[acc.length - 1] && typeof acc[acc.length - 1] === "string") {
            acc[acc.length - 1] += curr;
          } else acc.push(curr);
        } else acc.push(curr);

        return acc;
      }, []);
  }

  function createRegexFromStr(str) {
    let result = str;
    const openParenthesis = result.replace(/\(/g, "\\(");
    const closeParenthesis = openParenthesis.replace(/\)/g, "\\)");
    const openBrackets = closeParenthesis.replace(/\[/g, "\\[");
    const closeBrackets = openBrackets.replace(/\]/g, "\\]");

    const newRegexp = new RegExp(closeBrackets, "g");

    return newRegexp;
  }

  function wrapInputs(str) {
    let result = [...str];

    wrapMechs.forEach((move) => {
      let indexCount = 0;
      const matches = str.matchAll(move.regex);

      for (let match of matches) {
        if (!result.join("").includes(match[0])) break; // prevents matches that already have been treaten

        // match again with the mutated array to gey the new index
        const newRegexp = createRegexFromStr(match[0]);
        const resultStr = joinStrings(result, true);
        const rematch = newRegexp.exec(resultStr);

        // key infos
        const length = match[0].length;
        const index = rematch.index - indexCount;
        const input = match[1];
        const techValue = match[2];

        // create component

        const component = {
          tech: move,
          techValue: techValue,
          inputs: input,
        };

        // replace match with component
        result.splice(index, length, component);

        //
      }
    });

    return joinStrings(result);
  }

  function readString(str) {
    const split = splitByRegex(str, allRegexes);
    const inputs = createInput(split);
    const reInputs = createInput(inputs);

    return reInputs;
  }

  function readObj(obj) {
    // get values
    const inputs = obj.inputs;
    const tech = obj.tech;
    const techValue = obj.techValue;
    let result;

    if (typeof inputs === "string") {
      const wrap = wrapInputs(inputs);
      result = readArr(wrap);
    }
    if (Array.isArray(inputs)) result = readArr(inputs);

    const component = (
      <Wrapper key={uuidv4()} tech={tech} techValue={techValue}>
        {result}
      </Wrapper>
    );

    return component;
  }

  function readArr(arr) {
    const result = arr.map((el) => {
      const isStr = typeof el === "string";
      const isArr = Array.isArray(el);
      const isObj = typeof el === "object";

      if (isStr) return readString(el);
      if (isArr) return readArr(el);
      if (isObj) return readObj(el);
      else return el;
    });

    return _.flattenDeep(result);
  }

  function readInputs(str) {
    const cleanInputs = str.toLowerCase().replace(/ /g, "");
    const wrap = wrapInputs(cleanInputs);
    const reWrap = wrap.map((e) => (typeof e === "string" ? wrapInputs(e) : e));
    const result = readArr(reWrap);
    const lastInputs = result.map((e) => createInput(e));
    const combo = createCombo(lastInputs);

    return combo;
  }

  // Render Effects
  useEffect(() => {
    loadLocalStorage();
  }, []);

  useEffect(() => {
    // input list
    if (gameInputs) {
      const inputList = _.flatten([
        techPatterns,
        followUp,
        gameInputs,
        specialInputs,
        moveInputs,
      ]);
      setAllInputs(inputList);
    }

    // regexes
    const regexes = createRegex(allInputs);
    setAllRegexes(regexes);
  }, [gameInputs]);

  useEffect(() => {
    const result = readInputs(rawInput);
    setOutput(result);
    saveInLocalStorage();
  }, [rawInput, gameInputs, allRegexes]);

  const value = {
    rawInput,
    setRawInput,
    output,
    gameInputs,
    setGameInputs,
    createInput,
    gameList,
    allInputs,
  };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};
