import { Tooltip, TooltipWrapper } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { TooltipContent } from "./index";

export const Wrapper = ({ tech, techValue, children }) => {
  if (!tech) return;
  const { name } = tech;
  const isRepeat = name === "Repeat";
  const isMulti = name === "Single / Multiple Hits";
  const isSingleHit = techValue === "1";
  return (
    <div className="wrapper" key={uuidv4()}>
      <div className="inputs">{children}</div>
      <TooltipWrapper tooltipId={name}>
        <div className="tech-tag" key={uuidv4()}>
          {!isRepeat && !isMulti && name}
          {isMulti && isSingleHit && techValue + " Hit"}
          {isMulti && !isSingleHit && techValue + " Hits"}
          {isRepeat && name + " x" + techValue}
        </div>
      </TooltipWrapper>
      <Tooltip id={name} content={<TooltipContent obj={tech} />} clickable />
    </div>
  );
};
