const wrapMechs = [
  {
    name: "Optional",
    input: "(X) or (X > 236X)",
    type: "mech-complex",
    regex: /\((?!\d{1}\))(.*?)\)/g,
    description: "Move or sequence is optional.",
    img: "",
  },
  {
    name: "Repeat",
    input: "[X]xN or [X > 236X]xN",
    type: "mech-complex",
    regex: /\[(?!.*\[)([^\]]+)\]x(\d+)/g,
    description: "Repeat move or sequence N amount of times.",
    img: "",
  },
];

export { wrapMechs };
