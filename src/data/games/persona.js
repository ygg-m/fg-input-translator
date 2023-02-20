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
