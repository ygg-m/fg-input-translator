const wrapMechs = [
  {
    name: "Complex Mechanics",
    input: [],
    type: "",
    regex: /(?!)/g,
    description: "",
    img: "",
  },
  {
    name: "Comment",
    input: ["``X``"],
    type: "mech-complex",
    regex: /``(.*?)``/g,
    description:
      "Personalized Comment, used to add unique stuff to your notations without inputs getting in the way.",
    img: "",
  },
  {
    name: "Hold",
    input: ["[X]"],
    type: "mech-complex",
    regex: /\[(.)\]/g,
    description: "Hold input.",
    img: "",
  },
  {
    name: "Release",
    input: ["]X["],
    type: "mech-complex",
    regex: /\](.)\[/g,
    description: "Release input.",
    img: "",
  },
  {
    name: "Repeat",
    input: ["[move]xN", "{sequence}xN"],
    type: "mech-complex",
    regex: /\[(?!.*\[)([^\]]+)\]x(\d{1})/g,
    description: "Repeat move or sequence N amount of times.",
    img: "",
  },
  {
    name: "Repeat",
    input: ["[move]xN", "{sequence}xN"],
    type: "mech-complex",
    regex: /\{(?!.*\{)([^\}]+)\}x(\d{1})/g,
    description: "Repeat move or sequence N amount of times.",
    img: "",
  },
  {
    name: "Wolf Form",
    input: ["w[move]", "w[sequence]"],
    type: "mech-complex",
    regex: /w\[(?!.*\[)([^\]]+)\]/g,
    description:
      "Valkenhayn (Blazblue) transforms into a wolf by pressing the D button. In wolf form, Valkenhayn gains a completely new moveset and movement properties and is generally a smaller target. This notations means the sequence must be made in Wolf Form.",
    img: "",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Valkenhayn_R._Hellsing#:~:text=Drive%3A%20Werewolf,a%20crouching%20hit.",
    moreName: "Dustloop",
  },
  {
    name: "Human Form",
    input: ["h[move]", "h[sequence]"],
    type: "mech-complex",
    regex: /w\[(?!.*\[)([^\]]+)\]/g,
    description:
      "Valkenhayn (Blazblue) transforms into a wolf by pressing the D button. This notation means the sequence must be made in Human Form.",
    img: "",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Valkenhayn_R._Hellsing#:~:text=Drive%3A%20Werewolf,a%20crouching%20hit.",
    moreName: "Dustloop",
  },
  {
    name: "Float",
    input: ["fl.{move}", "fl.{sequence}"],
    type: "mech-complex",
    regex: /fl\.\{(?!.*\{})([^\}]+)\}/g,
    description:
      "Sequence is done during float. For characters like Izanami from Blazblue who instead of a double jump, can float by pressing jump while in the air.",
    img: "",
  },
  {
    name: "",
    input: ["[move]", "[sequence]"],
    type: "combo",
    regex: /\[(.*?)\](?!x\d)/g,
    description:
      "Group of inputs. Usually people use this to make a 'or' statement, where you can you one combo or another and still achieve the same ending.",
    img: "",
  },
  {
    name: "Whiffed Move",
    input: ["(move)w"],
    type: "mech-complex",
    regex: /\((?!\d{1}\))(.*?)\)w/g,
    description: "Whiff (not hit) the move.",
    img: "",
  },
  {
    name: "Optional",
    input: ["(X)", "(X > 236X)"],
    type: "mech-complex",
    regex: /(?<=[ >→~,])\((?!\d{1}\))(.*?)\)/g,
    description: "Move or sequence is optional.",
    img: "",
  },
  {
    name: "During Last Move",
    input: ["move(move)"],
    type: "mech-complex",
    regex: /\((?!\d{1}\))(.*?)\)/g,
    description:
      "Move is done during another move. This is different from '(move) = Move is optional' as there is no space in between and no > or , notation before the parenthesis.",
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
    name: "Regular Eddie",
    input: ["-X-"],
    type: "mech-complex",
    regex: /-(.)-/g,
    description:
      "Release button with regular shadow (236P/K/S/H). This notation is only for Eddie from Guilty Gear.",
    img: "",
    moreLink: "https://www.dustloop.com/w/GGACR/Eddie/Combos#Eddie_Notation",
    moreName: "Dustloop",
  },
  {
    name: "Vice Eddie",
    input: ["#X#"],
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
