// images
import backDash from "../images/inputs/Motion44.png";
import neutral from "../images/inputs/Motion5.svg";
import foward from "../images/inputs/Motion6.svg";
import dash from "../images/inputs/Motion66.png";

const moveInputs = [
  {
    name: "Down Back",
    input: 1,
    description: "",
    url: foward,
    style: ["-45deg", "-1"],
  },
  {
    name: "Down",
    input: 2,
    description: "",
    url: foward,
    style: ["90deg", "1"],
  },
  {
    name: "Down Foward",
    input: 3,
    description: "",
    url: foward,
    style: ["45deg", "1"],
  },
  {
    name: "Back",
    input: 4,
    description: "",
    url: foward,
    style: ["0deg", "-1"],
  },
  {
    name: "Stand",
    input: 5,
    description: "Neutral Stance.",
    url: neutral,
    style: "",
  },
  {
    name: "Foward",
    input: 6,
    description: "",
    url: foward,
    style: "",
  },
  {
    name: "Up Back",
    input: 7,
    description: "",
    url: foward,
    style: ["45deg", "-1"],
  },
  {
    name: "Up",
    input: 8,
    description: "",
    url: foward,
    style: ["-90deg", "1"],
  },
  {
    name: "Up Foward",
    input: 9,
    description: "",
    url: foward,
    style: ["-45deg", "1"],
  },
  {
    name: "Dash",
    input: 66,
    description: "",
    url: dash,
    style: ["0deg", "1"],
  },
  {
    name: "Back Dash",
    input: 44,
    description: "",
    url: backDash,
    style: ["0deg", "1"],
  },
];

export { moveInputs };
