import React from "react";

export const MechInput = ({ inputObj }) => {
  const { name, url, description } = inputObj;
  return (
    <div className="mech-input-container">
      <span>{name}</span>
    </div>
  );
};
