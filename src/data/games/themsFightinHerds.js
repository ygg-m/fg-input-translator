// image imports
import {TFH_A, TFH_B, TFH_C, TFH_D, TFH_ActionAny, TFH_ActionAnyTwo} from "../index"

const themsFightinHerds = [
  {
    name: "Them's Fightin' Herds",
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
    name: "Light Attack",
    input: ["a"],
    type: "action",
    regex: /a/,
    description: "",
    img: <TFH_A />,
  },
  {
    name: "Medium Attack",
    input: ["b"],
    type: "action",
    regex: /b/,
    description: "",
    img: <TFH_B />,
  },
  {
    name: "Heavy Attack",
    input: ["c"],
    type: "action",
    regex: /c/,
    description: "",
    img: <TFH_C />,
  },
  {
    name: "Magic",
    input: ["d"],
    type: "action",
    regex: /d/,
    description: "",
    img: <TFH_D />,
  },
  {
    name: "Any Attack",
    input: ["x"],
    type: "action",
    regex: /(?<!x)x(?!x)/,
    description: "Any attack button that isn't D (magic).",
    img: <TFH_ActionAny />,
  },
  {
    name: "Any Two Attack Buttons",
    input: ["xx"],
    type: "action",
    regex: /xx/,
    description: "Any two attack buttons that aren't D (magic).",
    img: <TFH_ActionAnyTwo />,
  },
];

export { themsFightinHerds };
