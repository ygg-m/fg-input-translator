import { Tooltip, TooltipWrapper } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { TooltipContent } from "./index";

export const Eddie = ({ input, tech }) => {
  const { createInput } = useInput();
  if (!input || !tech) return;
  const { name } = tech;
  const isRegular = name.includes("Regular");

  return (
    <div className="multi-hit" key={uuidv4()}>
      <TooltipWrapper tooltipId={name}>
        <div className="tech-tag" key={uuidv4()} style={{ maxWidth: "60px" }}>
          {isRegular ? "Regular Shadow" : "Vice Shadow"}
        </div>
      </TooltipWrapper>
      <Tooltip id={name} content={<TooltipContent obj={tech} />} clickable />
      {createInput(input)}
    </div>
  );
};
