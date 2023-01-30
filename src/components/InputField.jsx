import { useInput } from "../contexts/InputContext";

export const InputField = () => {
  const { setRawInput, rawInput } = useInput();

  return (
    <input
      className="py-2 px-4 z-10 w-full duration-200 rounded-xl border-4 border-neutral-900 outline outline-1 outline-neutral-800 bg-neutral-800 text-neutral-500 focus:text-neutral-400 focus:outline-neutral-600"
      type="text"
      id="input"
      name="input"
      placeholder="Insert input (try '236P' or '623P'!)"
      onChange={(e) => setRawInput(e.target.value)}
      value={rawInput}
    />
  );
};
