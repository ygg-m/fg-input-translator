import { describe, expect, it } from "vitest";
import type { SharedTab } from "./share";
import { discardSharedTab, importSharedTab } from "./share-import";
import type { SharedImport } from "./share-import";
import type { TokenDefinition } from "./types";
import { emptyWorkspace } from "./workspace";
import type { CustomGame, Workspace } from "./workspace";

const builtIn = ["street-fighter", "guilty-gear", "persona"];

const saved = (alias: string, name: string, gameId = "street-fighter"): TokenDefinition => ({
  id: `custom.${gameId}.${alias}`,
  name,
  aliases: [alias],
  basedOn: "sf.light-punch",
  saved: true,
});

const tab = { name: "Shared combos", rows: [{ notation: "5K", customizations: [] }] };

const shared = (
  gameId: string,
  definitions: Record<string, TokenDefinition[]> = {},
  customGames: CustomGame[] = [],
): SharedTab => ({ gameId, tab, customGames, definitions });

const existing = (): Workspace => ({
  ...emptyWorkspace(),
  selectedGame: "guilty-gear",
  customLayers: { "street-fighter": [saved("lp", "My Jab")] },
  games: {
    "street-fighter": {
      activeTab: "tab-1",
      tabs: [{ id: "tab-1", name: "Mine", rows: [] }],
    },
  },
});

const imported = (workspace: Workspace, sharedTab: SharedTab): Extract<SharedImport, { ok: true }> => {
  const result = importSharedTab(workspace, sharedTab, builtIn);
  if (!result.ok) throw new Error(`expected ok, got ${result.reason}`);
  return result;
};

describe("importSharedTab", () => {
  it("adds the tab with a fresh id, selects it and its game, and leaves the input untouched", () => {
    const before = existing();

    const result = imported(before, shared("street-fighter"));

    expect(result.tabId).toBe("tab-2");
    expect(result.gameId).toBe("street-fighter");
    expect(result.workspace.selectedGame).toBe("street-fighter");
    expect(result.workspace.games["street-fighter"]).toEqual({
      activeTab: "tab-2",
      tabs: [
        { id: "tab-1", name: "Mine", rows: [] },
        { id: "tab-2", name: "Shared combos", rows: tab.rows },
      ],
    });
    expect(result.skipped).toEqual([]);
    expect(before).toEqual(existing());
  });

  it("creates the game's workspace when it has none yet", () => {
    const result = imported(emptyWorkspace(), shared("persona"));

    expect(result.workspace.games.persona!.tabs.map((t) => t.id)).toEqual(["tab-1"]);
    expect(result.workspace.selectedGame).toBe("persona");
  });

  it("adds new saved definitions but keeps yours when the same text is already saved", () => {
    const theirs = [saved("lp", "Their Jab"), saved("mp", "Their Mid")];

    const result = imported(existing(), shared("street-fighter", { "street-fighter": theirs }));

    expect(result.workspace.customLayers["street-fighter"]!.map((d) => d.name)).toEqual(["My Jab", "Their Mid"]);
    expect(result.skipped).toEqual([theirs[0]]);
  });

  it("treats a shared alias as taken when any of your saved definitions already uses it", () => {
    const incoming: TokenDefinition = { ...saved("x", "Multi"), aliases: ["x", "l p"] };

    const result = imported(existing(), shared("street-fighter", { "street-fighter": [incoming] }));

    expect(result.skipped).toEqual([incoming]);
    expect(result.workspace.customLayers["street-fighter"]!.map((d) => d.name)).toEqual(["My Jab"]);
  });
});

describe("importSharedTab with a custom game", () => {
  const ryu: CustomGame = { id: "custom-ryu", name: "Ryu training", extends: "street-fighter" };

  it("adds the game with its saved definitions and puts the tab in it", () => {
    const definition = saved("lp", "Jab", "custom-ryu");

    const result = imported(existing(), shared("custom-ryu", { "custom-ryu": [definition] }, [ryu]));

    expect(result.gameId).toBe("custom-ryu-training");
    expect(result.addedGames).toEqual(["custom-ryu-training"]);
    expect(result.workspace.customGames).toEqual([{ id: "custom-ryu-training", name: "Ryu training", extends: "street-fighter" }]);
    expect(result.workspace.customLayers["custom-ryu-training"]).toEqual([definition]);
    expect(result.workspace.games["custom-ryu-training"]!.tabs.map((t) => t.name)).toEqual(["Shared combos"]);
    expect(result.workspace.selectedGame).toBe("custom-ryu-training");
    // your own saved definitions for the built-in game are not touched
    expect(result.workspace.customLayers["street-fighter"]).toEqual(existing().customLayers["street-fighter"]);
  });

  it("puts the tab into a game you already have when it is identical", () => {
    const first = imported(existing(), shared("custom-ryu", {}, [ryu]));
    const withGame = discardNothing(first.workspace);

    const again = imported(withGame, shared("custom-ryu", {}, [ryu]));

    expect(again.gameId).toBe("custom-ryu-training");
    expect(again.addedGames).toEqual([]);
    expect(again.workspace.customGames).toHaveLength(1);
    expect(again.workspace.games["custom-ryu-training"]!.tabs).toHaveLength(2);
  });

  it("refuses a game based on one that is neither carried nor here", () => {
    const orphan: CustomGame = { id: "custom-x", name: "X", extends: "vanished" };

    expect(importSharedTab(emptyWorkspace(), shared("custom-x", {}, [orphan]), builtIn)).toEqual({
      ok: false,
      reason: "unknown-parent",
    });
  });
});

describe("importSharedTab for a game it cannot place", () => {
  it("refuses a tab whose custom game the link does not carry", () => {
    expect(importSharedTab(emptyWorkspace(), shared("custom-ghost"), builtIn)).toEqual({
      ok: false,
      reason: "unknown-game",
    });
  });
});

// The workspace as the user would keep it once the first import was saved.
const discardNothing = (workspace: Workspace) => workspace;

describe("discardSharedTab", () => {
  it("restores exactly what there was before the import", () => {
    const before = existing();
    const result = imported(before, shared("street-fighter", { "street-fighter": [saved("mp", "Their Mid"), saved("lp", "Their Jab")] }));

    expect(discardSharedTab(result.workspace, result)).toEqual(before);
  });

  it("also removes a game's workspace that only the import created", () => {
    const before = existing();
    const result = imported(before, shared("persona", { persona: [saved("x", "X", "persona")] }));

    const restored = discardSharedTab(result.workspace, result);

    expect(restored).toEqual(before);
    expect(restored.games).not.toHaveProperty("persona");
  });

  it("removes a custom game that only the import created, with its tab and saved definitions", () => {
    const before = existing();
    const result = imported(
      before,
      shared("custom-ryu", { "custom-ryu": [saved("lp", "Jab", "custom-ryu")] }, [
        { id: "custom-ryu", name: "Ryu training", extends: "street-fighter" },
      ]),
    );

    expect(discardSharedTab(result.workspace, result)).toEqual(before);
  });

  it("keeps edits made to other tabs and saved definitions made since the import", () => {
    const result = imported(existing(), shared("street-fighter", { "street-fighter": [saved("mp", "Their Mid")] }));
    const edited: Workspace = {
      ...result.workspace,
      customLayers: {
        "street-fighter": [...result.workspace.customLayers["street-fighter"]!, saved("hp", "My Heavy")],
      },
      games: {
        "street-fighter": {
          ...result.workspace.games["street-fighter"]!,
          tabs: result.workspace.games["street-fighter"]!.tabs.map((t) =>
            t.id === "tab-1" ? { ...t, name: "Renamed" } : t,
          ),
        },
      },
    };

    const restored = discardSharedTab(edited, result);

    expect(restored.games["street-fighter"]!.tabs.map((t) => t.name)).toEqual(["Renamed"]);
    expect(restored.customLayers["street-fighter"]!.map((d) => d.name)).toEqual(["My Jab", "My Heavy"]);
  });
});
