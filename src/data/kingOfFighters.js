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
    name: "Max Mode",
    input: "bc",
    type: "",
    regex: /bc/,
    description:
      "An install possible in many different King of Fighters titles that can lead to highly damaging combos.",
    moreLink: "https://glossary.infil.net/?t=Max%20Mode",
    moreName: "Glossary",
    img: "",
  },
  {
    name: "Desperation Move",
    input: "dm",
    type: "",
    regex: /dm/,
    description:
      "What most King of Fighters games call their supers. It costs 1 super meter level to use it.",
    moreLink: "https://glossary.infil.net/?t=Desperation%20Move",
    moreName: "Glossary",
    img: "",
  },
  {
    name: "Super Desperation Move / Neo Max Super Special Move",
    input: "sdm",
    type: "",
    regex: /sdm/,
    description:
      "A more powerful Desperation Move, wich are the supers from King of Fighters. It costs 3 super meter levels to use it.",
    moreLink: "https://glossary.infil.net/?t=Neo%20Max",
    moreName: "Glossary",
    img: "",
  },
  {
    name: "MAX2 / Hidden Super Desperation Move / Climax Super Special Move",
    input: "hsdm",
    type: "",
    regex: /hsdm/,
    description:
      "The most powerful Desperation Move. Introduced in King of Fighters 2002. You need to be at least 30% health to cast it and it costs 3 super meter levels to use it.",
    moreLink: "https://snk.fandom.com/wiki/MAX2",
    moreName: "SNK Wiki",
    img: "",
  },
  {
    name: "Super Cancel",
    input: "sc",
    type: "",
    regex: /sc/,
    description: "",
    moreLink: "",
    moreName: "",
    img: "",
  },
  {
    name: "Roll",
    input: "ab",
    type: "",
    regex: /ab/,
    description:
      "4AB or 6AB. Pressing AB in neutral defaults to a forward roll.",
    moreLink: "",
    moreName: "",
    img: "",
  },
  {
    name: "Free Cancellable In...",
    input: "fci",
    type: "",
    regex: /fci/,
    description: "",
    moreLink: "",
    moreName: "",
    img: "",
  },
  {
    name: "Free Cancellable Out of...",
    input: "fco",
    type: "",
    regex: /fco/,
    description: "",
    moreLink: "",
    moreName: "",
    img: "",
  },
  {
    name: "On the Ground",
    input: "otg",
    type: "",
    regex: /otg/,
    description: "A move that may hit a knocked down opponent.",
    moreLink: "",
    moreName: "",
    img: "",
  },
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
