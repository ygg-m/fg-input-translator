export const MotionInput = ({ inputObj }) => {
  const { name, input, description, url, style } = inputObj;
  const transform = `rotate(${style[0]}) scaleX(${style[1]})`;

  return (
    <div className="motion-input-container">
      <img src={url} alt={name} style={{ transform: transform }} />
    </div>
  );
};
