import { describe, expect, it } from "vitest";
import { createGame, deleteGame, effectiveRegistry, parentChoices, renameGame, setParent } from "./custom-games";
import type { GameRegistry } from "./games";
import { emptyWorkspace } from "./workspace";
import type { Workspace } from "./workspace";

const registry: GameRegistry = {
  base: [],
  games: [
    { id: "street-fighter", name: "Street Fighter", definitions: [] },
    { id: "guilty-gear", name: "Guilty Gear", definitions: [] },
  ],
};

const existing = (): Workspace => ({
  ...emptyWorkspace(),
  selectedGame: "guilty-gear",
  games: {
    "guilty-gear": { activeTab: "tab-1", tabs: [{ id: "tab-1", name: "Sol", rows: [] }] },
  },
});

describe("createGame", () => {
  it("adds a game with a fresh id, selects it, and leaves everything else alone", () => {
    const before = existing();

    const result = createGame(before, registry, { name: "  My Game ", extends: "street-fighter" });

    expect(result).toEqual({
      ok: true,
      gameId: "custom-my-game",
      workspace: {
        ...before,
        selectedGame: "custom-my-game",
        customGames: [{ id: "custom-my-game", name: "My Game", extends: "street-fighter" }],
      },
    });
    expect(before).toEqual(existing());
  });

  it("makes a game based on nothing when no parent is given", () => {
    const result = createGame(emptyWorkspace(), registry, { name: "Mine" });

    expect(result.ok && result.workspace.customGames).toEqual([{ id: "custom-mine", name: "Mine" }]);
  });

  it("keeps ids unique, including for names with no letters or digits", () => {
    const first = createGame(emptyWorkspace(), registry, { name: "My Game" });
    if (!first.ok) throw new Error("expected ok");
    const second = createGame(first.workspace, registry, { name: "my game!" });
    if (!second.ok) throw new Error("expected ok");
    const third = createGame(second.workspace, registry, { name: "日本語" });

    expect(second.gameId).toBe("custom-my-game-2");
    expect(third.ok && third.gameId).toBe("custom-game");
  });

  it("refuses an empty name and a parent that does not exist", () => {
    expect(createGame(emptyWorkspace(), registry, { name: "   " })).toEqual({ ok: false, reason: "empty-name" });
    expect(createGame(emptyWorkspace(), registry, { name: "X", extends: "nope" })).toEqual({
      ok: false,
      reason: "unknown-parent",
    });
  });

  it("can be based on another custom game", () => {
    const first = createGame(emptyWorkspace(), registry, { name: "Base" });
    if (!first.ok) throw new Error("expected ok");

    const second = createGame(first.workspace, registry, { name: "Child", extends: first.gameId });

    expect(second.ok && second.workspace.customGames.map((g) => g.extends)).toEqual([undefined, "custom-base"]);
  });
});

const withGames = (): Workspace => ({
  ...emptyWorkspace(),
  selectedGame: "custom-b",
  customGames: [
    { id: "custom-a", name: "A", extends: "street-fighter" },
    { id: "custom-b", name: "B", extends: "custom-a" },
    { id: "custom-c", name: "C" },
  ],
  customLayers: {
    "custom-c": [{ id: "custom.custom-c.x", name: "X", aliases: ["x"], basedOn: "b", saved: true }],
    "street-fighter": [{ id: "custom.street-fighter.y", name: "Y", aliases: ["y"], basedOn: "b", saved: true }],
  },
  games: {
    "custom-c": { activeTab: "tab-1", tabs: [{ id: "tab-1", name: "T", rows: [] }] },
    "street-fighter": { activeTab: "tab-1", tabs: [{ id: "tab-1", name: "S", rows: [] }] },
  },
});

describe("effectiveRegistry", () => {
  it("adds the user's games after the built-in ones, keeping who they are based on", () => {
    const merged = effectiveRegistry(registry, withGames());

    expect(merged.base).toBe(registry.base);
    expect(merged.games.map((g) => [g.id, g.extends])).toEqual([
      ["street-fighter", undefined],
      ["guilty-gear", undefined],
      ["custom-a", "street-fighter"],
      ["custom-b", "custom-a"],
      ["custom-c", undefined],
    ]);
    expect(merged.games.at(-1)!.name).toBe("C");
  });
});

describe("renameGame", () => {
  it("renames one custom game with a trimmed name and ignores empty names, built-ins and unknown ids", () => {
    const renamed = renameGame(withGames(), "custom-c", "  Renamed ");
    expect(renamed.customGames.map((g) => g.name)).toEqual(["A", "B", "Renamed"]);

    const same = withGames();
    expect(renameGame(same, "custom-c", "   ")).toBe(same);
    expect(renameGame(same, "street-fighter", "Nope")).toBe(same);
    expect(renameGame(same, "ghost", "Nope")).toBe(same);
  });
});

describe("setParent", () => {
  it("changes or clears what a game is based on", () => {
    const moved = setParent(withGames(), registry, "custom-c", "guilty-gear");
    expect(moved.ok && moved.workspace.customGames.find((g) => g.id === "custom-c")).toEqual({
      id: "custom-c",
      name: "C",
      extends: "guilty-gear",
    });

    const cleared = setParent(withGames(), registry, "custom-a", undefined);
    expect(cleared.ok && cleared.workspace.customGames.find((g) => g.id === "custom-a")).toEqual({
      id: "custom-a",
      name: "A",
    });
  });

  it("refuses a game based on itself or on one of its own descendants", () => {
    expect(setParent(withGames(), registry, "custom-a", "custom-a")).toEqual({ ok: false, reason: "cycle" });
    expect(setParent(withGames(), registry, "custom-a", "custom-b")).toEqual({ ok: false, reason: "cycle" });
  });

  it("refuses unknown games and parents, and built-in games", () => {
    expect(setParent(withGames(), registry, "ghost", undefined)).toEqual({ ok: false, reason: "unknown-game" });
    expect(setParent(withGames(), registry, "street-fighter", undefined)).toEqual({ ok: false, reason: "unknown-game" });
    expect(setParent(withGames(), registry, "custom-c", "ghost")).toEqual({ ok: false, reason: "unknown-parent" });
  });
});

describe("deleteGame", () => {
  it("removes the game with its tabs and saved definitions, and leaves other games alone", () => {
    const result = deleteGame(withGames(), "custom-c");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.workspace.customGames.map((g) => g.id)).toEqual(["custom-a", "custom-b"]);
    expect(result.workspace.games).not.toHaveProperty("custom-c");
    expect(result.workspace.customLayers).not.toHaveProperty("custom-c");
    expect(result.workspace.games["street-fighter"]).toEqual(withGames().games["street-fighter"]);
    expect(result.workspace.customLayers["street-fighter"]).toEqual(withGames().customLayers["street-fighter"]);
  });

  it("is refused while another custom game is based on it, naming those games", () => {
    expect(deleteGame(withGames(), "custom-a")).toEqual({ ok: false, reason: "has-children", children: ["custom-b"] });
  });

  it("moves the selection to the deleted game's parent, or the default game", () => {
    const toParent = deleteGame(withGames(), "custom-b");
    expect(toParent.ok && toParent.workspace.selectedGame).toBe("custom-a");

    const selectedC = { ...withGames(), selectedGame: "custom-c" };
    const toDefault = deleteGame(selectedC, "custom-c");
    expect(toDefault.ok && toDefault.workspace.selectedGame).toBe("guilty-gear");

    const elsewhere = deleteGame({ ...withGames(), selectedGame: "guilty-gear" }, "custom-c");
    expect(elsewhere.ok && elsewhere.workspace.selectedGame).toBe("guilty-gear");
  });

  it("refuses built-in and unknown games", () => {
    expect(deleteGame(withGames(), "street-fighter")).toEqual({ ok: false, reason: "unknown-game" });
    expect(deleteGame(withGames(), "ghost")).toEqual({ ok: false, reason: "unknown-game" });
  });
});

describe("parentChoices", () => {
  it("offers every game except the game itself and the games based on it", () => {
    const ids = (gameId: string) => parentChoices(withGames(), registry, gameId).map((g) => g.id);

    expect(ids("custom-a")).toEqual(["street-fighter", "guilty-gear", "custom-c"]);
    expect(ids("custom-c")).toEqual(["street-fighter", "guilty-gear", "custom-a", "custom-b"]);
    expect(parentChoices(withGames(), registry, "custom-c").find((g) => g.id === "custom-a")).toEqual({
      id: "custom-a",
      name: "A",
    });
  });

  it("offers everything when asked for a game that does not exist yet", () => {
    expect(parentChoices(withGames(), registry, undefined).map((g) => g.id)).toEqual([
      "street-fighter",
      "guilty-gear",
      "custom-a",
      "custom-b",
      "custom-c",
    ]);
  });
});
