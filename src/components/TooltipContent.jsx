import { v4 as uuidv4 } from "uuid";
export const TooltipContent = ({ obj }) => {
  const { name, description, input, moreLink, moreName } = obj;
  const haveDescription = description?.length > 0;
  const haveKnowMore = moreLink?.length > 0;
  const haveKnowMoreName = moreName?.length > 0;
  const isInputArray = Array.isArray(input);
  let inputList;
  if (isInputArray) {
    inputList = input
      .map((e) => (
        <span className="font-bold text-cyan-500" key={uuidv4()}>
          {e}
        </span>
      ))
      .map((e, i) => {
        return [e, i !== input.length - 1 ? " or " : ""];
      });
  }

  return (
    <div className="flex flex-col text-neutral-400">
      <span className="font-bold text-cyan-500">{name}</span>
      <div>
        Input:{" "}
        {isInputArray ? (
          inputList
        ) : (
          <span className="font-bold text-cyan-500">{input}</span>
        )}
      </div>
      {haveDescription && <span className="italic">{description}</span>}
      {haveKnowMore && (
        <a
          className="w-full duration-200 mt-2 p-2 text-center outline outline-1 outline-neutral-700 hover:outline-cyan-500 rounded hover:text-cyan-500 font-bold hover:shadow-cyan"
          href={moreLink}
        >
          {haveKnowMoreName ? `${moreName} →` : "Know More →"}
        </a>
      )}
    </div>
  );
};
