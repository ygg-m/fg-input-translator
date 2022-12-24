import { useInput } from "../contexts/InputContext";

export const Input = () => {
  const { setRawInput } = useInput();

  return (
    <input
      type="text"
      id="input"
      name="input"
      placeholder="Insert input (try '236P' or '623P'!)"
      onChange={(e) => setRawInput(e.target.value)}
    />
  );
};
