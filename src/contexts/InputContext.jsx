import _ from "lodash";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
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
  // route  params
  const { input, game } = useParams();
  // States
  const [rawInput, setRawInput] = useState(() => {
    return input || localStorage.getItem("rawInput") || "";
  });
  const [chroma, setChroma] = useState(false);
  const [gameList] = useState([
    guiltyGear,
    streetFighter,
    kingOfFighters,
    persona,
  ]);

  const [gameInputs, setGameInputs] = useState(() => {
    const savedGameName = localStorage.getItem("gameName");
    const isUndefined = savedGameName === null;

    if (game) return gameList.filter((e) => e[0].name === game)[0];

    if (!isUndefined) {
      const savedGameInputs = gameList.filter(
        (e) => e[0].name === savedGameName
      );
      return savedGameInputs[0];
    }
    //
    else return guiltyGear;
  });

  const allInputs = useMemo(
    () =>
      _.flatten([
        techPatterns,
        followUp,
        gameInputs,
        specialInputs,
        moveInputs,
      ]),
    [gameInputs]
  );
  const regexes = useMemo(() => createRegex(allInputs), [allInputs]);
  const [output, setOutput] = useState(() => readInputs(rawInput), [rawInput]);
  const outputRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(() => {
    return localStorage.getItem("showTooltip") === "true" ? true : false;
  });

  // Functions
  function saveInLocalStorage() {
    localStorage.setItem("rawInput", rawInput);
    if (gameInputs) localStorage.setItem("gameName", gameInputs[0]?.name);
    localStorage.setItem("showTooltip", showTooltip);
  }

  function testRegex(list, input) {
    return list.find((move) => {
      if (!move) return;
      if (move.regex?.test(input)) return move;
    });
  }

  function createCombo(arr) {
    let current = [];
    const result = [];

    arr.forEach((item, i) => {
      const isFollowUp = item.props?.inputObj?.type === "follow-up";
      const nextItem = arr[i + 1];
      const wrappedItem = <Combo key={uuidv4()}>{current}</Combo>;

      if (!isFollowUp) current.push(item);

      if (isFollowUp) {
        if (wrappedItem.length !== "") result.push(wrappedItem);
        result.push(item);
        current = [];
      } else if (typeof nextItem === "undefined") result.push(wrappedItem);
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
    const clean = str.replace(/ /g, "").replace(/\+/g, "");
    let result = [...clean];

    wrapMechs.forEach((move) => {
      let indexCount = 0;
      const matches = clean.matchAll(move.regex);

      // deal with comments
      const isComment = move.name === "Comment";
      const rawMatches = str.matchAll(move.regex);
      let input;
      for (let match of matches) {
        for (let rawMatch of rawMatches) {
          if (isComment) input = rawMatch[1];
          else input = match[1];
        }

        if (!result.join("").includes(match[0])) break; // prevents matches that already have been treaten
        // match again with the mutated array to gey the new index
        const newRegexp = createRegexFromStr(match[0]);
        const resultStr = joinStrings(result, true);
        const rematch = newRegexp.exec(resultStr);
        if (rematch === null) break;

        // key infos
        const length = match[0].length;
        const index = rematch.index - indexCount;
        const techValue = match[2];

        // create component
        const component = {
          tech: move,
          techValue: techValue,
          inputs: input,
        };

        // replace match with component
        result.splice(index, length, component);
      }
    });

    return joinStrings(result);
  }

  function readString(str) {
    const clean = str.replace(/ /g, "").replace(/\+/g, "");
    const split = splitByRegex(clean, regexes);
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

    if (tech.name === "Comment") result = inputs;
    else if (typeof inputs === "string") {
      const wrap = wrapInputs(inputs.replace(/ /g, ""));
      result = readArr(wrap);
    } else if (Array.isArray(inputs)) result = readArr(inputs);

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
    const wrap = wrapInputs(str);
    const reWrap = wrap.map((e) => (typeof e === "string" ? wrapInputs(e) : e));
    const result = readArr(reWrap);
    const lastInputs = result.map((e) => createInput(e));
    const combo = createCombo(lastInputs);

    return combo;
  }

  // Render Effects
  useEffect(() => {
    const result = readInputs(rawInput);
    setOutput(result);
    saveInLocalStorage();
  }, [rawInput, gameInputs, regexes, showTooltip]);

  const value = {
    rawInput,
    setRawInput,
    output,
    gameInputs,
    setGameInputs,
    createInput,
    gameList,
    allInputs,
    showTooltip,
    setShowTooltip,
    outputRef,
    chroma,
    setChroma,
  };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};
