export const ActionInput = ({ inputObj }) => {
  const { name, description, url } = inputObj;
  return (
    <div className="motion-input-container">
      <img src={url} alt={name} />
    </div>
  );
};
