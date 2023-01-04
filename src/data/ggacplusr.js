// image imports
// mechs
import doubleJump from "../images/inputs/MechDoubleJump.png";
import frc from "../images/inputs/MechForceRomanCancel.png";
import iad from "../images/inputs/MechIAD.png";
import rc from "../images/inputs/MechRomanCancel.png";
import dash from "../images/inputs/Motion66.png";
// specials
import quarterCircle from "../images/inputs/Motion236.png";
import halfCircle from "../images/inputs/Motion41236.png";
import fullCircle from "../images/inputs/Motion41236987.png";
import dragonPunch from "../images/inputs/Motion623.png";
// actions
import dust from "../images/inputs/ActionDust.png";
import heavySlash from "../images/inputs/ActionHeavySlash.png";
import kick from "../images/inputs/ActionKick.png";
import punch from "../images/inputs/ActionPunch.png";
import slash from "../images/inputs/ActionSlash.png";
//moves
import neutral from "../images/inputs/Motion5.png";
import foward from "../images/inputs/Motion6.png";
// arrow links
import cancel from "../images/inputs/ArrowCancel.png";
import link from "../images/inputs/ArrowLink.png";
import next from "../images/inputs/ArrowNext.png";

const ggacplusr = [
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
    url: cancel,
  },
  {
    name: "Normal Followup",
    input: ">",
    type: "follow-up",
    regex: />/g,
    description: "Proceed from the previous move to the following move.",
    url: next,
  },
  {
    name: "Link",
    input: ",",
    type: "follow-up",
    regex: /,/g,
    description:
      "To perform a second action after the first action completely finishes its animation.",
    url: link,
  },
  // -------------------------------------------------------------------------
  // complex notations
  // -------------------------------------------------------------------------
  {
    name: "Eddie Regular Shadow Release",
    input: "-X-",
    type: "mech-complex",
    regex: /-.*?-/,
    description:
      "Release button with regular shadow (236P/K/S/H). This notation is only for Eddie from Guilty Gear.",
    url: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Eddie/Combos#Eddie_Notation",
    moreName: "Dustloop",
  },
  {
    name: "Eddie Vice Shadow Release",
    input: "#X#",
    type: "mech-complex",
    regex: /#.*?#/,
    description:
      "Release button using vice shadow (214H). This notation is only for Eddie from Guilty Gear.",
    url: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Eddie/Combos#Eddie_Notation",
    moreName: "Dustloop",
  },
  {
    name: "Repeat",
    input: "[X]xN or [X > 236X]xN",
    type: "mech-complex",
    regex: /\[(.+)\]x(\d+)/,
    description: "Repeat move or sequence N amount of times.",
    url: "",
  },
  {
    name: "Hold",
    input: "[X]",
    type: "mech-complex",
    regex: /\[(.*?)\]/,
    description: "Hold input.",
    url: "",
  },
  {
    name: "Release",
    input: "]X[",
    type: "mech-complex",
    regex: /\](.*?)\[/,
    description: "Release input.",
    url: "",
  },
  {
    name: "Single / Multiple Hits",
    input: "(N)",
    type: "mech-complex",
    regex: /\(\b\d\b\)/,
    description: "Hit a move N times or move must deal N amount of hits.",
    url: "",
  },
  {
    name: "Optional",
    input: "(X) or (X > 236X)",
    type: "mech-complex",
    regex: /\((.*?)\)/,
    description: "Move or sequence is optional.",
    url: "",
  },
  // -------------------------------------------------------------------------
  // mechs
  // -------------------------------------------------------------------------
  {
    name: "Dash",
    input: 66,
    type: "mech",
    regex: /66|\(66\)/,
    description: "",
    url: dash,
    style: ["0deg", "1"],
  },
  {
    name: "Back Dash",
    input: 44,
    type: "mech",
    regex: /44/,
    description: "",
    url: dash,
    style: ["0deg", "-1"],
  },
  {
    name: "Double Jump",
    input: ["88", "dj."],
    type: "mech",
    regex: /88|dj./,
    description: "",
    url: doubleJump,
    style: ["0deg", "1"],
    moreLink: "",
    moreName: "",
  },
  {
    name: "Throw",
    input: "throw",
    type: "mech",
    regex: /throw/,
    description: "4H or 6H within close proximity of an opponent",
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#Throws",
    moreName: "Dustloop",
  },
  {
    name: "Land",
    input: ["▷", "land"],
    type: "mech",
    regex: /▷|land/,
    description: "Player must land at that point in the sequence.",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Delay",
    input: ["dl.", "delay", "slight delay"],
    type: "mech",
    regex: /dl\.|dl|delay|slightdelay/,
    description: "Delay the following move.",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Whiff",
    input: ["whiff", "(whiff)"],
    type: "mech",
    regex: /whiff|\(whiff\)/,
    description: "Whiff (not hit) the following move.",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Jump Cancel",
    input: "jc.",
    type: "mech",
    regex: /jc\.|jc/,
    description: "Canceling a move with a jump.",
    url: "",
    moreLink: "https://glossary.infil.net/?t=Jump%20Cancel",
    moreName: "Fighting Game Glossary",
  },
  {
    name: "Close",
    input: "c.",
    type: "mech",
    regex: /c\./,
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
    url: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "High Jump / Super Jump",
    input: ["hj.", "sj."],
    type: "mech",
    regex: /hj\.|sj\./,
    description:
      "Any Downward Direction > Any Upward Direction while on the ground",
    url: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#High_Jump",
    moreName: "Dustloop",
  },
  {
    name: "Jump",
    input: "j.",
    type: "mech",
    regex: /j\./,
    description: "",
    url: "",
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
    url: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#High_Jump",
    moreName: "Dustloop",
  },
  {
    name: "Dash Cancel",
    input: "dc",
    type: "mech",
    regex: /dc/,
    description: "",
    url: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Air Dash Cancel",
    input: "adc",
    type: "mech",
    regex: /adc/,
    description: "",
    url: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Counter Hit",
    input: "ch",
    type: "mech",
    regex: /ch/,
    description: "Hitting someone while they are in the startup of an attack. ",
    url: "",
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
    url: "",
    moreLink: "https://glossary.infil.net/?t=Anti-Air",
    moreName: "Fighting Game Glossary",
  },
  {
    name: "Instant Air Dash",
    input: "iad",
    type: "mech",
    regex: /iad/,
    description: "",
    url: iad,
    moreLink: "https://www.dustloop.com/w/GGACR/Movement#Air_Movement",
    moreName: "Dustloop",
  },
  {
    name: "Jump Install",
    input: "ji",
    type: "mech",
    regex: /ji/,
    description: "",
    url: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Movement#Jump_Install",
    moreName: "Dustloop",
  },
  {
    name: "Force Roman Cancel",
    input: "frc",
    type: "mech",
    regex: /frc/,
    description: "3 Attack Buttons, Except for D, During Valid FRC Window",
    url: frc,
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#Force_Roman_Cancel",
    moreName: "Dustloop",
  },
  {
    name: "Roman Cancel",
    input: "rc",
    type: "mech",
    regex: /rc/,
    description: "3 Attack Buttons, Except for D, After an Attack Connects",
    url: rc,
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#Roman_Cancel",
    moreName: "Dustloop",
  },
  // -------------------------------------------------------------------------
  // specials
  // -------------------------------------------------------------------------
  {
    name: "Full Circle Foward",
    input: 41236987,
    type: "special",
    regex: /41236987/,
    description: "",
    url: fullCircle,
    style: ["0deg", "1"],
  },
  {
    name: "Full Circle Back",
    input: 63214789,
    type: "special",
    regex: /63214789/,
    description: "",
    url: fullCircle,
    style: ["0deg", "-1"],
  },
  {
    name: "Half Circle Foward",
    input: 41236,
    type: "special",
    regex: /41236/,
    description: "",
    url: halfCircle,
    style: ["0deg", "1"],
  },
  {
    name: "Half Circle Back",
    input: 63214,
    type: "special",
    regex: /63214/,
    description: "",
    url: halfCircle,
    style: ["0deg", "-1"],
  },
  {
    name: "Quarter Circle Foward",
    input: 236,
    type: "special",
    regex: /236/,
    description: "",
    url: quarterCircle,
    style: ["0deg", "1"],
  },
  {
    name: "Quarter Circle Back",
    input: 214,
    type: "special",
    regex: /214/,
    description: "",
    url: quarterCircle,
    style: ["0deg", "-1"],
  },
  {
    name: "Dragon Punch Foward",
    input: 623,
    type: "special",
    regex: /623/,
    description: "",
    url: dragonPunch,
    style: ["0deg", "1"],
  },
  {
    name: "Dragon Punch Back",
    input: 421,
    type: "special",
    regex: /421/,
    description: "",
    url: dragonPunch,
    style: ["0deg", "-1"],
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
    url: punch,
  },
  {
    name: "Kick",
    input: "k",
    type: "action",
    regex: /k/,
    description: "",
    url: kick,
  },
  {
    name: "Slash",
    input: "s",
    type: "action",
    regex: /s/,
    description: "",
    url: slash,
  },
  {
    name: "Heavy Slash",
    input: "h",
    type: "action",
    regex: /h/,
    description: "",
    url: heavySlash,
  },
  {
    name: "Dust",
    input: "d",
    type: "action",
    regex: /d/,
    description: "",
    url: dust,
  },

  // -------------------------------------------------------------------------
  // moves
  // -------------------------------------------------------------------------
  {
    name: "Down Back",
    input: 1,
    type: "movement",
    regex: /1/,
    description: "",
    url: foward,
    style: ["-45deg", "-1"],
  },
  {
    name: "Down",
    input: 2,
    type: "movement",
    regex: /2/,
    description: "",
    url: foward,
    style: ["90deg", "1"],
  },
  {
    name: "Down Foward",
    input: 3,
    type: "movement",
    regex: /3/,
    description: "",
    url: foward,
    style: ["45deg", "1"],
  },
  {
    name: "Back",
    input: 4,
    type: "movement",
    regex: /4/,
    description: "",
    url: foward,
    style: ["0deg", "-1"],
  },
  {
    name: "Stand",
    input: 5,
    type: "movement",
    regex: /5/,
    description: "Neutral Stance.",
    url: neutral,
    style: "",
  },
  {
    name: "Foward",
    input: 6,
    type: "movement",
    regex: /6/,
    description: "",
    url: foward,
    style: "",
  },
  {
    name: "Up Back",
    input: 7,
    type: "movement",
    regex: /7/,
    description: "",
    url: foward,
    style: ["45deg", "-1"],
  },
  {
    name: "Up",
    input: 8,
    type: "movement",
    regex: /8/,
    description: "",
    url: foward,
    style: ["-90deg", "1"],
  },
  {
    name: "Up Foward",
    input: 9,
    type: "movement",
    regex: /9/,
    description: "",
    url: foward,
    style: ["-45deg", "1"],
  },
];

export { ggacplusr };
