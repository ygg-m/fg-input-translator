import type { TokenDefinition } from "../core/types";

// Hand-written: the legacy wrapper mechanics, expressed as group syntax.
// Not ported yet (they need context-dependent or postfix syntax): Optional,
// During Last Move, Single / Multiple Hits, Release, Regular Eddie, Vice Eddie.
export const groupDefinitions: TokenDefinition[] = [
  {
    id: "group.simultaneous",
    name: "Simultaneous",
    type: "mech-complex",
    aliases: [],
    display: { mode: "label" },
    label: "Simultaneous",
    description: "Buttons or directions pressed at the same time.",
    group: { separator: "+" },
  },
  {
    id: "group.comment",
    name: "Comment",
    type: "mech-complex",
    aliases: [],
    display: { mode: "label" },
    description:
      "Personalized comment, used to add unique text to your notations without inputs getting in the way.",
    group: { open: "``", close: "``", literal: true },
  },
  {
    id: "group.hold",
    name: "Hold",
    type: "mech-complex",
    aliases: [],
    display: { mode: "label" },
    description: "Hold the input.",
    group: { open: "[", close: "]" },
  },
  {
    id: "group.repeat-bracket",
    name: "Repeat",
    type: "mech-complex",
    aliases: [],
    display: { mode: "label" },
    label: "Repeat x{n}",
    description: "Repeat move or sequence N amount of times.",
    group: { open: "[", close: "]x", param: { name: "n", kind: "digits" } },
  },
  {
    id: "group.repeat-brace",
    name: "Repeat",
    type: "mech-complex",
    aliases: [],
    display: { mode: "label" },
    label: "Repeat x{n}",
    description: "Repeat move or sequence N amount of times.",
    group: { open: "{", close: "}x", param: { name: "n", kind: "digits" } },
  },
  {
    id: "group.wolf-form",
    name: "Wolf Form",
    type: "mech-complex",
    aliases: [],
    display: { mode: "label" },
    description:
      "Valkenhayn (Blazblue) transforms into a wolf by pressing the D button. In wolf form he gains a completely new moveset and movement properties. This notation means the sequence must be made in Wolf Form.",
    more: {
      name: "Dustloop",
      url: "https://www.dustloop.com/w/BBCF/Valkenhayn_R._Hellsing",
    },
    group: { open: "w[", close: "]" },
  },
  {
    id: "group.human-form",
    name: "Human Form",
    type: "mech-complex",
    aliases: [],
    display: { mode: "label" },
    description:
      "Valkenhayn (Blazblue) transforms into a wolf by pressing the D button. This notation means the sequence must be made in Human Form.",
    group: { open: "h[", close: "]" },
  },
  {
    id: "group.float",
    name: "Float",
    type: "mech-complex",
    aliases: [],
    display: { mode: "label" },
    description:
      "Sequence is done during float. For characters like Izanami from Blazblue who instead of a double jump, can float by pressing jump while in the air.",
    group: { open: "fl.{", close: "}" },
  },
  {
    id: "group.whiffed-move",
    name: "Whiffed Move",
    type: "mech-complex",
    aliases: [],
    display: { mode: "label" },
    description: "Whiff (not hit) the move.",
    group: { open: "(", close: ")w" },
  },
];
