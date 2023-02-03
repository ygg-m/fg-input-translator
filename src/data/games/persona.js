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
  // actions
  // -------------------------------------------------------------------------
  {
    name: "A",
    input: ["a"],
    type: "action",
    regex: /a/,
    description: "",
    img: <PersonaA />,
  },
  {
    name: "B",
    input: ["b"],
    type: "action",
    regex: /b/,
    description: "",
    img: <PersonaB />,
  },
  {
    name: "C",
    input: ["c"],
    type: "action",
    regex: /c/,
    description: "",
    img: <PersonaC />,
  },
  {
    name: "D",
    input: ["d"],
    type: "action",
    regex: /d/,
    description: "",
    img: <PersonaD />,
  },
];

export { persona };
