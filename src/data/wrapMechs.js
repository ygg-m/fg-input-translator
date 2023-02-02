const wrapMechs = [
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
  {
    name: "Repeat",
    input: ["[X]xN", "[X > 236X]xN", "X*N", "{X}*N"],
    type: "mech-complex",
    regex:
      /\[(?!.*\[)([^\]]+)\]x(\d{1})|(\{([^\}]+)\}\*(\d{1}))|(?!})(.)\*(\d{1})/g,
    description: "Repeat move or sequence N amount of times.",
    img: "",
  },
  {
    name: "",
    input: "[X > 236X]",
    type: "combo",
    regex: /\[(.*?)\](?!x\d)/g,
    description:
      "Group of inputs. Usually people use this to make a 'or' statement, where you can you one combo or another and still achieve the same ending.",
    img: "",
  },
  {
    name: "Optional",
    input: ["(X)", "(X > 236X)"],
    type: "mech-complex",
    regex: /\((?!\d{1}\))(.*?)\)/g,
    description: "Move or sequence is optional.",
    img: "",
  },
  {
    name: "Single / Multiple Hits",
    input: ["X(N)", "236X(N)"],
    type: "mech-complex",
    regex: /(\d+.|.)\((\b\d\b)\)/g,
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
];

export { wrapMechs };
