import { useRef } from "react";
import { GameSelect, InputField, Output } from "../components/index";
import { InputProvider } from "../contexts/index";

export const Home = () => {
  return (
    <>
      <InputProvider>
        <GameSelect />
        <InputField />
        <Output />
      </InputProvider>
    </>
  );
};
