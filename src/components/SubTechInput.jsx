import { useRef, useState } from "react";
import { Tooltip, TooltipWrapper } from "react-tooltip";
import { TooltipContent } from "./index";

export const SubTechInput = ({ inputObj, value }) => {
  const { name } = inputObj;
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const haveImg = inputObj.img?.length > 0;
  const haveStyle = inputObj.style?.length > 0;
  const elementRef = useRef(null);

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
