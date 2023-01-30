import React from "react";
import { useInput } from "../contexts/InputContext";

export const Output = () => {
  const { output } = useInput();
  return (
    <div className="flex flex-wrap items-center justify-center gap-y-2 rounded-lg p-2 outline outline-1 outline-neutral-800">
      {output}
    </div>
  );
};
