import { Tooltip, TooltipWrapper } from "react-tooltip";
import { TooltipContent } from "./index";

export const TechInput = ({ inputObj, tech }) => {
  const { name, type } = inputObj;
  const haveImg = inputObj.img !== "" || inputObj.img?.length > 0;
  const haveStyle = typeof inputObj.style === "object";

  const Container = ({ children }) => {
    return <div className={`${type} ${tech ? "tech" : ""}`}>{children}</div>;
  };

  if (!haveImg && !haveStyle) {
    return (
      <Container>
        <TooltipWrapper tooltipId={name}>
          <div className="input-name">{name}</div>
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
          {img}
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

  if (haveImg && haveStyle) {
    const { img, style } = inputObj;
    return (
      <Container>
        <TooltipWrapper tooltipId={name}>
          <div style={style}>{img}</div>
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
