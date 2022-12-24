import { createContext, useContext, useEffect, useState } from "react";
import { MotionInput } from "../components/index";

const InputContext = createContext();

export const useInput = () => useContext(InputContext);

export const InputProvider = ({ children }) => {
  const [rawInput, setRawInput] = useState("");
  const [inputArray, setInputArray] = useState([]);
  const [output, setOutput] = useState([]);

  useEffect(() => {
    const substrings = rawInput.split(
      /(236|214|41236|63214| >|P|p|5|K|c.|S|2|D)/
    );

    const tempOutput = [];

    for (const substring of substrings) {
      // Trim leading and trailing whitespace from the substring
      const trimmed = substring.trim();

      // Check if the substring is a special pattern
      // MOTION INPUTS
      if (trimmed === "236")
        tempOutput.push(<MotionInput input="236" key="236" />);
      else if (trimmed === "214")
        tempOutput.push(<MotionInput input="236" flip key="214" />);
      else if (trimmed === "41236") tempOutput.push("(FullCircleFoward)");
      else if (trimmed === "63214") tempOutput.push("(FullCircleBack)");
      
      // ACTION INPUTS
      else if (trimmed === "P" || trimmed === "p") tempOutput.push("Punch");
      else if (trimmed === "5") tempOutput.push("(Stand)");
      else if (trimmed === "K") tempOutput.push("Kick");
      else if (trimmed === "c.") tempOutput.push("(Crouch)");
      else if (trimmed === "2") tempOutput.push("(↓)");
      else if (trimmed === "4") tempOutput.push("(←)");
      else if (trimmed === "6") tempOutput.push("(→)");
      else if (trimmed === "8") tempOutput.push("(↑)");
      else if (trimmed === "S") tempOutput.push("Slash");
      else if (trimmed === "D") tempOutput.push("Dust");
      else if (trimmed === "H") tempOutput.push("HeavySlash");
      else if (trimmed === ">") tempOutput.push(" → ");
      else tempOutput.push(trimmed);
    }

    setOutput(tempOutput);
  }, [rawInput]);

  const value = { setRawInput, output };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};
