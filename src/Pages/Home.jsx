import { InputField, Options, Output } from "../components/index";
import { useInput } from "../contexts/InputContext";

export const Home = () => {
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
