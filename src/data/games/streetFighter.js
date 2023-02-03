// image imports

// actions
import {
  AnyKick,
  AnyPunch,
  HeavyKick,
  HeavyPunch,
  LightKick,
  LightPunch,
  MediumKick,
  MediumPunch,
} from "../index";

const streetFighter = [
  {
    name: "Street Fighter",
    input: [],
    type: "",
    regex: /(?!)/,
    description: "",
    img: "",
  },
  // -------------------------------------------------------------------------
  // actions
  // -------------------------------------------------------------------------
  {
    name: "Light Punch",
    input: ["lp"],
    type: "action",
    regex: /lp/,
    description: "",
    img: <LightPunch />,
  },
  {
    name: "Medium Punch",
    input: ["mp"],
    type: "action",
    regex: /mp/,
    description: "",
    img: <MediumPunch />,
  },
  {
    name: "Heavy Punch",
    input: ["hp"],
    type: "action",
    regex: /hp/,
    description: "",
    img: <HeavyPunch />,
  },
  {
    name: "Any Punch",
    input: ["p"],
    type: "action",
    regex: /p/,
    description: "",
    img: <AnyPunch />,
  },
  {
    name: "Light Kick",
    input: ["lk"],
    type: "action",
    regex: /lk/,
    description: "",
    img: <LightKick />,
  },
  {
    name: "Medium Kick",
    input: ["mk"],
    type: "action",
    regex: /mk/,
    description: "",
    img: <MediumKick />,
  },
  {
    name: "Heavy Kick",
    input: ["hk"],
    type: "action",
    regex: /hk/,
    description: "",
    img: <HeavyKick />,
  },
  {
    name: "Any Kick",
    input: ["k"],
    type: "action",
    regex: /k/,
    description: "",
    img: <AnyKick />,
  },
];

export { streetFighter };
