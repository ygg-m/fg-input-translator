import { createContext, useContext } from "react";
import { Input } from "../components";

const InputContext = createContext();

export const useInput = () => useContext(InputContext);

export const InputProvider = ({ children }) => {
  const value = {};

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};
