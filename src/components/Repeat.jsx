import { Tooltip, TooltipWrapper } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { TooltipContent } from "./index";

export const Repeat = ({ children, repeats }) => {
  const { allInputs } = useInput();

  const tech = allInputs.filter((e) => e.name === "Repeat");
  console.log(tech);

  return (
    <div className="repeat" key={uuidv4()}>
      {children}
      <TooltipWrapper tooltipId={tech.name}>
        <div className="tech-tag" key={uuidv4()} style={{ width: "75px" }}>
          Repeat {repeats}
        </div>
      </TooltipWrapper>
      <Tooltip
        id={tech.name}
        content={<TooltipContent obj={tech} />}
        clickable
      />
    </div>
  );
};
