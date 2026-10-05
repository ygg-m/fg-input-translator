import { describe, expect, it } from "vitest";
import { parse } from "./parse";
import {
  anchorFor,
  customizeToken,
  findCustomization,
  reassignToken,
  resetToken,
  resolveRow,
} from "./row";
import type { Row } from "./row";
import type { TokenDefinition } from "./types";

const quarterCircle: TokenDefinition = {
  id: "motion.qcf",
  name: "Quarter Circle Forward",
  aliases: ["236"],
  display: { mode: "image", asset: "Motion236" },
};

const punch: TokenDefinition = {
  id: "action.punch",
  name: "Punch",
  aliases: ["P"],
  display: { mode: "image", asset: "ActionPunch" },
};

const definitions = [quarterCircle, punch];

const row = (notation: string, customizations: Row["customizations"] = []): Row => ({
  notation,
  customizations,
});

describe("resolveRow", () => {
  it("equals plain parsing when the Row has no customizations", () => {
    const resolved = resolveRow(row("236P"), definitions);

    expect(resolved).toEqual({
      nodes: parse("236P", definitions),
      definitions,
      dropped: [],
    });
  });

  it("swaps in a derived definition for the Token a customization is anchored to", () => {
    const resolved = resolveRow(
      row("236P", [
        {
          anchor: { text: "236", occurrence: 0 },
          basedOn: "motion.qcf",
          changes: { display: { mode: "text", text: "🌀" } },
        },
      ]),
      definitions,
    );

    expect(resolved.nodes).toEqual([
      { text: "236", start: 0, end: 3, definitionId: "motion.qcf~0" },
      { text: "P", start: 3, end: 4, definitionId: "action.punch" },
    ]);
    expect(resolved.definitions).toEqual([
      ...definitions,
      {
        ...quarterCircle,
        id: "motion.qcf~0",
        aliases: [],
        basedOn: "motion.qcf",
        display: { mode: "text", text: "🌀" },
      },
    ]);
    expect(resolved.dropped).toEqual([]);
  });

  const recolor = (text: string, occurrence: number, basedOn: string) => ({
    anchor: { text, occurrence },
    basedOn,
    changes: { name: "Mine" },
  });

  it("targets the nth Token showing the same text", () => {
    const resolved = resolveRow(row("P P", [recolor("P", 1, "action.punch")]), definitions);

    expect(resolved.nodes.map((n) => n.definitionId)).toEqual(["action.punch", "action.punch~0"]);
  });

  it("keeps a customization when the Notation changes elsewhere", () => {
    const customization = recolor("P", 0, "action.punch");

    for (const notation of ["P", "236 P", "P 236 236"]) {
      const resolved = resolveRow(row(notation, [customization]), definitions);
      expect(resolved.nodes.map((n) => n.definitionId)).toContain("action.punch~0");
      expect(resolved.dropped).toEqual([]);
    }
  });

  it("drops and reports a customization whose Token is gone or no longer the same definition", () => {
    const gone = recolor("P", 0, "action.punch");
    const changed = recolor("236", 0, "action.punch");

    const resolved = resolveRow(row("236", [gone, changed]), definitions);

    expect(resolved.nodes.map((n) => n.definitionId)).toEqual(["motion.qcf"]);
    expect(resolved.definitions).toEqual(definitions);
    expect(resolved.dropped).toEqual([gone, changed]);
  });

  it("customizes a Token inside a group", () => {
    const hold: TokenDefinition = {
      id: "mech.hold",
      name: "Hold",
      aliases: [],
      group: { open: "[", close: "]" },
    };

    const resolved = resolveRow(row("[P]", [recolor("P", 0, "action.punch")]), [...definitions, hold]);

    expect(resolved.nodes).toMatchObject([
      { definitionId: "mech.hold", children: [{ definitionId: "action.punch~0" }] },
    ]);
  });

  describe("customizeToken", () => {
    const anchor = { text: "P", occurrence: 0 };

    it("adds a customization, merges later edits for the same Token, and leaves the Row untouched", () => {
      const original = row("P");

      const first = customizeToken(original, anchor, "action.punch", { name: "Jab" });
      const second = customizeToken(first, anchor, "action.punch", { label: "fast" });

      expect(original.customizations).toEqual([]);
      expect(first.customizations).toEqual([{ anchor, basedOn: "action.punch", changes: { name: "Jab" } }]);
      expect(second.customizations).toEqual([
        { anchor, basedOn: "action.punch", changes: { name: "Jab", label: "fast" } },
      ]);
    });

    it("resets one Token back to pure by removing only its customization", () => {
      const other = { anchor: { text: "P", occurrence: 1 }, basedOn: "action.punch", changes: { name: "B" } };
      const mine = { anchor, basedOn: "action.punch", changes: { name: "A" } };

      expect(resetToken(row("P P", [mine, other]), anchor).customizations).toEqual([other]);
    });
  });

  describe("anchorFor", () => {
    it("counts how many Tokens with the same text come before the target, groups included", () => {
      const hold: TokenDefinition = {
        id: "mech.hold",
        name: "Hold",
        aliases: [],
        group: { open: "[", close: "]" },
      };
      const defs = [...definitions, hold];
      const nodes = parse("P [P] P", defs);
      const hoisted = nodes[1] as Extract<(typeof nodes)[number], { children: unknown }>;

      expect(anchorFor(nodes, nodes[0]!)).toEqual({ text: "P", occurrence: 0 });
      expect(anchorFor(nodes, hoisted.children[0]!)).toEqual({ text: "P", occurrence: 1 });
      expect(anchorFor(nodes, nodes[2]!)).toEqual({ text: "P", occurrence: 2 });
    });
  });

  describe("reassignToken", () => {
    const kick: TokenDefinition = { id: "action.kick", name: "Kick", aliases: ["K", "kick"] };
    const defs = [...definitions, kick];

    it("rewrites the Token's text to the new definition's first alias and re-anchors the rest", () => {
      const onFirstPunch = { anchor: { text: "P", occurrence: 0 }, basedOn: "action.punch", changes: { name: "gone" } };
      const onSecondPunch = { anchor: { text: "P", occurrence: 1 }, basedOn: "action.punch", changes: { name: "p2" } };
      const onKick = { anchor: { text: "K", occurrence: 0 }, basedOn: "action.kick", changes: { name: "k1" } };

      const result = reassignToken(
        row("P P K", [onFirstPunch, onSecondPunch, onKick]),
        { text: "P", occurrence: 0 },
        "action.kick",
        defs,
      );

      expect(result).toEqual({
        ok: true,
        row: {
          notation: "K P K",
          customizations: [
            { ...onSecondPunch, anchor: { text: "P", occurrence: 0 } },
            { ...onKick, anchor: { text: "K", occurrence: 1 } },
          ],
        },
      });
    });

    it("reports why a reassignment is impossible instead of throwing", () => {
      const hold: TokenDefinition = { id: "mech.hold", name: "Hold", aliases: [], group: { open: "[", close: "]" } };
      const all = [...defs, hold];
      const at = { text: "P", occurrence: 0 };

      expect(reassignToken(row("P"), { text: "P", occurrence: 3 }, "action.kick", all)).toEqual({ ok: false, reason: "no-token" });
      expect(reassignToken(row("P"), at, "nope", all)).toEqual({ ok: false, reason: "unknown-definition" });
      expect(reassignToken(row("P"), at, "mech.hold", all)).toEqual({ ok: false, reason: "no-alias" });
    });

    it("keeps surrounding spacing and re-anchors across it", () => {
      const onQcf = { anchor: { text: "2 3 6", occurrence: 0 }, basedOn: "motion.qcf", changes: { name: "q" } };

      const result = reassignToken(
        row("2 3 6   P", [onQcf]),
        { text: "P", occurrence: 0 },
        "action.kick",
        [{ ...quarterCircle, aliases: ["236"] }, punch, kick],
      );

      expect(result).toEqual({
        ok: true,
        row: { notation: "2 3 6   K", customizations: [onQcf] },
      });
    });
  });

  it("treats an edit on top of a saved definition as this-row-only, not saved", () => {
    const saved: TokenDefinition = {
      id: "custom.g.P",
      name: "Jab",
      aliases: ["P"],
      basedOn: "action.punch",
      saved: true,
    };

    const resolved = resolveRow(
      row("P", [{ anchor: { text: "P", occurrence: 0 }, basedOn: "custom.g.P", changes: { label: "x" } }]),
      [saved],
    );

    const derived = resolved.definitions.find((d) => d.id === "custom.g.P~0")!;
    expect(derived.basedOn).toBe("custom.g.P");
    expect(derived.saved).toBeFalsy();
  });

  it("finds the customization at an anchor, if any", () => {
    const mine = { anchor: { text: "P", occurrence: 1 }, basedOn: "action.punch", changes: { name: "A" } };
    const r = row("P P", [mine]);

    expect(findCustomization(r, { text: "P", occurrence: 1 })).toBe(mine);
    expect(findCustomization(r, { text: "P", occurrence: 0 })).toBeUndefined();
  });
});
