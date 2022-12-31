export const Tooltip = ({ elRef, obj, visible, offset }) => {
  const { description, input, moreLink, moreName } = obj;
  const haveDescription = description?.length > 0;
  const haveKnowMore = moreLink?.length > 0;
  const haveKnowMoreName = moreName?.length > 0;

  if (haveDescription)
    return (
      <div
        className={
          visible ? "tooltip-container show" : "tooltip-container hidden"
        }
        style={{
          bottom: elRef?.current?.offsetTop + offset,
          left: elRef?.current?.offsetLeft + elRef?.current?.offsetWidth / 2,
        }}
      >
        <div className="tooltip">
          <div className="tooltip-input">
            Input: <span>{input}</span>
          </div>
          <span>{description}</span>
          {haveKnowMore && (
            <a className="more-link" href={moreLink}>
              {haveKnowMoreName ? `${moreName} →` : "Know More →"}
            </a>
          )}
        </div>
      </div>
    );
};
