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
    regex: /mp|MP/,
    description: "",
    img: <MediumPunch />,
  },
  {
    name: "Heavy Punch",
    input: ["hp"],
    type: "action",
    regex: /hp|HP/,
    description: "",
    img: <HeavyPunch />,
  },
  {
    name: "Any Punch",
    input: ["p"],
    type: "action",
    regex: /p|P/,
    description: "",
    img: <AnyPunch />,
  },
  {
    name: "Light Kick",
    input: ["lk"],
    type: "action",
    regex: /lk|LK/,
    description: "",
    img: <LightKick />,
  },
  {
    name: "Medium Kick",
    input: ["mk"],
    type: "action",
    regex: /mk|MK/,
    description: "",
    img: <MediumKick />,
  },
  {
    name: "Heavy Kick",
    input: ["hk"],
    type: "action",
    regex: /hk|HK/,
    description: "",
    img: <HeavyKick />,
  },
  {
    name: "Any Kick",
    input: ["k"],
    type: "action",
    regex: /k|K/,
    description: "",
    img: <AnyKick />,
  },
];

export { streetFighter };
