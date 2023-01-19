import { useRef, useState } from "react";
import { Tooltip, TooltipWrapper } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { TooltipContent } from "./index";

export const Wrapper = ({ tech, input }) => {
  const { name } = tech;
  const elementRef = useRef(null);
  const { createInput } = useInput();

  const TooltipContent = () => {
    const { name, description, input, moreLink, moreName } = tech;
    const haveDescription = description?.length > 0;
    const haveKnowMore = moreLink?.length > 0;
    const haveKnowMoreName = moreName?.length > 0;
    return (
      <div className="tooltip">
        <span>{name}</span>
        <div className="tooltip-input">
          Input: <span>{input}</span>
        </div>
        {haveDescription && <span>{description}</span>}
        {haveKnowMore && (
          <a className="more-link" href={moreLink}>
            {haveKnowMoreName ? `${moreName} →` : "Know More →"}
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="wrapper" key={uuidv4()}>
      {createInput(input)}

      <TooltipWrapper tooltipId={name}>
        <div className="tech-tag" key={uuidv4()} ref={elementRef}>
          {name}
        </div>
      </TooltipWrapper>
      <Tooltip id={name} content={<TooltipContent obj={tech} />} clickable />
    </div>
  );
};
