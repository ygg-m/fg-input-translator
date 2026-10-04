import { describe, expect, it } from "vitest";
import { parse } from "./parse";
import type { TokenDefinition } from "./types";

const punch: TokenDefinition = { id: "action.punch", name: "Punch", aliases: ["P"] };
const kick: TokenDefinition = { id: "action.kick", name: "Kick", aliases: ["K"] };

const simultaneous: TokenDefinition = {
  id: "mech.simultaneous",
  name: "Simultaneous",
  aliases: [],
  group: { separator: "+" },
};

const slash: TokenDefinition = { id: "action.slash", name: "Slash", aliases: ["S"] };
const quarterCircle: TokenDefinition = {
  id: "motion.qcf",
  name: "Quarter-Circle Forward",
  aliases: ["236"],
};
const forward: TokenDefinition = { id: "dir.forward", name: "Forward", aliases: ["6"] };
const hold: TokenDefinition = {
  id: "mech.hold",
  name: "Hold",
  aliases: [],
  group: { open: "[", close: "]" },
};

describe("parse simultaneous presses", () => {
  it("joins the operands around a separator into one group", () => {
    const nodes = parse("P+K", [punch, kick, simultaneous]);

    expect(nodes).toEqual([
      {
        text: "P+K",
        start: 0,
        end: 3,
        definitionId: "mech.simultaneous",
        params: {},
        children: [
          { text: "P", start: 0, end: 1, definitionId: "action.punch" },
          { text: "K", start: 2, end: 3, definitionId: "action.kick" },
        ],
      },
    ]);
  });

  it("keeps a chain of separators in one flat group", () => {
    const nodes = parse("P + K + S", [punch, kick, slash, simultaneous]);

    expect(nodes).toEqual([
      {
        text: "P + K + S",
        start: 0,
        end: 9,
        definitionId: "mech.simultaneous",
        params: {},
        children: [
          { text: "P", start: 0, end: 1, definitionId: "action.punch" },
          { text: "K", start: 4, end: 5, definitionId: "action.kick" },
          { text: "S", start: 8, end: 9, definitionId: "action.slash" },
        ],
      },
    ]);
  });

  it("only joins the operands next to the separator", () => {
    const nodes = parse("236P+K", [quarterCircle, punch, kick, simultaneous]);

    expect(nodes.map((n) => n.definitionId)).toEqual(["motion.qcf", "mech.simultaneous"]);
    expect(nodes[1]).toMatchObject({ text: "P+K", start: 3, end: 6 });
  });

  it("accepts a group as an operand", () => {
    const nodes = parse("[6]+P", [forward, punch, hold, simultaneous]);

    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toMatchObject({
      definitionId: "mech.simultaneous",
      start: 0,
      end: 5,
      children: [
        { definitionId: "mech.hold", text: "[6]" },
        { definitionId: "action.punch", text: "P" },
      ],
    });
  });

  it("treats a separator missing an operand as unknown text", () => {
    const defs = [punch, kick, simultaneous];

    expect(parse("P+", defs)).toEqual([
      { text: "P", start: 0, end: 1, definitionId: "action.punch" },
      { text: "+", start: 1, end: 2, definitionId: "unknown" },
    ]);
    expect(parse("+K", defs)).toEqual([
      { text: "+", start: 0, end: 1, definitionId: "unknown" },
      { text: "K", start: 1, end: 2, definitionId: "action.kick" },
    ]);
  });
});
