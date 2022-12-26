import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ActionInput,
  ArrowLink,
  MotionInput,
  SpecialMoveInput,
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

  // GUILTY GEAR AC+R
  const arrowLinkList = [">", "->", "~", ","];

  const stringToArray = (string, isCombo) => {
    if (isCombo) return string.split("");
    const regex = new RegExp(`(${arrowLinkList.join("|")})`);
    const inputGroups = string.toLowerCase().replace(/ /g, "").split(regex);
    return inputGroups;
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
    const comboRegex = /(\d+)([a-z])/i;
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
    if (!input) return input;
    const isArrowLink = getMove(arrowLinks, input);
    const isMoveInput = getMove(moveInputs, input);
    const isSpecialMoveInput = getMove(specialMoveInputs, input);
    const isActionInput = getMove(gameInputs, input);
    const isMechInputs = getMove(gameMechs, input);

    if (isArrowLink) return <ArrowLink key={uuidv4()} inputObj={isArrowLink} />;
    if (isMoveInput) {
      return <MotionInput key={uuidv4()} inputObj={isMoveInput} />;
    }
    if (isSpecialMoveInput)
      return <SpecialMoveInput key={uuidv4()} inputObj={isSpecialMoveInput} />;
    if (isActionInput)
      return <ActionInput key={uuidv4()} inputObj={isActionInput} />;
    if (isMechInputs) return isMechInputs.name;
    else if (
      !isArrowLink &&
      !isMoveInput &&
      !isSpecialMoveInput &&
      !isActionInput &&
      !isMechInputs
    )
      return "unknown input";
    else return recognizeInputs(input);
  };

  const recognizeInputs = (input) => {
    // transform the unrecognizable input in an array
    const inputArray = stringToArray(input, true);
    // map the array
    const inputArrayMap = inputArray.map((input) => {
      // check the input of each character
      const remainInputObj = checkInput(input);
      return remainInputObj;
    });

    // if the input is recognized, return it
    return inputArrayMap;
  };

  useEffect(() => {
    const inputArray = stringToArray(rawInput);
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
