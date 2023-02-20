// actions
import { AnyKick, AnyPunch, SNK_A, SNK_B, SNK_C, SNK_D } from "../index";

const kingOfFighters = [
  {
    name: "The King of Fighters",
    input: [],
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
    input: ["bc", "BC"],
    type: "",
    regex: /bc|BC/,
    description:
      "An install possible in many different King of Fighters titles that can lead to highly damaging combos.",
    moreLink: "https://glossary.infil.net/?t=Max%20Mode",
    moreName: "Glossary",
    img: "",
  },
  {
    name: "Guard Cancel Blowback",
    input: ["gccd", "GCCD"],
    type: "",
    regex: /gccd|GCCD/,
    description:
      "Press C + D while in blockstun. It cancels the blockstun by a blow that knocks down the opponent. The Guard Cancel CD has short frames of invincibility at startup, but has a recovery.",
    moreLink:
      "https://www.dreamcancel.com/wiki/The_King_of_Fighters_2002_UM/Defense#:~:text=Guard%20Cancel%20(GC)-,Guard%20Cancel%20CD%2C%20GCCD%20(aka%20GC%20Blowback%2C%20Guard%20Attack,startup%2C%20but%20has%20a%20recovery.",
    moreName: "Dream Cancel",
    img: "",
  },
  {
    name: "Guard Cancel Roll",
    input: ["gcab", "GCAB"],
    type: "",
    regex: /gcab|GCAB/,
    description:
      "By pressing only A + B or back + A + B back (to Guard Cancel Roll backwards), while in blockstun, it is possible to roll forward or backward. This roll is completely invincible and unthrowable, and has no frame of recovery.",
    moreLink:
      "https://www.dreamcancel.com/wiki/The_King_of_Fighters_2002_UM/Defense#:~:text=end%20of%20it.-,Guard%20Cancel%20AB%2C%20GCRoll%20(Break%20Roll/Guard%20Roll/Guard%20Cancel,while%20in%20blockstun%2C%20it%20is%20possible%20to%20roll%20forward%20or%20backward.,-This%20roll%20is",
    moreName: "Dream Cancel",
    img: "",
  },
  {
    name: "Blowback",
    input: ["cd", "CD"],
    type: "",
    regex: /cd|CD/,
    description:
      "A technique in the King of Fighters series that lets you take an action while blocking for 1 bar of super meter.",
    moreLink: "https://glossary.infil.net/?t=Guard%20Cancel",
    moreName: "Glossary",
    img: "",
  },
  {
    name: "Desperation Move",
    input: ["dm", "DM"],
    type: "",
    regex: /dm|DM/,
    description:
      "What most King of Fighters games call their supers. It costs 1 super meter level to use it.",
    moreLink: "https://glossary.infil.net/?t=Desperation%20Move",
    moreName: "Glossary",
    img: "",
  },
  {
    name: "Super Desperation",
    input: ["sdm", "SDM"],
    type: "",
    regex: /sdm|SDM/,
    description:
      "A more powerful Desperation Move, wich are the supers from King of Fighters. It costs 3 super meter levels to use it.",
    moreLink: "https://glossary.infil.net/?t=Neo%20Max",
    moreName: "Glossary",
    img: "",
  },
  {
    name: "MAX2 / Clímax",
    input: ["hsdm", "clímax", "climax"],
    type: "",
    regex: /hsdm|clímax|climax/i,
    description:
      "The most powerful Desperation Move. Introduced in King of Fighters 2002. You need to be at least 30% health to cast it and it costs 3 super meter levels to use it.",
    moreLink: "https://snk.fandom.com/wiki/MAX2",
    moreName: "SNK Wiki",
    img: "",
  },
  {
    name: "Super Cancel",
    input: ["sc"],
    type: "",
    regex: /sc/i,
    description: "",
    moreLink: "",
    moreName: "",
    img: "",
  },
  {
    name: "Shatter Strike",
    input: ["ss"],
    type: "",
    regex: /ss/i,
    description:
      "When used on opponents, it will cause to crumple. When used on aerial opponents, they will be sent to the back wall, and will cause a wall bounce. Regardless of how it lands, it can lead to additional follow-ups or combos if successful.",
    moreLink: "https://snk.fandom.com/wiki/Shatter_Strike",
    moreName: "SNK Wiki",
    img: "",
  },

  {
    name: "Roll",
    input: ["ab", "AB"],
    type: "",
    regex: /ab|AB/,
    description:
      "4AB or 6AB. Pressing AB in neutral defaults to a forward roll.",
    moreLink: "",
    moreName: "",
    img: "",
  },
  {
    name: "Free Cancellable In...",
    input: ["fci"],
    type: "",
    regex: /fci|FCI/,
    description: "",
    moreLink: "",
    moreName: "",
    img: "",
  },
  {
    name: "Free Cancellable Out of...",
    input: ["fco"],
    type: "",
    regex: /fco|FCO/,
    description: "",
    moreLink: "",
    moreName: "",
    img: "",
  },
  {
    name: "On the Ground",
    input: ["otg"],
    type: "",
    regex: /otg/i,
    description: "A move that may hit a knocked down opponent.",
    moreLink: "",
    moreName: "",
    img: "",
  },
  {
    name: "Hiper Hop",
    input: ["hh"],
    type: "",
    regex: /hh\./i,
    description: "bb",
    img: "",
  },
  {
    name: "Hop",
    input: ["h"],
    type: "",
    regex: /h\./i,
    description: "aa",
    img: "",
  },

  // -------------------------------------------------------------------------
  // actions
  // -------------------------------------------------------------------------
  {
    name: "Light Punch",
    input: ["A"],
    type: "action",
    regex: /A/,
    description: "",
    img: <SNK_A />,
  },
  {
    name: "Light Kick",
    input: ["B"],
    type: "action",
    regex: /B/,
    description: "",
    img: <SNK_B />,
  },
  {
    name: "Heavy Punch",
    input: ["C"],
    type: "action",
    regex: /C/,
    description: "",
    img: <SNK_C />,
  },
  {
    name: "Heavy Kick",
    input: ["D"],
    type: "action",
    regex: /D/,
    description: "",
    img: <SNK_D />,
  },
  {
    name: "Any Kick",
    input: ["K"],
    type: "action",
    regex: /K/,
    description: "",
    img: <AnyKick />,
  },
  {
    name: "Any Punch",
    input: ["P"],
    type: "action",
    regex: /P/,
    description: "",
    img: <AnyPunch />,
  },
];

export { kingOfFighters };
