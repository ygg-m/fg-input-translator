import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { Wrapper } from "./Wrapper";

export const OptionalContainer = ({ inputs }) => {
  const { allInputs, createInput } = useInput();
  const tech = allInputs.filter((e) => e.name === "Optional")[0];

  if (Array.isArray(inputs)) {
    const clean = inputs.filter((e) => {
      if (e === ")") return;
      if (e === "(") return;
      else return e;
    });

    const inputsObj = createInput(clean);

    return (
      <div className="combo" key={uuidv4()}>
        <Wrapper input={inputs} tech={tech} key={uuidv4()} />
      </div>
    );
  }
  //
  else {
    return (
      <div className="complex-container" key={uuidv4()}>
        {inputs}
        <Wrapper tech={tech} key={uuidv4()} />
      </div>
    );
  }
};
