import dust from "../images/inputs/ActionDust.svg";
import highSlash from "../images/inputs/ActionHighSlash.svg";
import kick from "../images/inputs/ActionKick.svg";
import punch from "../images/inputs/ActionPunch.svg";
import slash from "../images/inputs/ActionSlash.svg";

export const ActionInput = ({ input }) => {
  let inputImg;
  if (input === "p") inputImg = punch;
  if (input === "k") inputImg = kick;
  if (input === "h") inputImg = highSlash;
  if (input === "s") inputImg = slash;
  if (input === "d") inputImg = dust;

  return (
    <div className="motion-input-container">
      <img src={inputImg} alt={`${input} Input`} />
    </div>
  );
};
