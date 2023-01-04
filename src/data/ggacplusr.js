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
    regex: /->|~/g,
    description:
      "Bypass the remaining time or frames in an action by proceeding directly into another action.",
    url: cancel,
  },
  {
    name: "Normal Followup",
    input: ">",
    regex: />/g,
    description: "Proceed from the previous move to the following move.",
    url: next,
  },
  {
    name: "Link",
    input: ",",
    regex: /,/g,
    description:
      "To perform a second action after the first action completely finishes its animation.",
    url: link,
  },
  // -------------------------------------------------------------------------
  // mechs
  // -------------------------------------------------------------------------
  {
    name: "Dash",
    input: 66,
    regex: /66|\(66\)/,
    description: "",
    url: dash,
    style: ["0deg", "1"],
  },
  {
    name: "Back Dash",
    input: 44,
    regex: /44/,
    description: "",
    url: dash,
    style: ["0deg", "-1"],
  },
  {
    name: "Double Jump",
    input: ["88", "dj."],
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
    regex: /throw/,
    description: "4H or 6H within close proximity of an opponent",
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#Throws",
    moreName: "Dustloop",
  },
  {
    name: "Land",
    input: ["▷", "land"],
    regex: /▷|land/,
    description: "Player must land at that point in the sequence.",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Delay",
    input: ["dl.", "delay", "slightdelay"],
    regex: /dl\.|delay|slight delay/,
    description: "Delay the following move.",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Whiff",
    input: ["whiff", "(whiff)"],
    regex: /whiff|\(whiff\)/,
    description: "Whiff (not hit) the following move.",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Close",
    input: "c.",
    regex: /c\./,
    description: "Player must be close to the target.",
    moreLink: "https://www.dustloop.com/w/GGACR/A.B.A",
    moreName: "Dustloop",
  },
  {
    name: "Far",
    input: "f.",
    regex: /f\./,
    description: "Player must be far from the target.",
    url: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "High Jump / Super Jump",
    input: ["hj.", "sj."],
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
    regex: /j\./,
    description: "",
    url: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "High Jump Cancel / Super Jump Cancel",
    input: ["hjc", "sjc"],
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
    regex: /dc/,
    description: "",
    url: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Air Dash Cancel",
    input: "adc",
    regex: /adc/,
    description: "",
    url: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Counter Hit",
    input: "ch",
    regex: /ch/,
    description: "",
    url: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Anti Air",
    input: "aa",
    regex: /aa/,
    description: "",
    url: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Instant Air Dash",
    input: "iad",
    regex: /iad/,
    description: "",
    url: iad,
    moreLink: "",
    moreName: "",
  },
  {
    name: "Jump Install",
    input: "ji",
    regex: /ji/,
    description: "",
    url: "",
    moreLink: "",
    moreName: "",
  },
  {
    name: "Force Roman Cancel",
    input: "frc",
    regex: /frc/,
    description: "3 Attack Buttons, Except for D, During Valid FRC Window",
    url: frc,
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#Force_Roman_Cancel",
    moreName: "Dustloop",
  },
  {
    name: "Roman Cancel",
    input: "rc",
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
    regex: /41236987/,
    description: "",
    url: fullCircle,
    style: ["0deg", "1"],
  },
  {
    name: "Full Circle Back",
    input: 63214789,
    regex: /63214789/,
    description: "",
    url: fullCircle,
    style: ["0deg", "-1"],
  },
  {
    name: "Half Circle Foward",
    input: 41236,
    regex: /41236/,
    description: "",
    url: halfCircle,
    style: ["0deg", "1"],
  },
  {
    name: "Half Circle Back",
    input: 63214,
    regex: /63214/,
    description: "",
    url: halfCircle,
    style: ["0deg", "-1"],
  },
  {
    name: "Quarter Circle Foward",
    input: 236,
    regex: /236/,
    description: "",
    url: quarterCircle,
    style: ["0deg", "1"],
  },
  {
    name: "Quarter Circle Back",
    input: 214,
    regex: /214/,
    description: "",
    url: quarterCircle,
    style: ["0deg", "-1"],
  },
  {
    name: "Dragon Punch Foward",
    input: 623,
    regex: /623/,
    description: "",
    url: dragonPunch,
    style: ["0deg", "1"],
  },
  {
    name: "Dragon Punch Back",
    input: 421,
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

  // -------------------------------------------------------------------------
  // moves
  // -------------------------------------------------------------------------
  {
    name: "Down Back",
    input: 1,
    regex: /1/,
    description: "",
    url: foward,
    style: ["-45deg", "-1"],
  },
  {
    name: "Down",
    input: 2,
    regex: /2/,
    description: "",
    url: foward,
    style: ["90deg", "1"],
  },
  {
    name: "Down Foward",
    input: 3,
    regex: /3/,
    description: "",
    url: foward,
    style: ["45deg", "1"],
  },
  {
    name: "Back",
    input: 4,
    regex: /4/,
    description: "",
    url: foward,
    style: ["0deg", "-1"],
  },
  {
    name: "Stand",
    input: 5,
    regex: /5/,
    description: "Neutral Stance.",
    url: neutral,
    style: "",
  },
  {
    name: "Foward",
    input: 6,
    regex: /6/,
    description: "",
    url: foward,
    style: "",
  },
  {
    name: "Up Back",
    input: 7,
    regex: /7/,
    description: "",
    url: foward,
    style: ["45deg", "-1"],
  },
  {
    name: "Up",
    input: 8,
    regex: /8/,
    description: "",
    url: foward,
    style: ["-90deg", "1"],
  },
  {
    name: "Up Foward",
    input: 9,
    regex: /9/,
    description: "",
    url: foward,
    style: ["-45deg", "1"],
  },
];

export { ggacplusr };
