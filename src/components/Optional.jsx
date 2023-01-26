export const Optional = ({ children }) => {
  if (!children) return;

  return <div className="optional">{children}</div>;
};
