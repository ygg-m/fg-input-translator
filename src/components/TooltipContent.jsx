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
      .map((e) => <span key={uuidv4()}>{e}</span>)
      .map((e, i) => {
        return [e, i !== input.length - 1 ? " or " : ""];
      });
  }

  return (
    <>
      <span>{name}</span>
      <div className="tooltip-input">
        Input: {isInputArray ? inputList : <span>{input}</span>}
      </div>
      {haveDescription && <span>{description}</span>}
      {haveKnowMore && (
        <a className="more-link" href={moreLink}>
          {haveKnowMoreName ? `${moreName} →` : "Know More →"}
        </a>
      )}
    </>
  );
};
