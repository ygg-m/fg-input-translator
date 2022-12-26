import nextCancel from "../images/inputs/ArrowCancel.svg";
import link from "../images/inputs/ArrowLink.svg";
import next from "../images/inputs/ArrowNext.svg";
import quarterCircle from "../images/inputs/Motion236.svg";
import halfCircle from "../images/inputs/Motion41236.svg";
import fullCircle from "../images/inputs/Motion41236987.svg";
import stand from "../images/inputs/Motion5.svg";
import foward from "../images/inputs/Motion6.svg";
import dragonPunch from "../images/inputs/Motion623.svg";
import dash from "../images/inputs/Motion66.svg";

export const MotionInput = ({ input, deg, flip }) => {
  let style = {};
  if (deg && flip) style = { transform: `rotate(${deg}deg) scaleX(-1)` };
  if (deg && !flip) style = { transform: `rotate(${deg}deg)` };
  if (!deg && flip) style = { transform: `scaleX(-1)` };
  if (!deg && !flip) style = {};

  let inputImg;

  if (input === "236") inputImg = quarterCircle;
  if (input === "41236") inputImg = halfCircle;
  if (input === "41236987") inputImg = fullCircle;
  if (input === "6") inputImg = foward;
  if (input === "623") inputImg = dragonPunch;
  if (input === "5") inputImg = stand;
  if (input === ">") inputImg = next;
  if (input === "66") inputImg = dash;
  if (input === ",") inputImg = link;
  if (input === "->" || input === "~") inputImg = nextCancel;

  return (
    <div className="motion-input-container">
      <img
        src={inputImg}
        alt={`${input} Input`}
        style={Object.assign({}, style)}
      />
    </div>
  );
};
