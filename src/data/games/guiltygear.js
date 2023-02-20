// image imports
// mechs
import {
  BlueRomanCancel,
  ForceRomanCancel,
  PurpleRomanCancel,
  RomanCancel,
  YellowRomanCancel,
} from "../index";
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
    name: "Red Roman Cancel",
    input: ["rrc"],
    type: "mech-icon",
    regex: /rrc/i,
    description:
      "3 Attack Buttons, Except for D, while the opponent is in hitstun or blockstun.",
    img: <RomanCancel />,
    moreLink:
      "https://www.dustloop.com/w/GGXRD-R2/Controls#:~:text=Red%20when%20Roman%20Canceling%20while%20the%20opponent%20is%20in%20hitstun%20or%20blockstun.%20Costs%2050%25%20Tension..",
    moreName: "Dustloop",
  },
  {
    name: "Yellow Roman Cancel",
    input: ["yrc"],
    type: "mech-icon",
    regex: /yrc/i,
    description:
      "3 Attack Buttons, Except for D, while the opponent is in neither hitstun nor blockstun. Occurs during start-up and early active frames.",
    img: <YellowRomanCancel />,
    moreLink:
      "https://www.dustloop.com/w/GGXRD-R2/Controls#:~:text=Yellow%20when%20Roman%20Canceling%20while%20the%20opponent%20is%20in%20neither%20hitstun%20nor%20blockstun.%20Occurs%20during%20start%2Dup%20and%20early%20active%20frames.%20Can%20also%20be%20performed%20in%20neutral%20or%20during%20movement%20options.%20Costs%2025%25%20Tension.",
    moreName: "Dustloop",
  },
  {
    name: "Purple Roman Cancel",
    input: ["prc"],
    type: "mech-icon",
    regex: /prc/i,
    description:
      "3 Attack Buttons, while the opponent is in neither hitstun nor blockstun. Occurs during late active and recovery frames.",
    img: <PurpleRomanCancel />,
    moreLink:
      "https://www.dustloop.com/w/GGXRD-R2/Controls#:~:text=Purple%20when%20Roman%20Canceling%20while%20the%20opponent%20is%20in%20neither%20hitstun%20nor%20blockstun.%20Occurs%20during%20late%20active%20and%20recovery%20frames.%20Costs%2050%25%20Tension.%0A(Some%20actions%2C%20such%20as%20specials%20with%20full%20invincibility%20on%20start%2Dup%20cannot%20be%20Yellow%20or%20Purple%20Roman%20Canceled.)",
    moreName: "Dustloop",
  },
  {
    name: "Blue Roman Cancel",
    input: ["brc"],
    type: "mech-icon",
    regex: /brc/i,
    description:
      "3 Attack Buttons, Except for D, during neutral or basic movement.",
    img: <BlueRomanCancel />,
    moreLink:
      "https://www.dustloop.com/w/GGST/Controls#:~:text=Blue%20during%20neutral%20or%20basic%20movement.%20Has%20the%20longest%20slowdown%20period%2C%20allowing%20you%20to%20respond%20to%20neutral%20situations%20or%20enable%20links%20not%20normally%20possible.%20Slowdown%20caused%20by%20the%20shockwave%20still%20continues%20even%20if%20the%20opponent%20gets%20hit.",
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
