export const subWrapMechs = [
  {
    name: "Single / Multiple Hits",
    input: "(N)",
    type: "mech-complex",
    regex: /(.)\((\b\d\b)\)/g,
    description: "Hit a move N times or move must deal N amount of hits.",
    img: "",
  },
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
