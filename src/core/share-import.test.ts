import { describe, expect, it } from "vitest";
import { discardSharedTab, importSharedTab } from "./share-import";
import type { TokenDefinition } from "./types";
import { emptyWorkspace } from "./workspace";
import type { Workspace } from "./workspace";

const saved = (alias: string, name: string): TokenDefinition => ({
  id: `custom.street-fighter.${alias}`,
  name,
  aliases: [alias],
  basedOn: "sf.light-punch",
  saved: true,
});

const tab = { name: "Shared combos", rows: [{ notation: "5K", customizations: [] }] };

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

describe("importSharedTab", () => {
  it("adds the tab with a fresh id, selects it and its game, and leaves the input untouched", () => {
    const before = existing();

    const result = importSharedTab(before, "street-fighter", tab, []);

    expect(result.tabId).toBe("tab-2");
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
    const result = importSharedTab(emptyWorkspace(), "persona", tab, []);

    expect(result.workspace.games.persona!.tabs.map((t) => t.id)).toEqual(["tab-1"]);
    expect(result.workspace.selectedGame).toBe("persona");
  });

  it("adds new saved definitions but keeps yours when the same text is already saved", () => {
    const theirs = [saved("lp", "Their Jab"), saved("mp", "Their Mid")];

    const result = importSharedTab(existing(), "street-fighter", tab, theirs);

    expect(result.workspace.customLayers["street-fighter"]!.map((d) => d.name)).toEqual(["My Jab", "Their Mid"]);
    expect(result.skipped).toEqual([theirs[0]]);
  });

  it("treats a shared alias as taken when any of your saved definitions already uses it", () => {
    const incoming: TokenDefinition = { ...saved("x", "Multi"), aliases: ["x", "l p"] };

    const result = importSharedTab(existing(), "street-fighter", tab, [incoming]);

    expect(result.skipped).toEqual([incoming]);
    expect(result.workspace.customLayers["street-fighter"]!.map((d) => d.name)).toEqual(["My Jab"]);
  });
});

describe("discardSharedTab", () => {
  it("restores exactly what there was before the import", () => {
    const before = existing();
    const imported = importSharedTab(before, "street-fighter", tab, [saved("mp", "Their Mid"), saved("lp", "Their Jab")]);

    expect(discardSharedTab(imported.workspace, "street-fighter", imported)).toEqual(before);
  });

  it("also removes a game's workspace that only the import created", () => {
    const before = existing();
    const imported = importSharedTab(before, "persona", tab, [saved("x", "X")]);

    const restored = discardSharedTab(imported.workspace, "persona", imported);

    expect(restored).toEqual(before);
    expect(restored.games).not.toHaveProperty("persona");
  });

  it("keeps edits made to other tabs and saved definitions made since the import", () => {
    const imported = importSharedTab(existing(), "street-fighter", tab, [saved("mp", "Their Mid")]);
    const edited: Workspace = {
      ...imported.workspace,
      customLayers: {
        "street-fighter": [...imported.workspace.customLayers["street-fighter"]!, saved("hp", "My Heavy")],
      },
      games: {
        "street-fighter": {
          ...imported.workspace.games["street-fighter"]!,
          tabs: imported.workspace.games["street-fighter"]!.tabs.map((t) =>
            t.id === "tab-1" ? { ...t, name: "Renamed" } : t,
          ),
        },
      },
    };

    const restored = discardSharedTab(edited, "street-fighter", imported);

    expect(restored.games["street-fighter"]!.tabs.map((t) => t.name)).toEqual(["Renamed"]);
    expect(restored.customLayers["street-fighter"]!.map((d) => d.name)).toEqual(["My Jab", "My Heavy"]);
  });
});
