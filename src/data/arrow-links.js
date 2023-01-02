import cancel from "../images/inputs/ArrowCancel.png";
import link from "../images/inputs/ArrowLink.png";
import next from "../images/inputs/ArrowNext.png";

const arrowLinks = [
  {
    name: "Cancel",
    input: ["->", "~"],
    regex: /(->|~)/,
    description:
      "Bypass the remaining time or frames in an action by proceeding directly into another action.",
    url: cancel,
  },
  {
    name: "Normal Followup",
    input: ">",
    regex: />/,
    description: "Proceed from the previous move to the following move.",
    url: next,
  },
  {
    name: "Link",
    input: ",",
    regex: /,/,
    description:
      "To perform a second action after the first action completely finishes its animation.",
    url: link,
  },
];

export { arrowLinks };
