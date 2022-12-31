export const Tooltip = ({ elRef, obj, visible }) => {
  const { description } = obj;
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
      <div className="tooltip">{description}</div>
    </div>
  );
};
