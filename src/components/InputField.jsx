import { useInput } from "../contexts/InputContext";

export const InputField = () => {
  const { setRawInput, rawInput, chroma } = useInput();

  return (
    <input
      className="z-10 w-full rounded-xl border-4 border-neutral-900 bg-neutral-800 py-2 px-4 text-neutral-400 outline outline-1 outline-neutral-700 duration-200 focus:text-neutral-400 focus:outline-neutral-600"
      type="text"
      id="input"
      name="input"
      placeholder="Insert input (try '236P' or '623P'!)"
      onChange={(e) => setRawInput(e.target.value)}
      value={rawInput}
    />
  );
};
