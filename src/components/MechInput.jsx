import React from "react";

export const MechInput = ({ inputObj }) => {
  const { name, url, description } = inputObj;
  return (
    <div className="motion-input-container">
      <img src={url} alt={name} />
    </div>
  );
};
