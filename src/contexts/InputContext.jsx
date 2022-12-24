import { createContext, useContext, useEffect, useState } from "react";
import { Input } from "../components";

const InputContext = createContext();

export const useInput = () => useContext(InputContext);

export const InputProvider = ({ children }) => {
  const [rawInput, setRawInput] = useState("");
  const [inputArray, setInputArray] = useState([]);
  const [output, setOutput] = useState([]);

  useEffect(() => {
    if (rawInput !== "") console.log(`Input changed: ${rawInput} `);
  }, [rawInput]);

  const value = { setRawInput };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};
