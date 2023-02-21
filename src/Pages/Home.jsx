import { useRef } from "react";
import { InputField, Options, Output } from "../components/index";
import { InputProvider } from "../contexts/index";

export const Home = () => {
  return (
    <>
      <InputProvider>
        <Options />
        <InputField />
        <Output />
      </InputProvider>
    </>
  );
};
