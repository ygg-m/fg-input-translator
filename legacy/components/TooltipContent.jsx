import { v4 as uuidv4 } from "uuid";
export const TooltipContent = ({ obj }) => {
  const { name, description, input, moreLink, moreName } = obj;
  const haveDescription = description?.length > 0;
  const haveCharacterName = obj.character?.length > 0;
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
    <div className="flex max-w-sm flex-col text-neutral-400">
      <span className="font-bold text-cyan-500">{name}</span>
      <div>
        Input:{" "}
        {isInputArray ? (
          inputList
        ) : (
          <span className="font-bold text-cyan-500">{input}</span>
        )}
      </div>
      {haveCharacterName && (
        <div>
          Character:{" "}
          <span className="font-bold text-cyan-500">{obj.character}</span>
        </div>
      )}
      {haveDescription && <span className="italic">{description}</span>}
      {haveKnowMore && (
        <div className="flex w-full justify-center">
          <a
            className="hover:shadow-cyan mt-2 rounded p-2 text-center font-bold outline outline-1 outline-neutral-700 duration-200 hover:px-4 hover:text-cyan-500 hover:outline-cyan-500"
            href={moreLink}
          >
            {haveKnowMoreName ? `${moreName} →` : "Know More →"}
          </a>
        </div>
      )}
    </div>
  );
};
