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
    input: ["lp", "LP"],
    type: "action",
    regex: /lp|LP/,
    description: "",
    img: <LightPunch />,
  },
  {
    name: "Medium Punch",
    input: ["mp", "MP"],
    type: "action",
    regex: /mp|MP/,
    description: "",
    img: <MediumPunch />,
  },
  {
    name: "Heavy Punch",
    input: ["hp", "HP"],
    type: "action",
    regex: /hp|HP/,
    description: "",
    img: <HeavyPunch />,
  },
  {
    name: "Any Punch",
    input: ["p", "P"],
    type: "action",
    regex: /p|P/,
    description: "",
    img: <AnyPunch />,
  },
  {
    name: "Light Kick",
    input: ["lk", "LK"],
    type: "action",
    regex: /lk|LK/,
    description: "",
    img: <LightKick />,
  },
  {
    name: "Medium Kick",
    input: ["mk", "MK"],
    type: "action",
    regex: /mk|MK/,
    description: "",
    img: <MediumKick />,
  },
  {
    name: "Heavy Kick",
    input: ["hk", "HK"],
    type: "action",
    regex: /hk|HK/,
    description: "",
    img: <HeavyKick />,
  },
  {
    name: "Any Kick",
    input: ["k", "K"],
    type: "action",
    regex: /k|K/,
    description: "",
    img: <AnyKick />,
  },
];

export { streetFighter };
