import { Tooltip, TooltipWrapper } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { TooltipContent } from "./index";

export const MultiHit = ({ input, tech, hits }) => {
  const { name } = tech;
  const { createInput } = useInput();

  return (
    <div className="multi-hit" key={uuidv4()}>
      {createInput(input)}
      <TooltipWrapper tooltipId={name}>
        <div className="tech-tag" key={uuidv4()}>
          {`${hits} Hits`}
        </div>
      </TooltipWrapper>
      <Tooltip id={name} content={<TooltipContent obj={tech} />} clickable />
    </div>
  );
};
