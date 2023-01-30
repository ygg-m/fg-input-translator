import { Tooltip, TooltipWrapper } from "react-tooltip";
import { TooltipContent } from "./index";

export const Input = ({ inputObj, tech }) => {
  const { name, type } = inputObj;
  const haveImg = inputObj.img !== "" || inputObj.img?.length > 0;
  const haveStyle = typeof inputObj.style === "object";

  const Container = ({ children }) => {
    return <div className="min-w-[2rem] z-20">{children}</div>;
  };

  if (!haveImg && !haveStyle) {
    return (
      <Container>
        <TooltipWrapper tooltipId={name}>
          <div className="w-fit px-2 rounded-full bg-neutral-900 select-none duration-200 hover:text-cyan-500">
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
          <div className="duration-200 hover:shadow-cyan">{img}</div>
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
          <div style={style} className="duration-200 hover:shadow-cyan">
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
