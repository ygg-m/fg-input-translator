import { useRef, useState } from "react";
import { Tooltip } from "./Tooltip";

export const TechInput = ({ inputObj }) => {
  const { name } = inputObj;
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const haveImg = inputObj.url?.length > 0;
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

  if (!haveImg && !haveStyle)
    return (
      <div
        onMouseOver={showTooltip}
        onMouseOut={hideTooltip}
        onClick={clickShowTooltip}
        className="mech input-container"
      >
        <div className="input-name" ref={elementRef}>{name}</div>
        <Tooltip elRef={elementRef} obj={inputObj} visible={tooltipVisible} />
      </div>
    );

  if (haveImg && !haveStyle) {
    const { url } = inputObj;
    return (
      <div
        onMouseOver={showTooltip}
        onMouseOut={hideTooltip}
        onClick={clickShowTooltip}
        className="motion input-container"
      >
        <img ref={elementRef} src={url} alt={name} />
        <Tooltip elRef={elementRef} obj={inputObj} visible={tooltipVisible} />
      </div>
    );
  }

  if (haveImg && haveStyle) {
    const { url, style } = inputObj;
    const transform = `rotate(${style[0]}) scaleX(${style[1]})`;
    return (
      <div
        onMouseOver={showTooltip}
        onMouseOut={hideTooltip}
        onClick={clickShowTooltip}
        className="motion input-container"
      >
        <img
          ref={elementRef}
          src={url}
          alt={name}
          style={{ transform: transform }}
        />
        <Tooltip elRef={elementRef} obj={inputObj} visible={tooltipVisible} />
      </div>
    );
  }
};
