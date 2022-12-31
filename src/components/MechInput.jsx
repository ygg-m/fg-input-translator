import { useRef, useState } from "react";
import { Tooltip } from "./Tooltip";

export const MechInput = ({ inputObj }) => {
  const { name, description } = inputObj;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const clickShowTooltip = () => {
    showTooltip();
    setTimeout(() => {
      hideTooltip();
    }, 3000);
  };

  return (
    <>
      <div
        onMouseOver={showTooltip}
        onMouseOut={hideTooltip}
        onClick={clickShowTooltip}
        className="mech input-container"
      >
        <div ref={elementRef}>{name}</div>
        <Tooltip elRef={elementRef} obj={inputObj} visible={isVisible} />
      </div>
    </>
  );
};
