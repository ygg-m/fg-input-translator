import { Cancel, Link, Next } from "./index";

const followUp = [
  {
    name: "Follow Ups",
    input: [],
    type: "",
    regex: /(?!)/g,
    description: "",
    img: "",
  },

  {
    name: "Cancel",
    input: ["->", "~", ">>"],
    type: "follow-up",
    regex: /(?<!-.)->|~|>>/g,
    description:
      "Bypass the remaining time or frames in an action by proceeding directly into another action.",
    img: <Cancel />,
  },
  {
    name: "Normal Followup",
    input: [">"],
    type: "follow-up",
    regex: />|＞/g,
    description: "Proceed from the previous move to the following move.",
    img: <Next />,
  },
  {
    name: "Link",
    input: [","],
    type: "follow-up",
    regex: /,/g,
    description:
      "To perform a second action after the first action completely finishes its animation.",
    img: <Link />,
  },
];

export { followUp };
