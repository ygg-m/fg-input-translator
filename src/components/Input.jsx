import { Tooltip, TooltipWrapper } from "react-tooltip";
import { TooltipContent } from "./index";

export const Input = ({ inputObj, tech }) => {
  const { name } = inputObj;
  const haveImg = inputObj.img !== "" || inputObj.img?.length > 0;
  const haveStyle = typeof inputObj.style === "object";

  const Container = ({ children }) => {
    return <div className="w-4 h-4">{children}</div>;
  };

  if (!haveImg && !haveStyle) {
    return (
      <Container>
        <TooltipWrapper tooltipId={name}>
          <div className="w-full">{name}</div>
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
