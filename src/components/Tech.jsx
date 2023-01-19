import { Tooltip, TooltipWrapper } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { TooltipContent } from "./index";

export const Tech = ({ input, tech }) => {
  const { name } = tech;
  const { createInput } = useInput();

  return (
    <div className="release" key={uuidv4()}>
      {createInput(input)}
      <TooltipWrapper tooltipId={name}>
        <div className="tech-tag" key={uuidv4()} data-tip="tooltip">
          {tech.name}
        </div>
      </TooltipWrapper>
      <Tooltip id={name} content={<TooltipContent obj={tech} />} clickable />
    </div>
  );
};
