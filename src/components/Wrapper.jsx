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
      className="bg-neutral-900 rounded-lg px-2 py-1 pt-1 flex flex-col gap-1 justify-center items-center hover:z-50"
      key={uuidv4()}
    >
      <div className="flex gap-1 items-center justify-center">{children}</div>
      <TooltipWrapper tooltipId={name}>
        <div
          className="text-sm duration-200 flex justify-center hover:text-cyan-500 hover:shadow-cyan select-none rounded-md"
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
