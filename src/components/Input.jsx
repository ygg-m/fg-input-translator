import { useInput } from "../contexts/InputContext";

export const Input = () => {
  const { setRawInput, rawInput } = useInput();

  return (
    <input
    className=''
      type="text"
      id="input"
      name="input"
      placeholder="Insert input (try '236P' or '623P'!)"
      onChange={(e) => setRawInput(e.target.value)}
      value={rawInput}
    />
  );
};
