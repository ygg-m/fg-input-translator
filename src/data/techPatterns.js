import { Dash, IstantAirDash } from "./index";
export const techPatterns = [
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
    name: "or",
    input: ["/", "or"],
    type: "mech",
    regex: /\/|or/,
    description: "Execute the left or right command.",
    img: "",
    moreLink: "",
    moreName: "",
  },
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
];
