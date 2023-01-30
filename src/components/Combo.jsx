import React from "react";

export const Combo = ({ children }) => {
  return (
    <div className="flex w-fit items-center justify-center gap-1 p-2 rounded-lg bg-neutral-800">
      {children}
    </div>
  );
};
