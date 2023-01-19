import { Tooltip as ReactTooltip } from "react-tooltip";

export const Tooltip = ({ elRef, obj, visible, offset, lOffset }) => {
  const { name, description, input, moreLink, moreName } = obj;
  const haveDescription = description?.length > 0;
  const haveKnowMore = moreLink?.length > 0;
  const haveKnowMoreName = moreName?.length > 0;
  const bottomOffset = elRef?.current?.offsetTop + offset;
  if (lOffset === undefined) lOffset = 0;
  const leftOffset =
    elRef?.current?.offsetLeft + elRef?.current?.offsetWidth / 2;
  return (
    <div
      className={
        visible ? "tooltip-container show" : "tooltip-container hidden"
      }
      style={{
        bottom: bottomOffset,
        left: leftOffset + lOffset,
      }}
    >
      <div className="tooltip">
        <span>{name}</span>
        <div className="tooltip-input">
          Input: <span>{input}</span>
        </div>
        {haveDescription && <span>{description}</span>}
        {haveKnowMore && (
          <a className="more-link" href={moreLink}>
            {haveKnowMoreName ? `${moreName} →` : "Know More →"}
          </a>
        )}
      </div>
    </div>
  );
};
