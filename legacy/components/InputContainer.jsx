import { useInput } from "../contexts/InputContext";
import { InputField, Options, Output } from "./index";

export const InputContainer = () => {
  const { chroma } = useInput();

  return (
    <div
      className={
        chroma
          ? "flex w-full flex-col items-center gap-4 bg-[#32cd33] p-4 px-8"
          : "flex w-full flex-col items-center gap-4 p-4 px-8"
      }
    >
      <Options />
      <InputField />
      <Output />
    </div>
  );
};
