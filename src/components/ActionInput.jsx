import dust from "../images/inputs/ActionDust.svg";
import forceRomanCancel from "../images/inputs/ActionForceRomanCancel.svg";
import heavySlash from "../images/inputs/ActionHeavySlash.svg";
import kick from "../images/inputs/ActionKick.svg";
import punch from "../images/inputs/ActionPunch.svg";
import romanCancel from "../images/inputs/ActionRomanCancel.svg";
import slash from "../images/inputs/ActionSlash.svg";

export const ActionInput = ({ input }) => {
  let inputImg;
  if (input === "p") inputImg = punch;
  if (input === "k") inputImg = kick;
  if (input === "h") inputImg = heavySlash;
  if (input === "s") inputImg = slash;
  if (input === "d") inputImg = dust;
  if (input === "rc") inputImg = romanCancel;
  if (input === "frc") inputImg = forceRomanCancel;

  return (
    <div className="motion-input-container">
      <img src={inputImg} alt={`${input} Input`} />
    </div>
  );
};
