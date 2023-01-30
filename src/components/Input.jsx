import { useInput } from "../contexts/InputContext";

export const Input = () => {
  const { setRawInput, rawInput } = useInput();

  return (
    <input
      className="py-2 px-4 z-10 w-full rounded-2xl border-4 border-neutral-800 outline-1 outline-neutral-700 bg-neutral-700 text-neutral-500"
      type="text"
      id="input"
      name="input"
      placeholder="Insert input (try '236P' or '623P'!)"
      onChange={(e) => setRawInput(e.target.value)}
      value={rawInput}
    />
  );
};
