// actions
import { PersonaA, PersonaB, PersonaC, PersonaD } from "../index";

const persona = [
  {
    name: "Persona",
    input: "",
    type: "",
    regex: /(?!)/,
    description: "",
    img: "",
  },
  // -------------------------------------------------------------------------
  // actions
  // -------------------------------------------------------------------------
  {
    name: "Light Punch",
    input: "A",
    type: "action",
    regex: /A/,
    description: "",
    img: <PersonaA />,
  },
  {
    name: "Light Kick",
    input: "b",
    type: "action",
    regex: /b/,
    description: "",
    img: <PersonaB />,
  },
  {
    name: "Heavy Punch",
    input: "c",
    type: "action",
    regex: /c/,
    description: "",
    img: <PersonaC />,
  },
  {
    name: "Heavy Kick",
    input: "d",
    type: "action",
    regex: /d/,
    description: "",
    img: <PersonaD />,
  },
];

export { persona };
