import React from "react";
import { useInput } from "../contexts/InputContext";

export const Output = () => {
  const { output } = useInput();
  return <div className="flex items-center justify-center flex-wrap p-2 outline outline-1 outline-neutral-800 rounded-lg">{output}</div>;
};
