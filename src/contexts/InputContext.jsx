import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ActionInput,
  ArrowLink,
  MechInput,
  MotionInput,
  SpecialMoveInput,
  UnknownInput,
} from "../components/index";
import {
  arrowLinks,
  ggac_actionInputs,
  ggac_mechInputs,
  moveInputs,
  specialMoveInputs,
} from "../data/index";

const InputContext = createContext();

export const useInput = () => useContext(InputContext);

export const InputProvider = ({ children }) => {
  const [rawInput, setRawInput] = useState("");
  const [output, setOutput] = useState([]);
  const [gameInputs, setGameInputs] = useState(ggac_actionInputs);
  const [gameMechs, setGameMechs] = useState(ggac_mechInputs);

  // ==============================================================
  // ==============================================================
  // ==============================================================

  // trying to create logic
  let currentInput; // uses rawInput to isolate the current input
  let currentCombo; // uses rawInput to isolate the current combo
  let currentOutput; // uses currentCombo to render the visual input before pushing into output

  function checkInput2(currentInput) {
    // check if the current input is:
    // numberSequence
    // characterSequence
    // numberSequence + characterSequence
    // undefinedCharacters

    // return type
    const inputType = "";
    return inputType;
  }


  // search for the input inside proper JSON based on inputtType
  function checkMoveInput(currentInput) {}
  function checkActionInput(currentInput) {}
  function checkSpecialInput(currentInput) {}

  // create component based on the input checked above
  function createMoveInput(inputType) {}
  function createActionInput(inputType) {}
  function createSpecialInput(inputType) {}

  // create unknown input when input doesn't exist
  function createUnknownInput(inputType) {}

  // split the Input when it finds an arrow, based on RegExp
  function splitInputs() {}

  // 






  // ==============================================================
  // ==============================================================
  // ==============================================================

  // GUILTY GEAR AC+R
  const arrowLinkList = [">", "->", "~", ","];

  const stringToArray = (string, isCombo) => {
    if (isCombo) return string.split("");

    // create regex with arrowLinkList
    // split based on regex characters
    const regex = new RegExp(`(${arrowLinkList.join("|")})`);
    return string.toLowerCase().replace(/ /g, "").split(regex);
  };

  const getMove = (array, input) => {
    // search move in JSON file based on input
    return array.find((item) => {
      const inputIsArray = Array.isArray(item.input);
      const inputIsNumber = typeof item.input === "number";

      if (inputIsArray)
        return item.input.find((itemInput) => itemInput === input);
      else if (inputIsNumber) return item.input.toString() === input;
      else if (item.input) return item.input === input;
      else return input;
    });
  };

  const checkCombo = (input) => {
    // Regular expression to match numbers followed by a letter
    const comboRegex = /(\d+)([a-z])/;
    return input.match(comboRegex);
  };

  const createCombo = (comboInput) => {
    // create array with the input
    const comboInputList = [comboInput[1], comboInput[2]];
    return (
      <div className="combo-container" key={uuidv4()}>
        {comboInputList.map((el) => checkInput(el))}
      </div>
    );
  };

  const checkInput = (input) => {
    // if input is empty, return the input, which should be ('')
    if (!input) return input;
    // get the move from JSON
    const arrowLink = getMove(arrowLinks, input);
    const moveInput = getMove(moveInputs, input);
    const spMoveInput = getMove(specialMoveInputs, input);
    const actionInput = getMove(gameInputs, input);
    const mechInputs = getMove(gameMechs, input);

    // return the move Object
    if (arrowLink) return createInputComponent("arrow", arrowLink);
    if (moveInput) return createInputComponent("move", moveInput);
    if (spMoveInput) return createInputComponent("spmove", spMoveInput);
    if (actionInput) return createInputComponent("action", actionInput);
    if (mechInputs) return createInputComponent("mech", mechInputs);
  };

  const createInputComponent = (type, obj) => {
    switch (type) {
      case "arrow":
        return <ArrowLink key={uuidv4()} inputObj={obj} />;
      case "move":
        return <MotionInput key={uuidv4()} inputObj={obj} />;
      case "spmove":
        return <SpecialMoveInput key={uuidv4()} inputObj={obj} />;
      case "action":
        return <ActionInput key={uuidv4()} inputObj={obj} />;
      case "mech":
        return <MechInput key={uuidv4()} inputObj={obj} />;
      default:
        console.log("invalid");
    }
    return;
  };

  const recognizeInputs = (input) => {
    // transform the unrecognizable input in an array
    const inputArray = stringToArray(input, true);
    // map the array
    const inputArrayMap = inputArray.map((input) => {
      // check the input of each character
      return checkInput(input);
    });

    // if the input is recognized, return it
    return inputArrayMap;
    // else return <UnknownInput />;
  };

  useEffect(() => {
    const inputArray = stringToArray(rawInput);
    console.log(inputArray);
    const inputArrayMap = inputArray.map((input) => {
      // check if input is empty
      if (!input) return input;

      // get input properties
      const inputObj = checkInput(input);

      const combo = checkCombo(input);
      if (combo) return createCombo(combo);

      // return input to array map
      return inputObj;
    });

    setOutput(inputArrayMap);
  }, [rawInput]);

  const value = { setRawInput, output };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};
