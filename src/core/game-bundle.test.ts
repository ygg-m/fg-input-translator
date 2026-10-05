import { describe, expect, it } from "vitest";
import { customAncestry, mergeGames } from "./game-bundle";
import type { TokenDefinition } from "./types";
import { emptyWorkspace } from "./workspace";
import type { CustomGame, Workspace } from "./workspace";

const builtIn = ["street-fighter", "guilty-gear"];

const saved = (gameId: string, alias: string, name: string): TokenDefinition => ({
  id: `custom.${gameId}.${alias}`,
  name,
  aliases: [alias],
  basedOn: "base.x",
  saved: true,
});

describe("customAncestry", () => {
  const games: CustomGame[] = [
    { id: "custom-a", name: "A", extends: "street-fighter" },
    { id: "custom-b", name: "B", extends: "custom-a" },
    { id: "custom-c", name: "C", extends: "custom-b" },
    { id: "custom-loop", name: "Loop", extends: "custom-loop" },
  ];

  it("lists a game's custom ancestors and the game itself, ancestors first", () => {
    expect(customAncestry(games, "custom-c").map((g) => g.id)).toEqual(["custom-a", "custom-b", "custom-c"]);
    expect(customAncestry(games, "custom-a").map((g) => g.id)).toEqual(["custom-a"]);
  });

  it("is empty for a built-in or unknown game, and never loops", () => {
    expect(customAncestry(games, "street-fighter")).toEqual([]);
    expect(customAncestry(games, "ghost")).toEqual([]);
    expect(customAncestry(games, "custom-loop").map((g) => g.id)).toEqual(["custom-loop"]);
  });
});

describe("mergeGames", () => {
  const existing = (): Workspace => ({
    ...emptyWorkspace(),
    customGames: [{ id: "custom-mine", name: "Mine" }],
    customLayers: { "custom-mine": [saved("custom-mine", "m", "My move")] },
  });

  it("adds a new custom game with its saved definitions, and leaves the input untouched", () => {
    const before = existing();

    const result = mergeGames(
      before,
      [{ id: "custom-ryu", name: "Ryu training", extends: "street-fighter" }],
      { "custom-ryu": [saved("custom-ryu", "lp", "Jab")] },
      builtIn,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.idMap).toEqual({ "custom-ryu": "custom-ryu-training" });
    expect(result.added).toEqual(["custom-ryu-training"]);
    expect(result.workspace.customGames).toEqual([
      { id: "custom-mine", name: "Mine" },
      { id: "custom-ryu-training", name: "Ryu training", extends: "street-fighter" },
    ]);
    expect(result.workspace.customLayers["custom-ryu-training"]).toEqual([saved("custom-ryu", "lp", "Jab")]);
    expect(before).toEqual(existing());
  });

  it("reuses a game you already have when it is identical", () => {
    const result = mergeGames(
      existing(),
      [{ id: "custom-someone-elses-id", name: "Mine" }],
      { "custom-someone-elses-id": [saved("custom-mine", "m", "My move")] },
      builtIn,
    );

    expect(result.ok && result.idMap).toEqual({ "custom-someone-elses-id": "custom-mine" });
    expect(result.ok && result.added).toEqual([]);
    expect(result.ok && result.workspace).toEqual(existing());
  });

  it("adds a different game that has the same name as another one, with a distinct name and id", () => {
    const result = mergeGames(
      existing(),
      [{ id: "custom-mine", name: "Mine" }],
      { "custom-mine": [saved("custom-mine", "z", "Different")] },
      builtIn,
    );

    expect(result.ok && result.workspace.customGames).toEqual([
      { id: "custom-mine", name: "Mine" },
      { id: "custom-mine-2", name: "Mine (2)" },
    ]);
    expect(result.ok && result.idMap).toEqual({ "custom-mine": "custom-mine-2" });
  });

  it("points a child at its parent's new id, whatever order the games arrive in", () => {
    const result = mergeGames(
      emptyWorkspace(),
      [
        { id: "x-child", name: "Child", extends: "x-parent" },
        { id: "x-parent", name: "Parent", extends: "guilty-gear" },
      ],
      {},
      builtIn,
    );

    expect(result.ok && result.workspace.customGames).toEqual([
      { id: "custom-parent", name: "Parent", extends: "guilty-gear" },
      { id: "custom-child", name: "Child", extends: "custom-parent" },
    ]);
  });

  it("refuses a game based on one that exists neither in the bundle nor here", () => {
    expect(
      mergeGames(emptyWorkspace(), [{ id: "x", name: "X", extends: "vanished" }], {}, builtIn),
    ).toEqual({ ok: false, reason: "unknown-parent", gameId: "x", parent: "vanished" });
  });
});
