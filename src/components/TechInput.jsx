import { useRef, useState } from "react";
import { Tooltip } from "./Tooltip";

export const TechInput = ({ inputObj, tech }) => {
  const { name, type } = inputObj;
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const haveImg = inputObj.img !== "" || inputObj.img?.length > 0;
  const haveStyle = typeof inputObj.style === "object";
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

  if (!haveImg && !haveStyle) {
    return (
      <div
        onMouseOver={showTooltip}
        onMouseOut={hideTooltip}
        onClick={clickShowTooltip}
        className={`${type} ${tech ? "tech" : ""}`}
      >
        <div className="input-name" ref={elementRef}>
          {name}
        </div>
        {tech && tech}
        {/* <Tooltip
          elRef={elementRef}
          obj={inputObj}
          visible={tooltipVisible}
          offset={45}
        /> */}
      </div>
    );
  }

  if (haveImg && !haveStyle) {
    const { img } = inputObj;
    return (
      <div
        onMouseOver={showTooltip}
        onMouseOut={hideTooltip}
        onClick={clickShowTooltip}
        className={`${type} ${tech ? "tech" : ""}`}
      >
        {img}
        {tech && tech}
        {/* <Tooltip
          elRef={elementRef}
          obj={inputObj}
          visible={tooltipVisible}
          offset={85}
        /> */}
      </div>
    );
  }

  if (haveImg && haveStyle) {
    const { img, style } = inputObj;
    return (
      <div
        onMouseOver={showTooltip}
        onMouseOut={hideTooltip}
        onClick={clickShowTooltip}
        className={`${type} ${tech ? "tech" : ""}`}
      >
        <div style={style}>{img}</div>
        {tech && tech}
        {/* <Tooltip
          elRef={elementRef}
          obj={inputObj}
          visible={tooltipVisible}
          offset={65}
        /> */}
      </div>
    );
  }
};
