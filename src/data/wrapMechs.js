import { Repeat } from "../components/Repeat";

const wrapMechs = [
  // -------------------------------------------------------------------------
  // complex notations
  // -------------------------------------------------------------------------
  {
    name: "Repeat",
    input: "[X]xN or [X > 236X]xN",
    type: "mech-complex",
    regex: /\[(?!.*\[)([^\]]+)\]x(\d+)/g,
    description: "Repeat move or sequence N amount of times.",
    img: "",
    component: Repeat,
  },
  {
    name: "Single / Multiple Hits",
    input: "(N)",
    type: "mech-complex",
    regex: /\((\b\d\b)\)/g,
    description: "Hit a move N times or move must deal N amount of hits.",
    img: "",
    component: Repeat,
  },
  {
    name: "Optional",
    input: "(X) or (X > 236X)",
    type: "mech-complex",
    regex: /\((?![\d\(\)])(.*)(?<![\d\(\)])\)/g,
    description: "Move or sequence is optional.",
    img: "",
    component: Repeat,
  },
  {
    name: "Eddie Regular Shadow Release",
    input: "-X-",
    type: "mech-complex",
    regex: /-.-/g,
    description:
      "Release button with regular shadow (236P/K/S/H). This notation is only for Eddie from Guilty Gear.",
    img: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Eddie/Combos#Eddie_Notation",
    moreName: "Dustloop",
    component: Repeat,
  },
  {
    name: "Eddie Vice Shadow Release",
    input: "#X#",
    type: "mech-complex",
    regex: /#.#/g,
    description:
      "Release button using vice shadow (214H). This notation is only for Eddie from Guilty Gear.",
    img: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Eddie/Combos#Eddie_Notation",
    moreName: "Dustloop",
    component: Repeat,
  },
  {
    name: "Hold",
    input: "[X]",
    type: "mech-complex",
    regex: /\[.\]/g,
    description: "Hold input.",
    img: "",
    component: Repeat,
  },
  {
    name: "Release",
    input: "]X[",
    type: "mech-complex",
    regex: /\].\[/g,
    description: "Release input.",
    img: "",
    component: Repeat,
  },
];

export { wrapMechs };
