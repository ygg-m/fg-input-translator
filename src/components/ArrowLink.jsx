export const ArrowLink = ({ inputObj }) => {
  const { name, input, description, url } = inputObj;

  return (
    <div className="motion-input-container">
      <img src={url} alt={name} />
    </div>
  );
};
