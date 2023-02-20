import {
  DragonPunch,
  FullCircle,
  HalfCircle,
  Pretzel,
  QuarterCircle,
} from "./index";

export const specialInputs = [
  {
    name: "Special Inputs",
    input: [],
    type: "",
    regex: /(?!)/g,
    description: "",
    img: "",
  },
  {
    name: "Pretzel",
    input: [1632143],
    type: "special",
    regex: /1632143/,
    description:
      "Down-back, followed by half circle back, followed by down-forward.",
    img: <Pretzel />,
    moreLink: "https://glossary.infil.net/?t=Pretzel%20Motion",
    moreName: "Glossary",
    style: {},
  },
  {
    name: "Reverse Pretzel",
    input: [3412361],
    type: "special",
    regex: /3412361/,
    description:
      "Down-foward, followed by half circle foward, followed by down-back.",
    img: <Pretzel />,
    moreLink: "https://glossary.infil.net/?t=Pretzel%20Motion",
    moreName: "Glossary",
    style: { transform: "scaleX(-1)" },
  },
  {
    name: "360 / Full Circle Foward",
    input: [41236987, 4268],
    type: "special",
    regex: /41236987|4268/,
    description:
      "Most games have a shortcut for this input; usually a 270-degree input will do.",
    moreLink: "https://glossary.infil.net/?t=360",
    moreName: "Glossary",
    img: <FullCircle />,
    style: {},
  },
  {
    name: "Reverse 360 / Full Circle Back",
    input: [63214789, 6248],
    type: "special",
    regex: /63214789|6248/,
    description:
      "Most games have a shortcut for this input; usually a 270-degree input will do.",
    moreLink: "https://glossary.infil.net/?t=360",
    moreName: "Glossary",
    img: <FullCircle />,
    style: { transform: "scaleX(-1)" },
  },
  {
    name: "Half Circle Foward",
    input: [41236, 426, "hcf"],
    type: "special",
    regex: /41236|426|hcf/,
    description: "",
    moreLink: "https://glossary.infil.net/?t=Half%20Circle",
    moreName: "Glossary",
    img: <HalfCircle />,
    style: {},
  },
  {
    name: "Half Circle Back",
    input: [63214, 624, "hcb"],
    type: "special",
    regex: /63214|624|hcb/,
    description: "",
    img: <HalfCircle />,
    moreLink: "https://glossary.infil.net/?t=Half%20Circle",
    moreName: "Glossary",
    style: { transform: "scaleX(-1)" },
  },
  {
    name: "Quarter Circle Foward",
    input: [236, "qcf"],
    type: "special",
    regex: /236|qcf/,
    description: "",
    moreLink: "https://glossary.infil.net/?t=Quarter%20Circle",
    moreName: "Glossary",
    img: <QuarterCircle />,
    style: {},
  },
  {
    name: "Quarter Circle Back",
    input: [214, "qcb"],
    type: "special",
    regex: /214|qcb/,
    description: "",
    img: <QuarterCircle />,
    moreLink: "https://glossary.infil.net/?t=Quarter%20Circle",
    moreName: "Glossary",
    style: { transform: "scaleX(-1)" },
  },
  {
    name: "Quarter Circle Up",
    input: [698],
    type: "special",
    regex: /698/,
    description: "",
    img: <QuarterCircle />,
    moreLink: "https://glossary.infil.net/?t=Quarter%20Circle",
    moreName: "Glossary",
    style: { transform: "rotate(-90deg)" },
  },
  {
    name: "Quarter Circle Up Back",
    input: [478],
    type: "special",
    regex: /478/,
    description: "",
    img: <QuarterCircle />,
    moreLink: "https://glossary.infil.net/?t=Quarter%20Circle",
    moreName: "Glossary",
    style: { transform: "rotate(90deg) scaleX(-1)" },
  },
  {
    name: "Quarter Circle Down",
    input: [632],
    type: "special",
    regex: /632/,
    description: "",
    img: <QuarterCircle />,
    moreLink: "https://glossary.infil.net/?t=Quarter%20Circle",
    moreName: "Glossary",
    style: { transform: "rotate(-90deg) scaleX(-1)" },
  },
  {
    name: "Quarter Circle Down Back",
    input: [412],
    type: "special",
    regex: /412/,
    description: "",
    img: <QuarterCircle />,
    moreLink: "https://glossary.infil.net/?t=Quarter%20Circle",
    moreName: "Glossary",
    style: { transform: "rotate(90deg)" },
  },
  {
    name: "DP Motion / Dragon Punch",
    input: [623],
    type: "special",
    regex: /623/,
    description: "",
    moreLink: "https://glossary.infil.net/?t=DP%20Motion",
    moreName: "Glossary",
    img: <DragonPunch />,
    style: {},
  },
  {
    name: "Reverse DP Motion / Reverse Dragon Punch",
    input: [421],
    type: "special",
    regex: /421/,
    description: "",
    img: <DragonPunch />,
    moreLink: "https://glossary.infil.net/?t=DP%20Motion",
    moreName: "Glossary",
    style: { transform: "scaleX(-1)" },
  },
];
