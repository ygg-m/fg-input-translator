import quarterCircle from "../images/inputs/Motion236.png";
import halfCircle from "../images/inputs/Motion41236.png";
import fullCircle from "../images/inputs/Motion41236987.png";
import dragonPunch from "../images/inputs/Motion623.png";

const specialMoveInputs = [
  {
    name: "Full Circle Foward",
    input: 41236987,
    regex: /41236987/,
    description: "",
    url: fullCircle,
    style: ["0deg", "1"],
  },
  {
    name: "Full Circle Back",
    input: 63214789,
    regex: /63214789/,
    description: "",
    url: fullCircle,
    style: ["0deg", "-1"],
  },
  {
    name: "Half Circle Foward",
    input: 41236,
    regex: /41236/,
    description: "",
    url: halfCircle,
    style: ["0deg", "1"],
  },
  {
    name: "Half Circle Back",
    input: 63214,
    regex: /63214/,
    description: "",
    url: halfCircle,
    style: ["0deg", "-1"],
  },
  {
    name: "Quarter Circle Foward",
    input: 236,
    regex: /236/,
    description: "",
    url: quarterCircle,
    style: ["0deg", "1"],
  },
  {
    name: "Quarter Circle Back",
    input: 214,
    regex: /214/,
    description: "",
    url: quarterCircle,
    style: ["0deg", "-1"],
  },
  {
    name: "Dragon Punch Foward",
    input: 623,
    regex: /623/,
    description: "",
    url: dragonPunch,
    style: ["0deg", "1"],
  },
  {
    name: "Dragon Punch Back",
    input: 421,
    regex: /421/,
    description: "",
    url: dragonPunch,
    style: ["0deg", "-1"],
  },
];

export { specialMoveInputs };
