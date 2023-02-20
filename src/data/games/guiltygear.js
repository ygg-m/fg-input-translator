// image imports
// mechs
import { ForceRomanCancel, RomanCancel } from "../index";
// specials
// actions
import { Dust, HeavySlash, Kick, Punch, Slash } from "../index";
//moves
// arrow links

const guiltyGear = [
  {
    name: "Guilty Gear",
    input: [],
    type: "",
    regex: /(?!)/,
    description: "",
    img: "",
  },

  // -------------------------------------------------------------------------
  // character specific
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // Anji Mito
  // -------------------------------------------------------------------------
  // {
  //   name: "3S Cancel",
  //   input: ["3sc"],
  //   type: "mech",
  //   regex: /3sc/,
  //   character: "Anji Mito",
  //   description:
  //     "Anji's 3S normal has a special property where at frames 8-10, during the attack's start-up, it can be cancelled into 5S and 5H.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji_Mito/Combos#3S_Cancels",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "Shitsu",
  //   input: ["shitsu"],
  //   type: "mech",
  //   regex: /shitsu/,
  //   character: "Anji Mito",
  //   description:
  //     "236P. A slow moving projectile that serves as one of Anji's most important specials.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji#Shitsu",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "Butterfly",
  //   input: ["butterfly"],
  //   type: "mech",
  //   regex: /butterfly/,
  //   character: "Anji Mito",
  //   description: "First part of Shitsu.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji#Shitsu",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "Hawk",
  //   input: ["hawk"],
  //   type: "mech",
  //   regex: /hawk/,
  //   character: "Anji Mito",
  //   description: "Second part of Shitsu.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji#Shitsu",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "S Fuujin",
  //   input: ["s fuujin"],
  //   type: "mech",
  //   regex: /sfuujin/,
  //   character: "Anji Mito",
  //   description:
  //     "236S. Fuujin is arguably Anji's most important tool, and alongside his autoguards, what really defines his kit.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji#Fuujin",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "H Fuujin",
  //   input: ["h fuujin"],
  //   type: "mech",
  //   regex: /hfuujin/,
  //   character: "Anji Mito",
  //   description:
  //     "236H. Fuujin is arguably Anji's most important tool, and alongside his autoguards, what really defines his kit.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji#Fuujin",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "Issokutobi",
  //   input: ["k hop"],
  //   type: "mech",
  //   regex: /khop/,
  //   character: "Anji Mito",
  //   description:
  //     "236S or 236H -> K. The throw/anti-low option out of Fuujin. Anji leaps a great distance forwards before landing in neutral.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji_Mito#Issokutobi",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "Issokutobi",
  //   input: ["k hop"],
  //   type: "mech",
  //   regex: /khop/,
  //   character: "Anji Mito",
  //   description:
  //     "236S or 236H -> S. The throw/anti-low option out of Fuujin. Anji leaps a great distance forwards before landing in neutral.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji_Mito#Issokutobi",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "FB Rin",
  //   input: ["fb rin"],
  //   type: "mech",
  //   regex: /fbrin/,
  //   character: "Anji Mito",
  //   description:
  //     "236S or 236H -> D. Anji's main use of meter. An important piece of combo filler as it ground bounces, and leads into H Fuujin for further followups.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji_Mito#FB_Rin",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "H Rin",
  //   input: ["h rin"],
  //   type: "mech",
  //   regex: /hrin/,
  //   character: "Anji Mito",
  //   description:
  //     "236S or 236H -> H. The overhead/autoguard/knockdown option out of Fuujin, notable for being a level six attack on block.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji#Rin",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "Kou",
  //   input: ["kou"],
  //   type: "mech",
  //   regex: /kou/,
  //   character: "Anji Mito",
  //   description:
  //     "P during Autoguard. A rising autoguard followup that leads to a knockdown on full connect. Kou is lightning fast, at only four frames, meaning in certain situations it can be truly inescapable.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji_Mito#Kou",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "Sou",
  //   input: ["sou"],
  //   type: "mech",
  //   regex: /sou/,
  //   character: "Anji Mito",
  //   description:
  //     "K during Autoguard. A horizontally advancing autoguard followup, made up of three low-level attacks followed by a single high level hit.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji_Mito#Sou",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "FB On",
  //   input: ["623D"],
  //   type: "mech",
  //   regex: /fbon/,
  //   character: "Anji Mito",
  //   description:
  //     "623D. Like normal On, but with much slower startup and much higher vertical reach.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji_Mito#FB_On",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "On",
  //   input: ["on"],
  //   type: "mech",
  //   regex: /on/,
  //   character: "Anji Mito",
  //   description:
  //     "623H. A rising autoguard followup that leads to a knockdown on full connect.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji_Mito#On",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "P Kai",
  //   input: ["p kai"],
  //   type: "mech",
  //   regex: /pkai/,
  //   character: "Anji Mito",
  //   description:
  //     "214P. Kai represents a pair of advancing jumps, both of which hit overhead and can cross up opponents.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji_Mito#Kai",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "K Kai",
  //   input: ["k kai"],
  //   type: "mech",
  //   regex: /kkai/,
  //   character: "Anji Mito",
  //   description:
  //     "214K. Kai represents a pair of advancing jumps, both of which hit overhead and can cross up opponents.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji_Mito#Kai",
  //   moreName: "Dustloop",
  // },
  // {
  //   name: "Shin: Nishiki",
  //   input: ["orb"],
  //   type: "mech",
  //   regex: /orb/,
  //   character: "Anji Mito",
  //   description: "j.214P. A common air combo ender.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/Anji_Mito#Shin:_Nishiki",
  //   moreName: "Dustloop",
  // },

  // // -------------------------------------------------------------------------
  // // A.B.A.
  // // -------------------------------------------------------------------------
  // {
  //   name: "Bonding",
  //   input: ["63214H"],
  //   type: "character move",
  //   regex: /keygrab|bonding/,
  //   character: "A.B.A.",
  //   description:
  //     "Often called 'Keygrab'. It's a grab that make A.B.A. enter or leave Goku Moroha Mode.",
  //   img: "",
  //   moreLink: "https://www.dustloop.com/w/GGACR/A.B.A#Bonding",
  //   moreName: "Dustloop",
  // },
  // -------------------------------------------------------------------------
  // mechs
  // -------------------------------------------------------------------------
  {
    name: "Jump Install",
    input: ["ji"],
    type: "mech",
    regex: /ji\.|ji/i,
    description: "",
    img: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Movement#Jump_Install",
    moreName: "Dustloop",
  },
  {
    name: "Force Roman Cancel",
    input: ["frc"],
    type: "mech-icon",
    regex: /frc/i,
    description: "3 Attack Buttons, Except for D, During Valid FRC Window",
    img: <ForceRomanCancel />,
    moreLink: "https://www.dustloop.com/w/GGACR/Mechanics#Force_Roman_Cancel",
    moreName: "Dustloop",
  },
  {
    name: "Roman Cancel",
    input: ["rc"],
    type: "mech-icon",
    regex: /rc/i,
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
    input: ["P"],
    type: "action",
    regex: /P/,
    description: "",
    img: <Punch />,
  },
  {
    name: "Kick",
    input: ["K"],
    type: "action",
    regex: /K/,
    description: "",
    img: <Kick />,
  },
  {
    name: "Slash",
    input: ["S"],
    type: "action",
    regex: /S/,
    description: "",
    img: <Slash />,
  },
  {
    name: "Heavy Slash",
    input: ["H"],
    type: "action",
    regex: /H/,
    description: "",
    img: <HeavySlash />,
  },
  {
    name: "Dust",
    input: ["D"],
    type: "action",
    regex: /D/,
    description: "",
    img: <Dust />,
  },
];

export { guiltyGear };
