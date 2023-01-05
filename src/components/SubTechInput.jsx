import { useRef, useState } from "react";
import { Tooltip } from "./Tooltip";

export const SubTechInput = ({ inputObj, value }) => {
  const { name } = inputObj;
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const haveImg = inputObj.img?.length > 0;
  const haveStyle = inputObj.style?.length > 0;
  const elementRef = useRef(null);
  const showTooltip = () => {
    setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  const clickShowTooltip = () => {
    showTooltip();
    setTimeout(() => {
      hideTooltip();
    }, 3000);
  };

  return (
    <div
      onMouseOver={showTooltip}
      onMouseOut={hideTooltip}
      onClick={clickShowTooltip}
      className="tech-container"
    >
      {name}
      {value && value}
      {/* <Tooltip
        elRef={elementRef}
        obj={inputObj}
        visible={tooltipVisible}
        offset={85}
      /> */}
    </div>
  );
};
