import { createContext, useContext, useEffect, useState } from "react";
import { ActionInput, MotionInput } from "../components/index";
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
    const move = array.find((item) => {
      const inputIsArray = Array.isArray(item.input);
      const inputIsNumber = typeof item.input === "number";
      if (inputIsArray)
        return item.input.find((itemInput) => itemInput === input);
      else if (inputIsNumber) return item.input.toString() === input;
      else return item.input === input;
    });
    return move;
  };

  const checkInput = (input) => {
    if (!input) return input;
    const isArrowLink = getMove(arrowLinks, input);
    const isMoveInput = getMove(moveInputs, input);
    const isSpecialMoveInput = getMove(specialMoveInputs, input);
    const isActionInput = getMove(gameInputs, input);
    const isMechInputs = getMove(gameMechs, input);

    if (isArrowLink) return isArrowLink;
    if (isMoveInput) return isMoveInput;
    if (isSpecialMoveInput) return isSpecialMoveInput;
    if (isActionInput) return isActionInput;
    if (isMechInputs) return isMechInputs;
    else return input;
  };

  useEffect(() => {
    const inputArray = stringToArray(rawInput);
    const inputArrayMap = inputArray.map((input, index) => {
      if (!input) return input;
      const inputObj = checkInput(input);
      const inputObjCheck = inputObj?.name?.length === 0;
      return inputObjCheck
        ? inputObj?.name
        : stringToArray(input, true).map(
            (item) => getMove(moveInputs, item).name
          );
    });
    console.log(inputArrayMap);
    setOutput(inputArrayMap);

    // const substrings = rawInput
    //   .toLowerCase()
    //   .split(
    //     /(41236987|63214789|41236|63214|236|214|623|421|>>| >>|->|~|,| >|>|rc|frc|66|H|h|P|p|5|K|k|c.|j.|S|s|2|D|d|1|2|3|4|5|6|7|8|9)/
    //   );

    // const tempOutput = [];

    // for (const [index, substring] of substrings.entries()) {
    //   // Trim leading and trailing whitespace from the substring
    //   const trimmed = substring.trim();

    //   // Check if the substring is a special pattern
    //   // MOTION INPUTS
    //   if (trimmed === "236")
    //     tempOutput.push(<MotionInput input="236" key={index} />);
    //   else if (trimmed === "66")
    //     tempOutput.push(<MotionInput input="66" key={index} />);
    //   else if (trimmed === "41236987")
    //     tempOutput.push(<MotionInput input="41236987" key={index} />);
    //   else if (trimmed === "63214789")
    //     tempOutput.push(<MotionInput input="41236987" flip key={index} />);
    //   else if (trimmed === "214")
    //     tempOutput.push(<MotionInput input="236" flip key={index} />);
    //   else if (trimmed === "41236")
    //     tempOutput.push(<MotionInput input="41236" key={index} />);
    //   else if (trimmed === "63214")
    //     tempOutput.push(<MotionInput input="41236" flip key={index} />);
    //   else if (trimmed === "623")
    //     tempOutput.push(<MotionInput input="623" key={index} />);
    //   else if (trimmed === "421")
    //     tempOutput.push(<MotionInput input="623" flip key={index} />);
    //   else if (trimmed === "1")
    //     tempOutput.push(<MotionInput input="6" deg="-45" flip key={index} />);
    //   else if (trimmed === "2")
    //     tempOutput.push(<MotionInput input="6" deg="90" key={index} />);
    //   else if (trimmed === "3")
    //     tempOutput.push(<MotionInput input="6" deg="45" key={index} />);
    //   else if (trimmed === "4")
    //     tempOutput.push(<MotionInput input="6" flip key={index} />);
    //   else if (trimmed === "5")
    //     tempOutput.push(<MotionInput input="5" key={index} />);
    //   else if (trimmed === "6")
    //     tempOutput.push(<MotionInput input="6" key={index} />);
    //   else if (trimmed === "7")
    //     tempOutput.push(<MotionInput input="6" deg="45" flip key={index} />);
    //   else if (trimmed === "8")
    //     tempOutput.push(<MotionInput input="6" deg="-90" key={index} />);
    //   else if (trimmed === "9")
    //     tempOutput.push(<MotionInput input="6" deg="-45" key={index} />);
    //   // ACTION INPUTS
    //   else if (trimmed === "p")
    //     tempOutput.push(<ActionInput input="p" key={index} />);
    //   else if (trimmed === "k")
    //     tempOutput.push(<ActionInput input="k" key={index} />);
    //   else if (trimmed === "s")
    //     tempOutput.push(<ActionInput input="s" key={index} />);
    //   else if (trimmed === "d")
    //     tempOutput.push(<ActionInput input="d" key={index} />);
    //   else if (trimmed === "h")
    //     tempOutput.push(<ActionInput input="h" key={index} />);
    //   else if (trimmed === "c.") tempOutput.push("(Crouch)");
    //   else if (trimmed === "j.") tempOutput.push("(Jump)");
    //   else if (trimmed === ">")
    //     tempOutput.push(<MotionInput input=">" key={index} />);
    //   else if (trimmed === "->" || trimmed === "~")
    //     tempOutput.push(<MotionInput input="->" key={index} />);
    //   else if (trimmed === ">>") tempOutput.push("(Dash)");
    //   else if (trimmed === ",")
    //     tempOutput.push(<MotionInput input="," key={index} />);
    //   // MECHANICS
    //   else if (trimmed === "rc")
    //     tempOutput.push(<ActionInput input="rc" key={index} />);
    //   else if (trimmed === "frc")
    //     tempOutput.push(<ActionInput input="frc" key={index} />);
    //   // if doesn't find anything, return original value
    //   else tempOutput.push(trimmed);
    // }

    // setOutput(tempOutput);
  }, [rawInput]);

  const value = { setRawInput, output };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};
