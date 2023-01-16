export const Tooltip = ({ elRef, obj, visible, offset }) => {
  const { name, description, input, moreLink, moreName } = obj;
  const haveDescription = description?.length > 0;
  const haveKnowMore = moreLink?.length > 0;
  const haveKnowMoreName = moreName?.length > 0;

  const state = {
    x: 0,
    y: 0,
  };

  console.log(elRef?.current?.offsetTop + offset);

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
