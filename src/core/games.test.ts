import { describe, expect, it } from "vitest";
import { resolveGame, validateLayer } from "./games";
import { parse } from "./parse";
import type { GameRegistry } from "./games";
import type { TokenDefinition } from "./types";

const basePunch: TokenDefinition = {
  id: "base.punch",
  name: "Punch",
  aliases: ["P", "punch"],
};

const gamePunch: TokenDefinition = {
  id: "g1.pistol",
  name: "Pistol",
  aliases: ["P"],
};

describe("resolveGame", () => {
  it("lets a game's alias shadow the same alias in the shared base", () => {
    const registry: GameRegistry = {
      base: [basePunch],
      games: [{ id: "g1", name: "Game One", definitions: [gamePunch] }],
    };

    const result = resolveGame("g1", registry);

    expect(result).toEqual({
      ok: true,
      definitions: [
        gamePunch,
        { ...basePunch, aliases: ["punch"] },
      ],
    });
  });

  it("still lets a longer alias from the base beat a shorter game alias", () => {
    const qcf: TokenDefinition = { id: "base.qcf", name: "QCF", aliases: ["236"] };
    const down: TokenDefinition = { id: "g1.down", name: "Down", aliases: ["2"] };
    const registry: GameRegistry = {
      base: [qcf],
      games: [{ id: "g1", name: "Game One", definitions: [down] }],
    };

    const result = resolveGame("g1", registry);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(parse("236", result.definitions).map((n) => n.definitionId)).toEqual(["base.qcf"]);
  });

  it("resolves an extends chain with the nearest layer winning", () => {
    const pistol: TokenDefinition = { id: "p1.pistol", name: "Pistol", aliases: ["P", "pistol"] };
    const cannon: TokenDefinition = { id: "c1.cannon", name: "Cannon", aliases: ["P"] };
    const registry: GameRegistry = {
      base: [basePunch],
      games: [
        { id: "p1", name: "Parent", definitions: [pistol] },
        { id: "c1", name: "Child", extends: "p1", definitions: [cannon] },
      ],
    };

    expect(resolveGame("c1", registry)).toEqual({
      ok: true,
      definitions: [
        cannon,
        { ...pistol, aliases: ["pistol"] },
        { ...basePunch, aliases: ["punch"] },
      ],
    });
  });

  it("reports an unknown game or a missing parent instead of throwing", () => {
    const registry: GameRegistry = {
      base: [basePunch],
      games: [{ id: "orphan", name: "Orphan", extends: "ghost", definitions: [] }],
    };

    expect(resolveGame("nope", registry)).toEqual({
      ok: false,
      errors: [{ code: "unknown-game", gameId: "nope" }],
    });
    expect(resolveGame("orphan", registry)).toEqual({
      ok: false,
      errors: [{ code: "unknown-game", gameId: "ghost" }],
    });
  });

  it("reports an extends cycle instead of looping forever", () => {
    const registry: GameRegistry = {
      base: [],
      games: [
        { id: "a", name: "A", extends: "b", definitions: [] },
        { id: "b", name: "B", extends: "a", definitions: [] },
      ],
    };

    expect(resolveGame("a", registry)).toEqual({
      ok: false,
      errors: [{ code: "extends-cycle", gameId: "a" }],
    });
  });

  it("rejects a duplicate alias within one layer but allows it across layers", () => {
    const a: TokenDefinition = { id: "g1.a", name: "A", aliases: ["P"] };
    const b: TokenDefinition = { id: "g1.b", name: "B", aliases: ["x", "P"] };

    expect(validateLayer([a, b])).toEqual([
      { code: "duplicate-alias", alias: "P", definitionIds: ["g1.a", "g1.b"] },
    ]);

    const registry: GameRegistry = {
      base: [basePunch],
      games: [{ id: "g1", name: "Game One", definitions: [a, b] }],
    };
    expect(resolveGame("g1", registry)).toEqual({
      ok: false,
      errors: [
        { code: "duplicate-alias", alias: "P", definitionIds: ["g1.a", "g1.b"], gameId: "g1" },
      ],
    });
  });

  it("normalizes whitespace in aliases so they can match the stripped notation", () => {
    const odCancel: TokenDefinition = { id: "g1.odc", name: "OD Cancel", aliases: ["OD Cancel"] };
    const registry: GameRegistry = {
      base: [],
      games: [{ id: "g1", name: "Game One", definitions: [odCancel] }],
    };

    const result = resolveGame("g1", registry);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.definitions[0]!.aliases).toEqual(["ODCancel"]);
    expect(parse("OD Cancel", result.definitions)).toEqual([
      { text: "OD Cancel", start: 0, end: 9, definitionId: "g1.odc" },
    ]);
  });

  it("flags aliases that are empty once whitespace is removed", () => {
    const blank: TokenDefinition = { id: "g1.blank", name: "Blank", aliases: ["P", " "] };
    const grouped: TokenDefinition = { id: "g1.grouped", name: "Grouped", aliases: [] };

    expect(validateLayer([blank, grouped])).toEqual([
      { code: "empty-alias", definitionId: "g1.blank" },
    ]);
  });

  it("detects duplicates that only differ by whitespace", () => {
    const spaced: TokenDefinition = { id: "g1.spaced", name: "Spaced", aliases: ["A B"] };
    const tight: TokenDefinition = { id: "g1.tight", name: "Tight", aliases: ["AB"] };

    expect(validateLayer([spaced, tight])).toEqual([
      { code: "duplicate-alias", alias: "AB", definitionIds: ["g1.spaced", "g1.tight"] },
    ]);
  });

  it("drops a definition that lost every alias but keeps alias-less group definitions", () => {
    const fullyShadowed: TokenDefinition = { id: "base.p", name: "P", aliases: ["P"] };
    const hold: TokenDefinition = {
      id: "base.hold",
      name: "Hold",
      aliases: [],
      group: { open: "[", close: "]" },
    };
    const registry: GameRegistry = {
      base: [fullyShadowed, hold],
      games: [{ id: "g1", name: "Game One", definitions: [gamePunch] }],
    };

    expect(resolveGame("g1", registry)).toEqual({
      ok: true,
      definitions: [gamePunch, hold],
    });
  });

  it("lets an ignoreCase alias in a nearer layer claim every casing of that text", () => {
    const baseX: TokenDefinition = { id: "base.x", name: "X", aliases: ["X", "cross"] };
    const whiff: TokenDefinition = { id: "g1.whiff", name: "Whiff", aliases: ["x"], ignoreCase: true };
    const registry: GameRegistry = {
      base: [baseX],
      games: [{ id: "g1", name: "Game One", definitions: [whiff] }],
    };

    expect(resolveGame("g1", registry)).toEqual({
      ok: true,
      definitions: [whiff, { ...baseX, aliases: ["cross"] }],
    });
  });

  it("keeps other casings available when the nearer alias is case-sensitive", () => {
    const baseX: TokenDefinition = { id: "base.x", name: "X", aliases: ["X"], ignoreCase: false };
    const lower: TokenDefinition = { id: "g1.lower", name: "Lower", aliases: ["x"] };
    const registry: GameRegistry = {
      base: [baseX],
      games: [{ id: "g1", name: "Game One", definitions: [lower] }],
    };

    expect(resolveGame("g1", registry)).toEqual({ ok: true, definitions: [lower, baseX] });
  });

  it("resolves a Custom Layer on top of its Game without touching other Games", () => {
    const jab: TokenDefinition = {
      id: "custom.g1.P",
      name: "Jab",
      aliases: ["P"],
      basedOn: "base.punch",
      saved: true,
    };
    const registry: GameRegistry = {
      base: [basePunch],
      games: [
        { id: "g1", name: "Game One", definitions: [] },
        { id: "g2", name: "Game Two", definitions: [] },
      ],
    };
    const customLayers = { g1: [jab] };

    expect(resolveGame("g1", registry, customLayers)).toEqual({
      ok: true,
      definitions: [jab, { ...basePunch, aliases: ["punch"] }],
    });
    expect(resolveGame("g2", registry, customLayers)).toEqual({
      ok: true,
      definitions: [basePunch],
    });
  });

  describe("Custom Layers across a chain", () => {
    const parentPunch: TokenDefinition = { id: "p.punch", name: "Parent Punch", aliases: ["P", "pp"] };
    const registry: GameRegistry = {
      base: [basePunch],
      games: [
        { id: "parent", name: "Parent", definitions: [parentPunch] },
        { id: "child", name: "Child", extends: "parent", definitions: [] },
      ],
    };
    const saved = (gameId: string, name: string): TokenDefinition => ({
      id: `custom.${gameId}.P`,
      name,
      aliases: ["P"],
      basedOn: "p.punch",
      saved: true,
    });

    it("applies the saved definitions of the games a game is based on", () => {
      const jab = saved("parent", "Parent Jab");

      const result = resolveGame("child", registry, { parent: [jab] });

      expect(result).toEqual({
        ok: true,
        definitions: [
          jab,
          { ...parentPunch, aliases: ["pp"] },
          { ...basePunch, aliases: ["punch"] },
        ],
      });
    });

    it("lets the nearest game's saved definition win over a parent's", () => {
      const parentJab = saved("parent", "Parent Jab");
      const childJab = saved("child", "Child Jab");

      const result = resolveGame("child", registry, { parent: [parentJab], child: [childJab] });

      expect(result.ok && result.definitions.map((d) => d.name)).toEqual(["Child Jab", "Parent Punch", "Punch"]);
    });

    it("does not apply a child's saved definitions when resolving its parent", () => {
      const result = resolveGame("parent", registry, { child: [saved("child", "Child Jab")] });

      expect(result.ok && result.definitions.map((d) => d.name)).toEqual(["Parent Punch", "Punch"]);
    });
  });
});
