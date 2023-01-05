import { ReactComponent as Cancel } from "../images/inputs/ArrowCancel.svg";
import { ReactComponent as Link } from "../images/inputs/ArrowLink.svg";
import { ReactComponent as Next } from "../images/inputs/ArrowNext.svg";

export const FollowUp = ({ name }) => {
  if (!name) return;
  if (name === "Normal Followup") return <Next />;
  if (name === "Cancel") return <Cancel />;
  if (name === "Link") return <Link />;
};
