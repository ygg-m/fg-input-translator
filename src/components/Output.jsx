import React from "react";
import { useInput } from "../contexts/InputContext";

export const Output = () => {
  const { output } = useInput();
  return <div className="output-container">{output}</div>;
};
