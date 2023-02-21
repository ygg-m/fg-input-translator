// actions
import { PersonaA, PersonaB, PersonaC, PersonaD } from "../index";

const persona = [
  {
    name: "Persona",
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
    name: "Fatal Counter",
    input: ["FC"],
    type: "",
    regex: /FC/i,
    description:
      "Some attacks will cause the Fatal Counter property. The words 'FATAL COUNTER' will appear on the side of the screen and the announcer will say 'FATAL!'' when a Fatal Counter happens.",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Attack_Attributes#:~:text=Some%20attacks%20will%20cause%20the%20Fatal%20Counter%20property.%20The%20words%20%22FATAL%20COUNTER%22%20will%20appear%20on%20the%20side%20of%20the%20screen%20and%20the%20announcer%20will%20say%20%22FATAL!%22%20when%20a%20Fatal%20Counter%20happens.",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Throw",
    input: ["CD"],
    type: "",
    regex: /CD/i,
    description:
      "Short range attack that can not be blocked. Players can escape a throw by inputting a throw right after they are thrown.",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Controls#:~:text=Short%20range%20attack,done%20while%20airborne!",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Sweep",
    input: ["2AB", "Sweep"],
    type: "",
    regex: /2AB|sweep/i,
    description: "Crouching attack that knocks down the opponent.",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Controls#:~:text=Crouching%20attack%20that%20knocks%20down%20the%20opponent.",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "All out Attack",
    input: ["AB"],
    type: "",
    regex: /AB|AoA/i,
    description:
      "Attack that must be blocked high and automatically guards against most attacks.",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Controls#:~:text=All%2DOut%20Attack,Throws%20and%20Supers",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "One More Cancel",
    input: ["ABC", "OMC"],
    type: "",
    regex: /ABC|OMC/i,
    description:
      "Cancel almost any attack into neutral state for 50SP. Staple tool used in combos, pressure resets, and making unsafe attacks safe.",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Controls#:~:text=One%20More%20Cancel,unsafe%20attacks%20safe.",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Burst / Shadow Frenzy",
    input: ["ACD", "Burst"],
    type: "",
    regex: /ACD|Burst/i,
    description:
      "Normal Characters: Very strong tool that costs the entire Burst Gauge. Shadow Characters: Costs 100SP and lets characters freely cancel most attacks into each other as well as have infinite SP for a litmited time.",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Controls#:~:text=Very%20strong%20tool%20that%20costs%20the%20entire%20Burst%20Gauge.%20Bursts%20do%20different%20things%20depending%20on%20the%20context%20and%20are%20distinguished%20by%20different%20colors.",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "MAX Burst (Gold)",
    input: ["GBurst"],
    type: "",
    regex: /GBurst/i,
    description:
      "Bursting while at neutral will give the player max SP and refill their Persona Cards on hit.",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Controls#:~:text=MAX%20Burst%20(gold,Cards%20on%20hit",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Defensive Burst (Blue)",
    input: ["BBurst"],
    type: "",
    regex: /BBurst/i,
    description:
      "Bursting while blocking or getting hit will blow the opponent away, ending their offensive pressure and gives players a chance to come back!",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Controls#:~:text=Bursting%20while%20blocking%20or%20getting%20hit%20will%20blow%20the%20opponent%20away%2C%20ending%20their%20offensive%20pressure%20and%20gives%20players%20a%20chance%20to%20come%20back!",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "One More Burst (Red)",
    input: ["BBurst"],
    type: "",
    regex: /BBurst/i,
    description:
      "Bursting while attacking will cancel the attack and blow the opponent high into the air, allowing players to extend their combos.",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Controls#:~:text=Bursting%20while%20attacking%20will%20cancel%20the%20attack%20and%20blow%20the%20opponent%20high%20into%20the%20air%2C%20allowing%20players%20to%20extend%20their%20combos.",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Furious Action",
    input: ["BD"],
    type: "",
    regex: /BD/i,
    description:
      "Attack that is fully invincible and is used to stop an overly offensive opponent.",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Controls#:~:text=Attack%20that%20is,dodge%20%2B%20counter%20attack.",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Evasive Action",
    input: ["2AC"],
    type: "",
    regex: /2AC/i,
    description: "Short hop that has a few interesting properties.",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Controls#:~:text=Short%20hop%20that,Victory%20Cry%20combos",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Evasive Action",
    input: ["AC"],
    type: "",
    regex: /AC/i,
    description:
      "Dodge move that can avoid most attacks, as well as move through the opponent.",
    moreLink:
      "https://www.dustloop.com/w/P4AU/Controls#:~:text=Dodge%20move%20that,available%20when%20paralyzed!",
    moreName: "Dustloop",
    img: "",
  },
  // -------------------------------------------------------------------------
  // actions
  // -------------------------------------------------------------------------
  {
    name: "A",
    input: ["A"],
    type: "action",
    regex: /A/,
    description: "",
    img: <PersonaA />,
  },
  {
    name: "B",
    input: ["B"],
    type: "action",
    regex: /B/,
    description: "",
    img: <PersonaB />,
  },
  {
    name: "C",
    input: ["C"],
    type: "action",
    regex: /C/,
    description: "",
    img: <PersonaC />,
  },
  {
    name: "D",
    input: ["D"],
    type: "action",
    regex: /D/,
    description: "",
    img: <PersonaD />,
  },
];

export { persona };
