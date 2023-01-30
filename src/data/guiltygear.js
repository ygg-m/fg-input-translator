// image imports
// mechs
import { ForceRomanCancel, RomanCancel } from "./index";
// specials
// actions
import { Dust, HeavySlash, Kick, Punch, Slash } from "./index";
//moves
// arrow links

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
  // mechs
  // -------------------------------------------------------------------------
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
