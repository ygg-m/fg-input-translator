const wrapMechs = [
  {
    name: "",
    input: "[X > 236X]",
    type: "mech-complex",
    regex: /\[(.*?)\]/g,
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
    name: "Repeat",
    input: ["[X]xN", "[X > 236X]xN"],
    type: "mech-complex",
    regex: /\[(?!.*\[)([^\]]+)\]x(\d{1})/g,
    description: "Repeat move or sequence N amount of times.",
    img: "",
  },
];

export { wrapMechs };
