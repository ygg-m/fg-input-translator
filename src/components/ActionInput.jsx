import quarterCircle from "../images/inputs/236.svg";

export const ActionInput = ({ input, deg, flip }) => {
  let style = {};
  if (deg && flip) style = { transform: `rotate(${deg}deg) scaleX(-1)` };
  if (deg && !flip) style = { transform: `rotate(${deg}deg)` };
  if (!deg && flip) style = { transform: `scaleX(-1)` };
  if (!deg && !flip) style = {};

  let inputImg;

  if (input === "236") inputImg = quarterCircle;

  return (
    <div className="motion-input-container" style={Object.assign({}, style)}>
      <img src={inputImg} alt={`${input} Input`} />
    </div>
  );
};
