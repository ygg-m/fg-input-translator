import { Tooltip, TooltipWrapper } from "react-tooltip";
import { useInput } from "../contexts/InputContext";
import { TooltipContent } from "./index";

export const Input = ({ inputObj, tech }) => {
  const { showTooltip } = useInput();
  const { name, type } = inputObj;
  const haveImg = inputObj.img !== "" || inputObj.img?.length > 0;
  const haveStyle = typeof inputObj.style === "object";

  const Container = ({ children }) => {
    return <div className="z-20 min-w-[2rem]">{children}</div>;
  };

  if (!haveImg && !haveStyle) {
    return (
      <Container>
        <TooltipWrapper tooltipId={name}>
          <div className="w-fit select-none rounded-md bg-neutral-900 px-2 outline outline-1 outline-neutral-800 duration-200 hover:text-cyan-500 hover:outline-cyan-500">
            {name}
          </div>
          {tech && tech}
        </TooltipWrapper>
        {showTooltip && (
          <Tooltip
            id={name}
            content={<TooltipContent obj={inputObj} />}
            clickable
          />
        )}
      </Container>
    );
  }

  if (haveImg && !haveStyle) {
    const { img } = inputObj;
    return (
      <Container>
        <TooltipWrapper tooltipId={name}>
          <div className="hover:shadow-cyan text-neutral-700 duration-200 hover:text-cyan-500">
            {img}
          </div>
          {tech && tech}
        </TooltipWrapper>

        {showTooltip && (
          <Tooltip
            id={name}
            content={<TooltipContent obj={inputObj} />}
            clickable
          />
        )}
      </Container>
    );
  }

  if (haveImg && haveStyle) {
    const { img, style } = inputObj;
    return (
      <Container>
        <TooltipWrapper tooltipId={name}>
          <div style={style} className="hover:shadow-cyan duration-200">
            {img}
          </div>
          {tech && tech}
        </TooltipWrapper>

        {showTooltip && (
          <Tooltip
            id={name}
            content={<TooltipContent obj={inputObj} />}
            clickable
          />
        )}
      </Container>
    );
  }
};
