import { useInput } from "../contexts/InputContext";

export const Output = () => {
  const { output, outputRef } = useInput();

  if (output.length > 0)
    return (
      <div
        className="flex w-fit flex-wrap items-center justify-center gap-y-2 rounded-lg bg-neutral-900 p-2 outline outline-1 outline-neutral-700"
        ref={outputRef}
      >
        {output}
      </div>
    );
};
