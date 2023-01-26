import { Tooltip, TooltipWrapper } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { TooltipContent } from "./index";

export const Wrapper = ({ tech, input }) => {
  const { createInput } = useInput();
  if (!tech || !input) return;
  const { name } = tech;
  return (
    <div className="wrapper" key={uuidv4()}>
      {createInput(input)}
      <TooltipWrapper tooltipId={name}>
        <div className="tech-tag" key={uuidv4()}>
          {name}
        </div>
      </TooltipWrapper>
      <Tooltip id={name} content={<TooltipContent obj={tech} />} clickable />
    </div>
  );
};
