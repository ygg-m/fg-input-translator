import dust from "../images/inputs/ActionDust.png";
import heavySlash from "../images/inputs/ActionHeavySlash.png";
import kick from "../images/inputs/ActionKick.png";
import punch from "../images/inputs/ActionPunch.png";
import slash from "../images/inputs/ActionSlash.png";

const ggac_actionInputs = [
  {
    name: "Punch",
    input: "p",
    regex: /p/,
    description: "",
    url: punch,
  },
  {
    name: "Kick",
    input: "k",
    regex: /k/,
    description: "",
    url: kick,
  },
  {
    name: "Slash",
    input: "s",
    regex: /s/,
    description: "",
    url: slash,
  },
  {
    name: "Heavy Slash",
    input: "h",
    regex: /h/,
    description: "",
    url: heavySlash,
  },
  {
    name: "Dust",
    input: "d",
    regex: /d/,
    description: "",
    url: dust,
  },
];

export { ggac_actionInputs };
