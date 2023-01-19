export const TooltipContent = ({ obj }) => {
  const { name, description, input, moreLink, moreName } = obj;
  const haveDescription = description?.length > 0;
  const haveKnowMore = moreLink?.length > 0;
  const haveKnowMoreName = moreName?.length > 0;
  return (
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
  );
};
