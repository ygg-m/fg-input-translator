import _, { create, split, wrap } from "lodash";
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Eddie,
  MultiHit,
  Optional,
  Repeat,
  Tech,
  TechInput,
  Wrapper,
} from "../components/index";
import {
  followUp,
  guiltyGear,
  kingOfFighters,
  moveInputs,
  persona,
  specialInputs,
  streetFighter,
  subWrapMechs,
  wrapMechs,
} from "../data/index";

const InputContext = createContext();

export const useInput = () => useContext(InputContext);

export const InputProvider = ({ children }) => {
  // States
  // Input
  const [rawInput, setRawInput] = useState("");
  const [output, setOutput] = useState([]);
  const [gameInputs, setGameInputs] = useState();
  const [gameList] = useState([
    guiltyGear,
    streetFighter,
    kingOfFighters,
    persona,
  ]);
  const [allInputs, setAllInputs] = useState([]);
  const [allRegexes, setAllRegexes] = useState();

  // Functions
  function testRegex(list, input) {
    return list.find((move) => {
      if (move.regex.test(input)) return move;
    });
  }

  function createCombo(array) {
    const regex = /((?<!-.)->|>|~|,)/g;
    let currentArr = [];
    const result = [];
    for (const [i, e] of array.entries()) {
      if (typeof array[i + 1] === "undefined") {
        currentArr.push(e);
        result.push(
          <div className="combo" key={uuidv4()}>
            {createInput(currentArr)}
          </div>
        );
      }
      if (regex.test(e)) {
        result.push(
          <div className="combo" key={uuidv4()}>
            {createInput(currentArr)}
          </div>
        );
        result.push(createInput(e));
        currentArr = [];
      } else {
        currentArr.push(e);
      }
    }

    return result;
  }

  function createInput(input) {
    // if input is empty, return the input, which should be ('')
    if (!input) return input;
    if (Array.isArray(input)) return input.map((e) => createInput(e));
    if (typeof input === "Symbol(react.element)") return input;
    // try to get the move object by testing it's regex against the input
    const moveObj = testRegex(allInputs, input);
    if (moveObj) return createInputComponent(moveObj);
    // else, return the input as it is
    else return input;
  }

  function createInputComponent(obj, techComponent) {
    // if there's no obj, return not found
    if (!obj) return "not found";
    if (!techComponent) return <TechInput inputObj={obj} key={uuidv4()} />;
    if (techComponent)
      return <TechInput tech={techComponent} inputObj={obj} key={uuidv4()} />;
  }

  function removeBlankSpaces(arr) {
    return arr.filter((a) => a !== "");
  }

  function splitFollowUps(input) {
    const regex = /((?<!-.)->|>|~|,)/g;

    const output = input.map((el) => {
      if (typeof el === "object") return el;
      if (Array.isArray(el))
        // check if it's an array
        return el.map((e) => {
          // if it's not a repeat pattern, return the string splitted
          return removeBlankSpaces(e.split(regex));
        });
      // if it's not an array, return the string splitted
      else return removeBlankSpaces(el.split(regex));
    });
    // flatten everything
    return _.flatten(output);
  }

  function createRegex(list) {
    // create regexes based on movelist file
    const regexes = list.map((e) => {
      if (!e) return "";
      return e.regex;
    });
    if (!regexes.length > 0) return;

    // return a unique regex based on the regexes
    return new RegExp(`(
      ${regexes.map((regex) => regex.source).join("|")})`);
  }

  function splitByRegex(str, regex) {
    // split string based on the regex
    const split = str.split(regex);
    const filterEmpty = split.filter((e) => e !== "");
    const filterUndefined = filterEmpty.filter((e) => e !== undefined);

    return filterUndefined;
  }

  function splitArrayByRegex(arr, regexes) {
    if (!Array.isArray(arr)) return arr;
    const newArray = arr.map((item) => {
      // check if it's an array
      const isArray = Array.isArray(item);
      if (isArray) {
        const result = item.map((e) => {
          // check if it's an array again
          const isInnerArray = Array.isArray(e);
          if (isInnerArray) return splitArrayByRegex(e, regexes);
          // if array is empty, return the item, which should be ''
          else if (e.length === 0) return e;
          // else, split the array based on the regex
          else {
            return splitByRegex(e, regexes);
          }
        });
        // flatten the result so it's cleaner
        return _.flatten(result);
      }

      // if "item" it's not an array, return it (should be a linkArrow)
      else if (typeof item === "string") return splitByRegex(item, regexes);
      else return item;
    });
    return newArray;
  }

  function splitMoves(arr) {
    const regexes = createRegex(allInputs);

    // create unique regex
    if (typeof arr === "string") return splitByRegex(arr, regexes);
    const newArray = splitArrayByRegex(arr, regexes);
    return _.flatten(newArray);
  }

  function saveInLocalStorage() {
    localStorage.setItem("rawInput", rawInput);
    if (gameInputs) localStorage.setItem("gameName", gameInputs[0]?.name);
  }

  function cleanRepeatArray(arr, tech) {
    const isRepeat = tech.name === "Repeat"; // check if it's a repeat
    const isSeparated = /x\d+/.test(arr[arr.length - 1]);
    if (isRepeat) {
      if (isSeparated) arr.pop(); // remove the last element from the array
      if (!isSeparated) arr[0].slice(0, -1);
      return arr;
    } else return arr;
  }

  function removeStrings(arr) {
    return arr
      .map((e) => {
        if (typeof e !== "string") return e;
      })
      .filter((e) => typeof e !== "undefined");
  }

  function joinStrings(arr) {
    return arr.reduce((acc, curr) => {
      if (typeof curr === "string") {
        if (acc[acc.length - 1] && typeof acc[acc.length - 1] === "string") {
          acc[acc.length - 1] += curr;
        } else {
          acc.push(curr);
        }
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  }

  function createInputFromMatch(match, tech) {
    const regex = /((?<!-.)->|>|~|,)/g;
    const rawMoves = _.flatten([splitMoves(match[1].split(regex))]); // input inside wrapper
    const inputList = rawMoves.map((e) => createInput(e));
    const techValue = match[2]; // input from tech ()

    return (
      <Wrapper key={uuidv4()} tech={tech} techValue={techValue}>
        {inputList}
      </Wrapper>
    );
  }

  function wrapperMechs(str, list) {
    const newArr = [...str];
    let indexCount = 0;

    wrapMechs.forEach((e) => {
      // iterate through wrappers
      const matches = str.matchAll(e.regex); // get matches
      for (const match of matches) {
        let currentMatch = [...match[0]];

        wrapMechs.forEach((el) => {
          if (e.name === el.name) return; // if checking the same wrap mech, return
          const innerMatches = match[0].matchAll(el.regex); // check if there's match from another wrap mech
          let innerIndexCount = 0; // index count to replace properly if there's multiple matches

          for (const innerMatch of innerMatches) {
            currentMatch.splice(
              // replace the elements with the component
              innerMatch.index - innerIndexCount,
              innerMatch[0].length,
              createInputFromMatch(innerMatch, el)
            );
            innerIndexCount += innerMatch[0].length - 1;
            indexCount -= innerMatch[0].length - 1;
          }
        });

        const regex = /((?<!-.)->|>|~|,)/g; // followup regexes

        const current = joinStrings(currentMatch);
        const splitted = current.map((e) => {
          if (typeof e == "string") {
            if (regex.test(e)) return e.split(regex);
            else return e;
          } else return e;
        });

        const clean = cleanRepeatArray(splitted, e); // remove the last element from the array
        const rawMoves = _.flatten([splitMoves(clean, allRegexes)]); // input inside wrapper
        const inputList = removeStrings(rawMoves.map((e) => createInput(e))); // clean the array and create the inputs
        const techValue = match[2]; // input from tech ()

        const component = (
          <Wrapper key={uuidv4()} tech={e} techValue={techValue}>
            {inputList}
          </Wrapper>
        );

        newArr.splice(match.index - indexCount, match[0].length, component);
        indexCount += match[0].length - 1;
      }
    });

    return newArr;
  }

  function subWrapperMechs(arr) {
    let indexCount = 0;
    let newArr;

    if (typeof arr === "string") {
      const newArr = [...arr];
      indexCount = 0;

      subWrapMechs.forEach((e) => {
        const matches = arr.matchAll(e.regex); // get matches

        for (const match of matches) {
          const input = createInput(match[1]);
          const techValue = match[2]; // input from tech ()

          const component = (
            <Wrapper key={uuidv4()} tech={e} techValue={techValue}>
              {input}
            </Wrapper>
          );

          if (e.name === "Single / Multiple Hits") {
            newArr.splice(match.index + 2, 1);
            if (indexCount > 0) indexCount -= match[0].length - 1;
          }

          newArr.splice(match.index - indexCount, match[0].length, component);

          indexCount += match[0].length - 1;
        }
      });

      return joinStrings(newArr);
    } else if (Array.isArray(arr)) {
      newArr = arr.map((item) => {
        if (typeof item === "object") return item;

        const currentItem = [...item];
        indexCount = 0;

        subWrapMechs.forEach((e) => {
          const matches = item.matchAll(e.regex); // get matches

          for (const match of matches) {
            console.log(match);

            const input = createInput(match[1]);
            const techValue = match[2]; // input from tech ()

            const component = (
              <Wrapper key={uuidv4()} tech={e} techValue={techValue}>
                {input}
              </Wrapper>
            );

            if (e.name === "Single / Multiple Hits") {
              currentItem.splice(match.index + 2, 1);
              if (indexCount > 0) indexCount -= match[0].length - 1;
            }

            currentItem.splice(
              match.index - indexCount,
              match[0].length,
              component
            );

            indexCount += match[0].length;
          }
        });

        return joinStrings(currentItem);
      });
    }

    return newArr;
  }

  function readInputs(str) {
    const wrapMechs = joinStrings(wrapperMechs(str));
    const wrapSubMechs = _.flatten(subWrapperMechs(wrapMechs));
    const splittedFollowUp = splitFollowUps(wrapSubMechs);
    const splittedMoves = _.flatten(
      splittedFollowUp.map((e) => {
        if (typeof e !== "string") return e;
        else return splitMoves(e);
      })
    );
    const inputList = createCombo(splittedMoves);

    return inputList;
  }

  // Render Effects

  useEffect(() => {
    // input
    const savedRawInput = localStorage.getItem("rawInput");
    setRawInput(savedRawInput || "");

    // game
    const savedGameName = localStorage.getItem("gameName");
    if (savedGameName !== "undefined") {
      const savedGameInputs = gameList.filter(
        (e) => e[0].name === savedGameName
      );
      setGameInputs(savedGameInputs[0] || guiltyGear);
    } else setGameInputs(guiltyGear);
  }, []);

  useEffect(() => {
    // input list
    if (gameInputs)
      setAllInputs(_.flatten([gameInputs, specialInputs, moveInputs]));

    // regexes
    setAllRegexes(createRegex(allInputs));
  }, [gameInputs]);

  useEffect(() => {
    saveInLocalStorage();
    // set rawInput to lower case and remove empty spaces
    const cleanInputs = rawInput.toLowerCase().replace(/ /g, "");
    // magic happens
    const magic = readInputs(cleanInputs);

    // =========================
    // TESTS
    // =========================

    setOutput(magic);
  }, [rawInput, allInputs]);

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
