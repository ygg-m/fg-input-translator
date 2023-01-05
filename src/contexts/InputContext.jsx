import _ from "lodash";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SubTechInput, TechInput } from "../components/index";
import { ggacplusr } from "../data/index";

const InputContext = createContext();

export const useInput = () => useContext(InputContext);

export const InputProvider = ({ children }) => {
  // States
  // Input
  const [rawInput, setRawInput] = useState("");
  const [output, setOutput] = useState([]);
  const [gameInputs, setGameInputs] = useState(ggacplusr);
  // const [gameMechs, setGameMechs] = useState(ggac_mechInputs);

  // Functions
  function testRegex(list, input) {
    return list.find((move) => {
      if (move.regex.test(input)) return move;
    });
  }

  function checkInputArray(array) {
    // map the array
    const newArray = array.map((input) => {
      const isCombo = Array.isArray(input);
      if (isCombo) return createCombo(input);
      else return createInput(input);
    });

    return newArray;
  }

  function createCombo(array) {
    return (
      <div className="combo-container" key={uuidv4()}>
        {array.map((e) => createInput(e))}
      </div>
    );
  }

  function solveWrappedMechs(input) {
    if (input.includes("#")) return input.replace(/[#]/g, "");
    if (input.includes("-")) return input.replace(/[-]/g, "");
    if (input.includes("(")) return input.replace(/[\(\)]/g, "");
    if (input.includes("[")) {
      const newArr = input.replace(/[\[\]]/g, "");
      // if the input have more than 2 characters at this point,
      // it must be a Single / Multiple Hits so it'll return "xN"
      if (newArr.length > 2) return newArr.slice(-2);
      // else return it
      else return newArr;
    }
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
      if (name === mech) return solveWrappedMechs(input);
    }
  }

  function createInput(input) {
    // if input is empty, return the input, which should be ('')
    if (!input) return input;
    // try to get the move object by testing it's regex against the input
    const moveObj = testRegex(gameInputs, input);
    // action input will have the value of complex inputs like [x], (x), etc
    const actionInput = inputExtract(moveObj, input);

    // if the move is valid, create the component with the object
    // if actionInput in longer than 1 that means it's most probably a "xN"
    // or check is to see if it's a single digit number so it means it's a single/multi hit
    if (actionInput?.length > 1 || testIfNumber(actionInput)) {
      const actionInputObj = testRegex(gameInputs, actionInput);
      const techComponent = createSubInputComponent(moveObj, actionInput);
      return createInputComponent(actionInputObj, techComponent);
    }

    if (actionInput) {
      // innerInput is the action input
      // moveObj is the technique
      const actionInputObj = testRegex(gameInputs, actionInput);
      const techComponent = createSubInputComponent(moveObj);
      return createInputComponent(actionInputObj, techComponent);
    }
    if (moveObj) return createInputComponent(moveObj);
    // else, return the input as it is
    else return input;
  }

  function createSubInputComponent(subInput, value) {
    if (!subInput) return;
    if (value)
      return <SubTechInput value={value} inputObj={subInput} key={uuidv4()} />;
    else return <SubTechInput inputObj={subInput} key={uuidv4()} />;
  }

  function createInputComponent(obj, techComponent) {
    // if there's no obj, return not found
    if (!obj) return "not found";
    if (!techComponent) return <TechInput inputObj={obj} key={uuidv4()} />;
    if (techComponent)
      return <TechInput tech={techComponent} inputObj={obj} key={uuidv4()} />;
  }

  function splitFollowUps(str) {
    let regex = /(>|(?<!-*?)->|~|,)/g;
    return str.split(regex);
  }

  function wrapCombos(arr) {
    // wrap combos around an array
    // so it become sepparated from follow-ups

    // define follow-up regex
    const regex = /(>|->|~|,)/g;

    // map the array and test if matches the regex above
    // if it doesn't, return the item inside an array
    const subArrays = _.map(arr, (item) => {
      if (!regex.test(item)) {
        return [item];
      } else return item;
    });

    // return the result
    return subArrays;
  }

  function createRegex(moveList) {
    // create regexes based on movelist file
    const regexes = moveList.map((e) => e.regex);

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

  function splitMoves(arr) {
    // create unique regex
    const regexes = createRegex(gameInputs);

    const newArray = arr.map((item) => {
      // check if it's an array
      const isArray = Array.isArray(item);
      if (isArray) {
        // map the array
        const result = item.map((e) => {
          // if array is empty, return the item, which should be ''
          if (e.length === 0) return e;
          // else, split the array based on the regex
          else return splitByRegex(e, regexes);
        });
        // flatten the result so it's cleaner
        return _.flatten(result);
      }
      // if "item" it's not an array, return it (should be a linkArrow)
      else return item;
    });

    return newArray;
  }

  function saveInLocalStorage() {
    localStorage.setItem("rawInput", rawInput);
  }

  function checkComplexMechs(array) {
    const newArr = array.map((e) => {
      dealWithParenthesis(e);
      return e;
    });

    return newArr;
  }

  function dealWithParenthesis(input) {
    // Split the input string on any character that is not a letter, number, or parentheses
    const parts = _.split(input, /[^\w()]/);
    // Use map to iterate over the parts and wrap the ones that contain parentheses in a sub-array
    return _.map(parts, (part) => {
      if (/[()]/.test(part)) {
        const isNumber_OneDigit = testIfNumber(part);
        return [part];
      }
      return part;
    });
  }

  function testIfNumber(str) {
    if (!str) return false;
    const match = str.match(/\b\d\b/);
    if (match) return true;
  }

  // Render Effects
  useEffect(() => {
    const retrievedArray = localStorage.getItem("rawInput");
    setRawInput(retrievedArray);
  }, []);

  useEffect(() => {
    saveInLocalStorage();
    // set rawInput to lower case and remove empty spaces
    const cleanInputs = rawInput.toLowerCase().replace(/ /g, "");
    // split the string into an array separated on follow-ups
    const arr = splitFollowUps(cleanInputs);
    // check inputs for complex or notations
    const complexSolved = checkComplexMechs(arr);
    // wrap everything that's not a followup as a combo
    const wrappedCombos = wrapCombos(complexSolved);
    // split the moves
    const splittedMoves = splitMoves(wrappedCombos);
    // get moves components
    const moves = checkInputArray(splittedMoves);

    // =========================
    // TESTS
    // =========================
    setOutput(moves);
  }, [rawInput]);

  const value = { rawInput, setRawInput, output };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};
