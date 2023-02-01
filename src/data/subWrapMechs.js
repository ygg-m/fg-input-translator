export const subWrapMechs = [

  {
    name: "Regular",
    input: "-X-",
    type: "mech-complex",
    regex: /-(.)-/g,
    description:
      "Release button with regular shadow (236P/K/S/H). This notation is only for Eddie from Guilty Gear.",
    img: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Eddie/Combos#Eddie_Notation",
    moreName: "Dustloop",
  },
  {
    name: "Vice",
    input: "#X#",
    type: "mech-complex",
    regex: /#(.)#/g,
    description:
      "Release button using vice shadow (214H). This notation is only for Eddie from Guilty Gear.",
    img: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Eddie/Combos#Eddie_Notation",
    moreName: "Dustloop",
  },
  {
    name: "Hold",
    input: "[X]",
    type: "mech-complex",
    regex: /\[(.)\]/g,
    description: "Hold input.",
    img: "",
  },
  {
    name: "Release",
    input: "]X[",
    type: "mech-complex",
    regex: /\](.)\[/g,
    description: "Release input.",
    img: "",
  },
];
