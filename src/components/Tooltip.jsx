export const Tooltip = ({ elRef, obj, visible }) => {
  const { description, moreLink, moreName } = obj;
  const haveKnowMore = moreLink.length > 0;
  const haveKnowMoreName = moreName.length > 0;

  return (
    <div
      className={
        visible ? "tooltip-container show" : "tooltip-container hidden"
      }
      style={{
        bottom: elRef?.current?.offsetTop + 50,
        left: elRef?.current?.offsetLeft + elRef?.current?.offsetWidth / 2,
      }}
    >
      <div className="tooltip">
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
