import { useRef, useState } from "react";
import { Tooltip, TooltipWrapper } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { TooltipContent } from "./index";

export const Repeat = ({ input, tech, repeats }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { name } = tech;
  const elementRef = useRef(null);
  const { createInput } = useInput();

  return (
    <div className="repeat-container" key={uuidv4()}>
      {createInput(input)}

      <TooltipWrapper tooltipId={name}>
        <div
          className="tech-tag"
          key={uuidv4()}
          ref={elementRef}
          style={{ width: "75px" }}
        >
          {tech.name} {repeats}
        </div>
      </TooltipWrapper>
      <Tooltip id={name} content={<TooltipContent obj={tech} />} clickable />
    </div>
  );
};
