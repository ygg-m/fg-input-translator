import { createContext, useContext, useEffect, useState } from "react";
import { ActionInput, MotionInput } from "../components/index";

const InputContext = createContext();

export const useInput = () => useContext(InputContext);

export const InputProvider = ({ children }) => {
  const [rawInput, setRawInput] = useState("");
  const [inputArray, setInputArray] = useState([]);
  const [output, setOutput] = useState([]);

  useEffect(() => {
    const substrings = rawInput
      .toLowerCase()
      .split(
        /(41236987|63214789|41236|63214|236|214|623|421| >|H|h|P|p|5|K|k|c.|j.|S|s|2|D|d|1|2|3|4|5|6|7|8|9)/
      );

    const tempOutput = [];

    for (const [index, substring] of substrings.entries()) {
      // Trim leading and trailing whitespace from the substring
      const trimmed = substring.trim();

      // Check if the substring is a special pattern
      // MOTION INPUTS
      if (trimmed === "236")
        tempOutput.push(<MotionInput input="236" key={index} />);
      else if (trimmed === "41236987")
        tempOutput.push(<MotionInput input="41236987" key={index} />);
      else if (trimmed === "63214789")
        tempOutput.push(<MotionInput input="41236987" flip key={index} />);
      else if (trimmed === "214")
        tempOutput.push(<MotionInput input="236" flip key={index} />);
      else if (trimmed === "41236")
        tempOutput.push(<MotionInput input="41236" key={index} />);
      else if (trimmed === "63214")
        tempOutput.push(<MotionInput input="41236" flip key={index} />);
      else if (trimmed === "623")
        tempOutput.push(<MotionInput input="623" key={index} />);
      else if (trimmed === "421")
        tempOutput.push(<MotionInput input="623" flip key={index} />);
      else if (trimmed === "1")
        tempOutput.push(<MotionInput input="6" deg="-45" flip key={index} />);
      else if (trimmed === "2")
        tempOutput.push(<MotionInput input="6" deg="90" key={index} />);
      else if (trimmed === "3")
        tempOutput.push(<MotionInput input="6" deg="45" key={index} />);
      else if (trimmed === "4")
        tempOutput.push(<MotionInput input="6" flip key={index} />);
      else if (trimmed === "5")
        tempOutput.push(<MotionInput input="5" key={index} />);
      else if (trimmed === "6")
        tempOutput.push(<MotionInput input="6" key={index} />);
      else if (trimmed === "7")
        tempOutput.push(<MotionInput input="6" deg="45" flip key={index} />);
      else if (trimmed === "8")
        tempOutput.push(<MotionInput input="6" deg="-90" key={index} />);
      else if (trimmed === "9")
        tempOutput.push(<MotionInput input="6" deg="-45" key={index} />);
      // ACTION INPUTS
      else if (trimmed === "p")
        tempOutput.push(<ActionInput input="p" key={index} />);
      else if (trimmed === "k")
        tempOutput.push(<ActionInput input="k" key={index} />);
      else if (trimmed === "s")
        tempOutput.push(<ActionInput input="s" key={index} />);
      else if (trimmed === "d")
        tempOutput.push(<ActionInput input="d" key={index} />);
      else if (trimmed === "h")
        tempOutput.push(<ActionInput input="h" key={index} />);
      else if (trimmed === "c.") tempOutput.push("(Crouch)");
      else if (trimmed === "j.") tempOutput.push("(Jump)");
      else if (trimmed === ">")
        tempOutput.push(<MotionInput input=">" key={index} />);
      else tempOutput.push(trimmed);
    }

    setOutput(tempOutput);
  }, [rawInput]);

  const value = { setRawInput, output };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};
