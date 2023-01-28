// image imports
// mechs
import { Dash, ForceRomanCancel, IstantAirDash, RomanCancel } from "./index";
// specials
import {
  DragonPunch,
  FullCircle,
  HalfCircle,
  Pretzel,
  QuarterCircle,
} from "./index";
// actions
import { Dust, HeavySlash, Kick, Punch, Slash } from "./index";
//moves
import { Foward, Neutral } from "./index";
// arrow links
import { Cancel, Link, Next } from "./index";

const guiltyGear = [
  {
    name: "Guilty Gear",
    input: "",
    type: "",
    regex: /(?!)/,
    description: "",
    img: "",
  },
  // -------------------------------------------------------------------------
  // arrow links
  // -------------------------------------------------------------------------
  {
    name: "Cancel",
    input: ["->", "~"],
    type: "follow-up",
    regex: /->|~/g,
    description:
      "Bypass the remaining time or frames in an action by proceeding directly into another action.",
    img: <Cancel />,
  },
  {
    name: "Normal Followup",
    input: ">",
    type: "follow-up",
    regex: />/g,
    description: "Proceed from the previous move to the following move.",
    img: <Next />,
  },
  {
    name: "Link",
    input: ",",
    type: "follow-up",
    regex: /,/g,
    description:
      "To perform a second action after the first action completely finishes its animation.",
    img: <Link />,
  },
  // -------------------------------------------------------------------------
  // complex notations
  // -------------------------------------------------------------------------





  // -------------------------------------------------------------------------
  // mechs
  // -------------------------------------------------------------------------
  {
    name: "Dash",
    input: 66,
    type: "mech-icon",
    regex: /66|\(66\)|dash/,
    description: "",
    img: <Dash />,
    style: {},
  },
  {
    name: "Back Dash",
    input: 44,
    type: "mech-icon",
    regex: /44/,
    description: "",
    img: <Dash />,
    style: { transform: "scaleX(-1)" },
  },
  {
    name: "Double Jump",
    input: ["88", "dj."],
    type: "mech-icon",
    regex: /88|dj./,
    description: "",
    img: <Dash />,
    style: { transform: "rotate(-90deg)" },
    moreLink: "",
    moreName: "",
  },
  {
    name: "Throw",
    input: "throw",
    type: "mech",
    regex: /throw/,
    description: "4H or 6H within close proximity of an opponent",
    img: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#Throws",
    moreName: "Dustloop",
  },
  {
    name: "Land",
    input: ["▷", "land"],
    type: "mech",
    regex: /▷|land/,
    description: "Player must land at that point in the sequence.",
    img: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Delay",
    input: ["dl.", "delay", "slight delay"],
    type: "mech",
    regex: /dl\.|dl|delayed|delay|slightdelay/,
    description: "Delay the following move.",
    img: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Whiff",
    input: ["whiff", "(whiff)"],
    type: "mech",
    regex: /whiff|\(whiff\)/,
    description: "Whiff (not hit) the following move.",
    img: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "High Jump Cancel / Super Jump Cancel",
    input: ["hjc", "sjc"],
    type: "mech",
    regex: /hjc\.|sjc\./,
    description:
      "Any Downward Direction > Any Upward Direction while on the ground",
    img: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#High_Jump",
    moreName: "Dustloop",
  },
  {
    name: "Jump Cancel",
    input: "jc.",
    type: "mech",
    regex: /jc\.|jc/,
    description: "Canceling a move with a jump.",
    img: "",
    moreLink: "https://glossary.infil.net/?t=Jump%20Cancel",
    moreName: "Fighting Game Glossary",
  },
  {
    name: "Close",
    input: "c.",
    type: "mech",
    regex: /c\./,
    img: "",
    description: "Player must be close to the target.",
    moreLink: "https://www.dustloop.com/w/GGACR/A.B.A",
    moreName: "Dustloop",
  },
  {
    name: "Far",
    input: "f.",
    type: "mech",
    regex: /f\./,
    description: "Player must be far from the target.",
    img: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Super Jump",
    input: ["hj.", "sj."],
    type: "mech",
    regex: /hj\.|sj\.|sj/,
    description:
      "Any Downward Direction > Any Upward Direction while on the ground",
    img: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#High_Jump",
    moreName: "Dustloop",
  },
  {
    name: "Jump",
    input: "j.",
    type: "mech",
    regex: /j\.|jump/,
    description: "",
    img: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Air Dash Cancel",
    input: "adc",
    type: "mech",
    regex: /adc/,
    description: "",
    img: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Dash Cancel",
    input: "dc",
    type: "mech",
    regex: /dc/,
    description: "",
    img: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Counter Hit",
    input: "ch",
    type: "mech",
    regex: /ch/,
    description: "Hitting someone while they are in the startup of an attack. ",
    img: "",
    moreLink: "https://glossary.infil.net/?t=Counter%20Hit",
    moreName: "Fighting Game Glossary",
  },
  {
    name: "Anti Air",
    input: "aa",
    type: "mech",
    regex: /aa/,
    description:
      "Hitting someone who is jumping at you while you are on the ground.",
    img: "",
    moreLink: "https://glossary.infil.net/?t=Anti-Air",
    moreName: "Fighting Game Glossary",
  },
  {
    name: "Instant Air Dash",
    input: "iad",
    type: "mech-icon",
    regex: /iad/,
    description: "",
    img: <IstantAirDash />,
    moreLink: "https://www.dustloop.com/w/GGACR/Movement#Air_Movement",
    moreName: "Dustloop",
  },
  {
    name: "Jump Install",
    input: "ji",
    type: "mech",
    regex: /ji\.|ji/,
    description: "",
    img: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Movement#Jump_Install",
    moreName: "Dustloop",
  },
  {
    name: "Force Roman Cancel",
    input: "frc",
    type: "mech-icon",
    regex: /frc/,
    description: "3 Attack Buttons, Except for D, During Valid FRC Window",
    img: <ForceRomanCancel />,
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#Force_Roman_Cancel",
    moreName: "Dustloop",
  },
  {
    name: "Roman Cancel",
    input: "rc",
    type: "mech-icon",
    regex: /rc/,
    description: "3 Attack Buttons, Except for D, After an Attack Connects",
    img: <RomanCancel />,
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#Roman_Cancel",
    moreName: "Dustloop",
  },
  // -------------------------------------------------------------------------
  // actions
  // -------------------------------------------------------------------------
  {
    name: "Punch",
    input: "p",
    type: "action",
    regex: /p/,
    description: "",
    img: <Punch />,
  },
  {
    name: "Kick",
    input: "k",
    type: "action",
    regex: /k/,
    description: "",
    img: <Kick />,
  },
  {
    name: "Slash",
    input: "s",
    type: "action",
    regex: /s/,
    description: "",
    img: <Slash />,
  },
  {
    name: "Heavy Slash",
    input: "h",
    type: "action",
    regex: /h/,
    description: "",
    img: <HeavySlash />,
  },
  {
    name: "Dust",
    input: "d",
    type: "action",
    regex: /d/,
    description: "",
    img: <Dust />,
  },
];

export { guiltyGear };
