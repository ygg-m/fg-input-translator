import { Tooltip, TooltipWrapper } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { TooltipContent } from "./index";

export const Wrapper = ({ tech, techValue, children }) => {
  if (!tech) return;
  const { name } = tech;
  const isRepeat = name === "Repeat";
  const isMulti = name === "Single / Multiple Hits";
  const isSingleHit = techValue === "1";
  return (
    <div
      className="bg-neutral-900 rounded-lg p-2 flex flex-col justify-center items-center"
      key={uuidv4()}
    >
      <div className="flex gap-1 items-center justify-center">{children}</div>
      <TooltipWrapper tooltipId={name}>
        <div
          className="text-sm duration-200 flex justify-center hover:scale-125 hover:z-10 hover:text-cyan-500 hover:shadow-cyan hover:bg-neutral-900 hover:px-2 py-1 rounded-md"
          key={uuidv4()}
        >
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
