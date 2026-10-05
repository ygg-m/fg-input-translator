import { describe, expect, it } from "vitest";
import { resolveGame } from "../core/games";
import { parse } from "../core/parse";
import { registry } from "./index";
import blazblue from "./golden/blazblue.json";
import guiltyGear from "./golden/guilty-gear.json";
import kingOfFighters from "./golden/king-of-fighters.json";
import persona from "./golden/persona.json";
import streetFighter from "./golden/street-fighter.json";
import thems from "./golden/thems-fightin-herds.json";

// Golden files record what the legacy app produced for flat notations (see
// docs/legacy-port-notes.md). `matching` must keep matching it; `differences` are
// the reviewed, intentional deviations and must stay exactly as recorded.
interface Golden {
  matching: { notation: string; ids: string[] }[];
  differences: { notation: string; legacy: string[]; current: string[]; reason: string }[];
}

const goldens: Record<string, Golden> = {
  "guilty-gear": guiltyGear,
  "street-fighter": streetFighter,
  "king-of-fighters": kingOfFighters,
  blazblue,
  persona,
  "thems-fightin-herds": thems,
};

const idsFor = (gameId: string, notation: string) => {
  const resolved = resolveGame(gameId, registry);
  if (!resolved.ok) throw new Error(JSON.stringify(resolved.errors));
  return parse(notation, resolved.definitions).map((node) => node.definitionId);
};

describe.each(Object.entries(goldens))("golden notations: %s", (gameId, golden) => {
  it("resolves the game without errors", () => {
    expect(resolveGame(gameId, registry).ok).toBe(true);
  });

  it("still produces what the legacy app produced", () => {
    const mismatches = golden.matching
      .map(({ notation, ids: expected }) => ({ notation, expected, actual: idsFor(gameId, notation) }))
      .filter(({ expected, actual }) => JSON.stringify(expected) !== JSON.stringify(actual));

    expect(mismatches).toEqual([]);
  });

  it("keeps the reviewed differences from the legacy app unchanged", () => {
    const drifted = golden.differences
      .map((d) => ({ notation: d.notation, expected: d.current, actual: idsFor(gameId, d.notation) }))
      .filter(({ expected, actual }) => JSON.stringify(expected) !== JSON.stringify(actual));

    expect(drifted).toEqual([]);
  });
});
