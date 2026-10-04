import { Tooltip, TooltipWrapper } from "react-tooltip";
import { TooltipContent } from "./index";

export const SubTechInput = ({ inputObj, value }) => {
  const { name } = inputObj;

  return (
    <>
      <TooltipWrapper tooltipId={name}>
        <div className="tech-container">
          {name}
          {value && value}
        </div>
      </TooltipWrapper>
      <Tooltip
        id={name}
        content={<TooltipContent obj={inputObj} />}
        clickable
      />
    </>
  );
};
