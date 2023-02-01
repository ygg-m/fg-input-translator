// image imports
// mechs
import { Dash, ForceRomanCancel, IstantAirDash, RomanCancel } from "./index";
// specials
import { DragonPunch, FullCircle, HalfCircle, QuarterCircle } from "./index";
// actions
import { AnyKick, AnyPunch, SNK_A, SNK_B, SNK_C, SNK_D } from "./index";
//moves
import { Foward, Neutral } from "./index";
// arrow links
import { Cancel, Link, Next } from "./index";

const kingOfFighters = [
  {
    name: "The King of Fighters",
    input: "",
    type: "",
    regex: /(?!)/,
    description: "",
    img: "",
  },

  // -------------------------------------------------------------------------
  // mechanics
  // -------------------------------------------------------------------------
  {
    name: "Hop",
    input: "h",
    type: "",
    regex: /h./,
    description: "",
    img: "",
  },
  {
    name: "Hiper Hop",
    input: "hh",
    type: "",
    regex: /h/,
    description: "",
    img: "",
  },

  // -------------------------------------------------------------------------
  // actions
  // -------------------------------------------------------------------------
  {
    name: "Light Punch",
    input: "a",
    type: "action",
    regex: /a/,
    description: "",
    img: <SNK_A />,
  },
  {
    name: "Light Kick",
    input: "b",
    type: "action",
    regex: /b/,
    description: "",
    img: <SNK_B />,
  },
  {
    name: "Heavy Punch",
    input: "c",
    type: "action",
    regex: /c/,
    description: "",
    img: <SNK_C />,
  },
  {
    name: "Heavy Kick",
    input: "d",
    type: "action",
    regex: /d/,
    description: "",
    img: <SNK_D />,
  },
  {
    name: "Any Kick",
    input: "k",
    type: "action",
    regex: /k/,
    description: "",
    img: <AnyKick />,
  },
  {
    name: "Any Punch",
    input: "p",
    type: "action",
    regex: /p/,
    description: "",
    img: <AnyPunch />,
  },
];

export { kingOfFighters };
