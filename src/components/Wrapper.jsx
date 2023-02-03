import { Tooltip, TooltipWrapper } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { TooltipContent } from "./index";

export const Wrapper = ({ tech, techValue, children }) => {
  const { showTooltip } = useInput();
  if (!tech) return;
  const { name } = tech;
  const isRepeat = name === "Repeat";
  const isMulti = name === "Single / Multiple Hits";
  const isSingleHit = techValue === "1";
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-lg bg-neutral-900 px-2 py-1 pt-1 outline outline-1 outline-neutral-700 duration-200 hover:z-50 hover:outline-cyan-500"
      key={uuidv4()}
    >
      <div className="flex items-center justify-center gap-1">{children}</div>
      <TooltipWrapper tooltipId={name}>
        <div
          className="hover:shadow-cyan flex select-none justify-center rounded-md text-sm duration-200 hover:text-cyan-500"
          key={uuidv4()}
        >
          {!isRepeat && !isMulti && name}
          {isMulti && isSingleHit && techValue + " Hit"}
          {isMulti && !isSingleHit && techValue + " Hits"}
          {isRepeat && name + " x" + techValue}
        </div>
      </TooltipWrapper>
      {showTooltip && (
        <Tooltip id={name} content={<TooltipContent obj={tech} />} clickable />
      )}
    </div>
  );
};
