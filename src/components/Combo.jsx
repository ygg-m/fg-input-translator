import React from "react";

export const Combo = ({ children }) => {
  return (
    <div className="flex w-fit items-center justify-center gap-1 rounded-lg bg-neutral-800 p-2">
      {children}
    </div>
  );
};
