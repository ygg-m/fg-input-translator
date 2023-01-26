import _, { wrap } from "lodash";
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

  function checkIsRepeat(input) {
    if (!input) return input;

    const lastElement = input[input.length - 1];
    const regex = /x\d+/;
    const isRepeat = input[0] === "[" && regex.test(lastElement);
    return isRepeat;
  }

  function checkHoldInCombo(arr) {
    let check = false;
    if (!Array.isArray(arr)) return false;
    const newArr = arr.map((item) => {
      if (item[0] === "[" && item[item.length - 1] === "]") {
        check = true;
        return createHold(item);
      } else return item;
    });
    if (check) return newArr;
    else return false;
  }

  function checkReleaseInCombo(arr) {
    let check = false;
    if (!Array.isArray(arr)) return false;
    const newArr = arr.map((item) => {
      if (item[0] === "]" && item[item.length - 1] === "[") {
        check = true;
        return createRelease(item);
      } else return item;
    });
    if (check) {
      return newArr;
    } else return false;
  }

  function checkEddieInCombo(arr) {
    let check = false;
    if (!Array.isArray(arr)) return false;
    const newArr = arr.map((item) => {
      const isRegular = item[0] === "-" && item[item.length - 1] === "-";
      const isVice = item[0] === "#" && item[item.length - 1] === "#";
      const isOptional = arr[0] === "(" && arr[2] === ")";

      if (isRegular && item.length > 1) {
        check = true;
        if (isOptional) return createOptional(createRegularEddie(item));
        return createRegularEddie(item);
      }
      if (isVice && item.length > 1) {
        check = true;
        if (isOptional) return createOptional(createViceEddie(item));
        return createViceEddie(item);
      } else return item;
    });
    if (check) return newArr.map((e) => cleanComplexMech(e));
    else return false;
  }

  function checkMultiHitInCombo(arr) {
    const test = /\(\b\d\b\)/.test(arr);
    let newArr = arr;
    // const hitNumber = arr[arr.length - 1];
    // const lastChar = arr[arr.length - 2];
    // if (test) {
    //   newArr.pop();
    //   newArr.pop();
    //   newArr.push(createMultiHit(lastChar, hitNumber));
    // }
    return newArr;
  }

  function checkInputArray(array) {
    if (!array) return;
    // map the array
    const newArray = array.map((input, i) => {
      if (!input) return;
      // checkers
      const isRepeat = checkIsRepeat(input);
      const isOptional = input[0] === "(";
      const isCombo = Array.isArray(input);
      const isMultipleHits = checkMultiHitInCombo(input);
      const isRelease = checkReleaseInCombo(input);
      const isHold = checkHoldInCombo(input);
      const notSingleButton = input.lenght > 2;
      const isEddie = checkEddieInCombo(input);

      // returns
      if (!notSingleButton) {
        if (isRelease) return createRelease(input);
        if (isHold) return createCombo(isHold);
        if (isEddie) return createCombo(isEddie);
        if (isRepeat) return createRepeat(input);
        if (isOptional) return createOptional(input);
        if (isMultipleHits) return createCombo(isMultipleHits);
      }
      if (isCombo) return createCombo(input);
      else return createInput(input);
    });

    return newArray;
  }

  function createViceEddie(array) {
    const tech = allInputs.filter(
      (e) => e.name === "Eddie Vice Shadow Release"
    )[0];

    if (!Array.isArray(array)) {
      const clean = cleanComplexMech(array);
      return <Eddie input={clean} tech={tech} key={uuidv4()} />;
    }
    //
    else {
      const clean = array.filter((e) => !/\(\d+\)/.test(e));

      return (
        <div className="combo-container" key={uuidv4()}>
          <Eddie input={clean} tech={tech} key={uuidv4()} />;
        </div>
      );
    }
  }

  function createRegularEddie(array) {
    const tech = allInputs.filter(
      (e) => e.name === "Eddie Regular Shadow Release"
    )[0];
    if (!Array.isArray(array)) {
      const clean = cleanComplexMech(array);
      return <Eddie input={clean} tech={tech} key={uuidv4()} />;
    }
    //
    else {
      const clean = array.filter((e) => !/\(\d+\)/.test(e));

      return (
        <div className="combo-container" key={uuidv4()}>
          <Eddie input={clean} tech={tech} key={uuidv4()} />;
        </div>
      );
    }
  }

  function createRelease(array) {
    const tech = allInputs.filter((e) => e.name === "Release")[0];
    if (!Array.isArray(array)) {
      const clean = cleanComplexMech(array);
      return <Tech input={clean} tech={tech} key={uuidv4()} />;
    }
    const clean = array.map((e) => cleanComplexMech(e));

    return (
      <div className="combo-container" key={uuidv4()}>
        <Tech input={clean} tech={tech} key={uuidv4()} />
      </div>
    );
  }

  function createHold(array) {
    const tech = allInputs.filter((e) => e.name === "Hold")[0];
    if (!Array.isArray(array)) {
      const clean = cleanComplexMech(array);
      return <Tech input={clean} tech={tech} key={uuidv4()} />;
    } else {
      const clean = array.map((e) => cleanComplexMech(e));

      return (
        <div className="combo-container" key={uuidv4()}>
          <Tech input={clean} tech={tech} key={uuidv4()} />
        </div>
      );
    }
  }

  function createMultiHit(array, hitNumber) {
    const hits = cleanComplexMech(hitNumber) || cleanComplexMech(array);
    const tech = allInputs.filter(
      (e) => e.name === "Single / Multiple Hits"
    )[0];

    if (!Array.isArray(array)) {
      const clean = cleanComplexMech(array);
      return <MultiHit input={clean} tech={tech} hits={hits} key={uuidv4()} />;
    }
    const clean = array.filter((e) => !/\(\d+\)/.test(e));
    return (
      <div className="combo-container" key={uuidv4()}>
        <MultiHit input={clean} tech={tech} hits={hits} key={uuidv4()} />;
      </div>
    );
  }

  function createRepeat(array) {
    if (Array.isArray(array)) {
      const clean = array.map((e) => {
        const clear = cleanComplexMech(e);
        const test = /x\d+/.test(clear);
        if (!test) return clear;
      });

      const repeats = array[array.length - 1];
      const tech = allInputs.filter((e) => e.name === "Repeat")[0];

      return (
        <div className="combo-container" key={uuidv4()}>
          <Repeat input={clean} tech={tech} repeats={repeats} key={uuidv4()} />
        </div>
      );
    }
    //
  }

  function createOptional(array) {
    const tech = allInputs.filter((e) => e.name === "Optional")[0];

    if (Array.isArray(array)) {
      const clean = array.filter((e) => {
        if (e === ")") return;
        if (e === "(") return;
        else return e;
      });

      const inputs = checkInputArray(clean);

      return (
        <div className="combo-container" key={uuidv4()}>
          <Wrapper input={inputs} tech={tech} key={uuidv4()} />
        </div>
      );
    }
    //
    else {
      return (
        <div className="complex-container" key={uuidv4()}>
          {array}
          <Wrapper tech={tech} key={uuidv4()} />
        </div>
      );
    }
  }

  function createCombo(array) {
    if (!Array.isArray(array)) return createInput(array);
    else
      return (
        <div className="combo-container" key={uuidv4()}>
          {checkInputArray(array)}
        </div>
      );
  }

  function cleanComplexMech(input) {
    if (typeof input !== "string") return input;
    const hasParenthesis = input.includes("(") || input.includes(")");
    const hasBrackets = input.includes("[") || input.includes("]");
    const hasMinus = input.includes("-");
    const hasHashtag = input.includes("#");
    // returns
    if (hasHashtag) return input.replace(/[#]/g, "");
    if (hasMinus) return input.replace(/[-]/g, "");
    if (hasParenthesis) return input.replace(/[\(\)]/g, "");
    if (hasBrackets) {
      const newInput = input.replace(/[\[\]]/g, "");
      // if the input have more than 2 characters at this point,
      // it must be a Single / Multiple Hits so it'll return "xN"
      if (newInput.length > 2) return newInput.slice(-2);
      // else return it
      else return newInput;
    }
    //
    else return input;
  }

  function inputExtract(move, input) {
    if (!move) return false;

    const { name } = move;
    const wrappedMechs = [
      "Eddie Regular Shadow Release",
      "Eddie Vice Shadow Release",
      "Hold",
      "Release",
      "Optional",
      "Single / Multiple Hits",
      "Repeat",
    ];

    for (let mech of wrappedMechs) {
      if (name === mech) return cleanComplexMech(input);
    }
  }

  function createInput(input) {
    // if input is empty, return the input, which should be ('')
    if (!input) return input;
    if (Array.isArray(input)) return input.map((e) => createInput(e));
    if (typeof input === "Symbol(react.element)") return input;
    // try to get the move object by testing it's regex against the input
    const moveObj = testRegex(allInputs, input);
    // action input will have the value of complex inputs like [x], (x), etc
    const actionInput = inputExtract(moveObj, input);

    // if the move is valid, create the component with the object
    // if actionInput in longer than 1 that means it's most probably a "xN"
    // or check is to see if it's a single digit number so it means it's a single/multi hit
    if (actionInput) {
      // innerInput is the action input
      // moveObj is the technique
      const actionInputObj = testRegex(allInputs, actionInput);
      return createInputComponent(actionInputObj);
    }
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
      let repeatResult = []; // stores the repeat pattern result

      // check if it's an array
      if (Array.isArray(el))
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

  function wrapCombos(arr) {
    if (!arr) return;
    // wrap combos around an array
    // so it become sepparated from follow-ups

    // define follow-up regex
    const regex = /(>|(?<!-*?)->|~|,)/g;

    let currentArray = [];
    let insideCombo = false;
    // map the array and test if matches the regex above
    // if it doesn't, return the item inside an array
    const subArrays = _.map(arr, (item, i) => {
      const isArray = Array.isArray(item);
      if (isArray) return item;
      if (!insideCombo) currentArray = [];

      const isFollowup = item.match(regex);
      if (!isFollowup) {
        // se item não for um followup
        const isNextAFollowup = regex.test(arr[i + 1]);

        if (!isNextAFollowup && typeof arr[i + 1] !== "undefined") {
          currentArray.push(item);
          insideCombo = true;
          return "";
        }
        // se for followup e estiver dentro de um combo
        else if (
          (isNextAFollowup && insideCombo) ||
          typeof arr[i + 1] === "undefined"
        ) {
          insideCombo = false;
          currentArray.push(item);
          return currentArray;
        }
        // se não, retorna o item dentro de uma array (um item solo)
        else return [item];
      }
      // se for followup
      else return item;
    });
    // return the result
    return removeBlankSpaces(subArrays);
  }

  function createRegex() {
    // create regexes based on movelist file
    const regexes = allInputs.map((e) => {
      if (!e) return "";
      return e.regex;
    });
    if (!regexes.length > 0) return;

    // return a unique regex based on the regexes
    return new RegExp(`(
      ${regexes.map((regex) => regex.source).join("|")})`);
  }

  function splitByRegex(str, regex) {
    return (
      str
        // split string based on the regex
        .split(regex)
        // filter empty elements
        .filter((e) => e !== "")
        // filter undefined elements
        .filter((e) => e !== undefined)
    );
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
      else return splitByRegex(item, regexes);
    });
    return newArray;
  }

  function splitMoves(arr) {
    // create unique regex
    const regexes = createRegex();
    if (!regexes) return;
    const newArray = splitArrayByRegex(arr, regexes);
    return _.flatten(newArray);
  }

  function saveInLocalStorage() {
    localStorage.setItem("rawInput", rawInput);
    if (gameInputs) localStorage.setItem("gameName", gameInputs[0]?.name);
  }

  function checkReleaseInput(str, i) {
    const input = [str[i], str[i + 1], str[i + 2]].join("");
    const regex = /\](.*?)\[/;
    const test = regex.test(input);
    if (test) return input;
  }

  function checkHoldInput(str, i) {
    const input = str.substring(i, i + 3);
    const regex = /\[(.*?)\]/;
    const test = regex.test(input);
    if (test) return input;
  }

  function checkOptional(str, startIndex) {
    if (str[startIndex] !== "(") return null;
    const openIndex = str.indexOf("(", startIndex);
    if (openIndex === -1) return null;

    const closeIndex = str.indexOf(")", openIndex);
    if (closeIndex === -1) return null;

    return str.substring(openIndex, closeIndex + 1);
  }

  function checkRepeat(str, startIndex) {
    if (str[startIndex] !== "[") return null;
    if (checkReleaseInput(str, startIndex)) return null;

    const openIndex = str.indexOf("[", startIndex - 1);
    if (openIndex === -1) return null;

    const endIndex = str.indexOf("]", startIndex);
    if (endIndex === -1) return null;

    let result = str.substring(startIndex, endIndex + 1);
    const nextTwoChars = str.substring(endIndex + 1, endIndex + 3);

    const isRepeat = nextTwoChars.match(/x\d+/);
    if (isRepeat) {
      result += nextTwoChars;
    }
    return result;
  }

  function checkMultiHit(str, startIndex) {
    if (str[startIndex] !== "(") return null;
    const openIndex = str.indexOf("(", startIndex);
    if (openIndex === -1) return null;

    const input = str.substring(startIndex, startIndex + 3);
    const regex = /\(\b\d\b\)/;
    const isMultiHit = regex.test(input);

    if (isMultiHit) return input;
  }

  function isAfterFollowUp(str, i) {
    const beforeInput = str.substring(i, i - 1);
    const followUpRegex = /((?<!-.)->|>|~|,)/g;
    const testFollowUp = followUpRegex.test(beforeInput);
    return testFollowUp;
  }

  function wrapSequences(str) {
    const result = [];
    let currentString = "";

    function pushCurrentToResult() {
      result.push(currentString);
      currentString = "";
    }

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      const isRelease = checkReleaseInput(str, i);
      const isHold = checkHoldInput(str, i);
      const isOptional = checkOptional(str, i);
      const isRepeat = checkRepeat(str, i);
      const isMultiHit = checkMultiHit(str, i);

      if (isRelease) {
        pushCurrentToResult();
        result.push([isRelease]);
        i += 2;
      }
      //
      else if (isMultiHit) {
        pushCurrentToResult();
        const testFollowUp = isAfterFollowUp(str, i);

        if (!testFollowUp) result[result.length - 1] += isMultiHit;
        else result.push([isMultiHit]);
        i += 2;
      }
      //
      else if (isOptional) {
        pushCurrentToResult();
        result.push([isOptional]);
        i += isOptional.length - 1;
      }
      //
      else if (isHold) {
        pushCurrentToResult();
        const testFollowUp = isAfterFollowUp(str, i);
        if (!testFollowUp) result[result.length - 1] += isHold;
        else result.push([isHold]);
        i += 2;
      }
      //
      else if (isRepeat) {
        pushCurrentToResult();
        result.push([isRepeat]);
        i += isRepeat.length - 1;
      }
      //
      else currentString += char;
    }
    pushCurrentToResult();
    return result;
  }

  function createMultiHit__NEW(array, index) {
    const hits = cleanComplexMech(array[index]);
    const input = array[index - 1];
    const tech = allInputs.filter(
      (e) => e.name === "Single / Multiple Hits"
    )[0];
    return <MultiHit input={input} tech={tech} hits={hits} key={uuidv4()} />;
  }

  function readInputs(arr) {
    if (!arr) return; // if there's nothing, stop

    // declare General variables
    let newArr = [];
    let insideNormal = false;
    let normalStartIndex;
    let numberOfNormalChars = 0;
    // declare Parenthesis variables
    let insideParenthesis = false;
    let startParenthesisIndex;
    let numberOfParenthesisChars = 0;
    // declare Brackets variables
    let insideBrackets = false;
    let startBracketsIndex;
    let numberOfBracketsChars = 0;

    for (let [index, item] of arr.entries()) {
      const isArray = Array.isArray(item);

      // 'COMBO' ARRAY ============================================
      if (isArray) {
        // declare 'combo' array variables
        let currentArr = item;
        let currentWrapper = [];

        for (let [i, e] of item.entries()) {
          // iterate through 'combo' arrays
          const isMultiHit = /\(\b\d\b\)/.test(e); // check for '(N)' pattern
          const parenthesisStart = /\(/.test(e); // check for '('
          const parenthesisEnd = /\)/.test(e); // check for ')'
          const bracketsStart = /\[/.test(e); // check for '['
          const bracketEnd = /\]/.test(e); // check for ']'

          // ↓ MULTIHIT ----------------------------------------
          if (isMultiHit) {
            const input = createMultiHit__NEW(item, i);
            currentArr.splice(i - 1, 1, input); // remove previous input that should be repeated
            currentArr.splice(i, 1); // remove the repeat input
            newArr.push(createInput(currentArr)); // push the component
          }
          // ----------------------------------------------- end
          //
          // ↓ Start of Praenthesis checker ------------------------
          else if (parenthesisStart && !insideParenthesis) {
            insideParenthesis = true; // activate flag
            startParenthesisIndex = i; // get the start index
            numberOfParenthesisChars++; // increase the character count inside the array
          }
          // ↓ end Parenthesis Wrapper
          else if (parenthesisEnd && insideParenthesis) {
            insideParenthesis = false; // turn the flag off
            numberOfParenthesisChars++; //  increase the character count inside the array

            const inputs = createInput(currentWrapper); // create the input components
            const wrappedInputs = <Optional key={uuidv4()}>{inputs}</Optional>; // wrap the inputs inside the Optional

            currentArr.splice(
              // makes changes to 'currentArr'
              startParenthesisIndex, // the start index to delete the elements
              numberOfParenthesisChars, // the number of elements to be deleted from the array
              wrappedInputs // the element to substitute the deleted elements
            ); // substitute the array elements for the inputs components

            numberOfParenthesisChars = 0; // reset
            currentWrapper = []; // reset
            newArr.push(createInput(currentArr)); // push the component while creating the other inputs
          }
          // ↓ continue inside wrapper
          else if (insideParenthesis) {
            currentWrapper.push(e); // push the character into the current array
            numberOfParenthesisChars++; // increase the character count inside the array
          }
          // ----------------------------------------------- end
          //
          // ↓ Start of Brackets checker ------------------------
          else if (bracketsStart && !insideBrackets) {
            insideBrackets = true; // activate flag
            startBracketsIndex = i; // get the start index
            numberOfBracketsChars++; // increase the character count inside the array
          }
          // ↓ end Wrapper
          else if (bracketEnd && insideBrackets) {
            const nextChar = item[i + 1];
            const isRepeat = /\d+/.test(nextChar);

            if (isRepeat) {
              const inputs = createInput(currentWrapper); // create the input components
              const repeatWrap = (
                <Repeat repeats={nextChar} key={uuidv4()}>
                  {inputs}
                </Repeat>
              );

              console.log(currentWrapper);

              currentArr.splice(
                // makes changes to 'currentArr'
                startBracketsIndex, // the start index to delete the elements
                numberOfBracketsChars, // the number of elements to be deleted from the array
                repeatWrap
              );
              newArr.push(createInput(repeatWrap)); // push the component
            }

            insideBrackets = false;
          }
          // ↓ continue inside wrapper
          else if (insideBrackets) {
            currentWrapper.push(e);
            numberOfBracketsChars++;
          }
          // ----------------------------------------------- end
          //
        }

        // =========================
      }
      //
      else {
        newArr.splice(index, 1, createInput(item));
      }
    }

    return newArr;
  }

  function evenNewerLogic(str) {
    const newArr = [...str];
    let matchedComponents = null;

    wrapMechs.forEach((e) => {
      const matches = str.matchAll(e.regex);
      // console.log(matches);
      for (const match of matches) {
        const input = match[1];
        const component = createElement(e.component, { key: uuidv4() });
        console.log(match);
        newArr.splice(match.index, match[0].length, component);
      }
    });
    // console.log(testRegex(wrapMechs, str));
    return newArr;
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
    setAllRegexes(createRegex());
  }, [gameInputs]);

  useEffect(() => {
    saveInLocalStorage();
    // set rawInput to lower case and remove empty spaces
    const cleanInputs = rawInput.toLowerCase().replace(/ /g, "");
    //
    const wrappedComplex = wrapSequences(cleanInputs);
    // split the string into an array separated on follow-ups
    const arr = splitFollowUps(wrappedComplex);
    // split the moves
    const splittedMoves = splitMoves(arr);
    // wrap everything that's not a followup as a combo
    const wrappedCombos = wrapCombos(splittedMoves);
    // get moves components
    const moves = checkInputArray(checkInputArray(wrappedCombos));

    // const newLogic = readInputs(wrappedCombos);
    // console.log(newLogic);
    const evenNewerLogicResult = evenNewerLogic(cleanInputs);
    // console.log(evenNewerLogicResult);

    // =========================
    // TESTS
    // =========================

    setOutput(evenNewerLogicResult);
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
