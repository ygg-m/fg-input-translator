import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { Tooltip } from "./Tooltip";

export const Repeat = ({ input, tech, repeats }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const elementRef = useRef(null);
  const { createInput } = useInput();

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
    <div className="repeat-container" key={uuidv4()}>
      {createInput(input)}
      <div
        className="tech-tag"
        key={uuidv4()}
        ref={elementRef}
        onMouseOver={showTooltip}
        onMouseOut={hideTooltip}
        onClick={clickShowTooltip}
      >
        {tech.name} {repeats}
      </div>
      <Tooltip
        elRef={elementRef}
        obj={tech}
        visible={tooltipVisible}
        offset={0}
      />
    </div>
  );
};
