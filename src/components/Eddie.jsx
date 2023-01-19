import { useRef, useState } from "react";
import { Tooltip, TooltipWrapper } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { TooltipContent } from "./index";

export const Eddie = ({ input, tech, hits }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { name } = tech;

  const isRegular = name.includes("Regular");

  const elementRef = useRef(null);
  const { createInput } = useInput();

  return (
    <div className="multi-hit" key={uuidv4()}>
      {createInput(input)}

      <TooltipWrapper tooltipId={name}>
        <div className="tech-tag" key={uuidv4()} ref={elementRef}>
          {isRegular ? "Regular" : "Vice"}
        </div>
      </TooltipWrapper>
      <Tooltip id={name} content={<TooltipContent obj={tech} />} clickable />
    </div>
  );
};
