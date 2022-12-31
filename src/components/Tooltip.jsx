export const Tooltip = ({ elRef, obj, visible }) => {
  const { description, moreLink, moreName } = obj;
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
          bottom: elRef?.current?.offsetTop + 85,
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
