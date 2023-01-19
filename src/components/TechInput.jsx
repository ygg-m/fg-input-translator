import { useRef, useState } from "react";
import { Tooltip, TooltipWrapper } from "react-tooltip";
import { TooltipContent } from "./index";

export const TechInput = ({ inputObj, tech }) => {
  const { name, type, description } = inputObj;
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const haveImg = inputObj.img !== "" || inputObj.img?.length > 0;
  const haveStyle = typeof inputObj.style === "object";
  const elementRef = useRef(null);

  const Container = ({ children }) => {
    return <div className={`${type} ${tech ? "tech" : ""}`}>{children}</div>;
  };

  if (!haveImg && !haveStyle) {
    return (
      <Container>
        <TooltipWrapper tooltipId={name}>
          <div className="input-name" ref={elementRef}>
            {name}
          </div>
          {tech && tech}
        </TooltipWrapper>
        <Tooltip
          id={name}
          content={<TooltipContent obj={inputObj} />}
          clickable
        />
      </Container>
    );
  }

  if (haveImg && !haveStyle) {
    const { img } = inputObj;
    return (
      <Container>
        <TooltipWrapper tooltipId={name}>
          <div ref={elementRef} data-id="my-component" data-tip="hello world">
            {img}
            {tech && tech}
          </div>
        </TooltipWrapper>
        <Tooltip
          id={name}
          content={<TooltipContent obj={inputObj} />}
          clickable
        />
      </Container>
    );
  }

  if (haveImg && haveStyle) {
    const { img, style } = inputObj;
    return (
      <Container>
        <TooltipWrapper tooltipId={name}>
          <div style={style} ref={elementRef}>
            {img}
          </div>
          {tech && tech}
        </TooltipWrapper>
        <Tooltip
          id={name}
          content={<TooltipContent obj={inputObj} />}
          clickable
        />
      </Container>
    );
  }
};
