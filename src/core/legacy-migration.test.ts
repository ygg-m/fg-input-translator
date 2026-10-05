import { describe, expect, it } from "vitest";
import { migrateLegacy } from "./legacy-migration";

const games = [
  { id: "guilty-gear", name: "Guilty Gear" },
  { id: "street-fighter", name: "Street Fighter" },
];

const row = (notation: string, label?: string) => ({
  notation,
  ...(label ? { label } : {}),
  customizations: [],
});

describe("migrateLegacy", () => {
  it("gives an empty workspace when the old app left nothing", () => {
    expect(migrateLegacy({}, games)).toEqual({
      workspace: { version: 1, selectedGame: "guilty-gear", customLayers: {}, games: {} },
      report: { sessionRow: false, importedCombos: 0, skipped: 0, listUnreadable: false },
    });
  });

  it("turns the last typed notation into a 'Last session' tab of the remembered game", () => {
    const { workspace, report } = migrateLegacy(
      { rawInput: "236P > 623K", gameName: "Street Fighter" },
      games,
    );

    expect(workspace.selectedGame).toBe("street-fighter");
    expect(workspace.games["street-fighter"]).toEqual({
      activeTab: "tab-1",
      tabs: [{ id: "tab-1", name: "Last session", rows: [row("236P > 623K")] }],
    });
    expect(report.sessionRow).toBe(true);
  });

  it("falls back to the default game when the remembered one is missing or unknown", () => {
    for (const gameName of [undefined, null, "Some Removed Game"]) {
      const { workspace } = migrateLegacy({ rawInput: "5K", gameName }, games);

      expect(workspace.selectedGame).toBe("guilty-gear");
      expect(workspace.games["guilty-gear"]!.tabs[0]!.rows).toEqual([row("5K")]);
    }
  });

  it("groups the saved combo list into a 'Saved combos' tab per game, keeping titles that differ", () => {
    const outputList = JSON.stringify([
      { Input: "236P", Game: "Guilty Gear", Title: "236P" },
      { Input: "5K 2K", Game: "Street Fighter", Title: "My jab string" },
      { Input: "6P", Game: "Guilty Gear", Title: "Forward punch" },
    ]);

    const { workspace, report } = migrateLegacy({ outputList }, games);

    expect(workspace.games["guilty-gear"]!.tabs).toEqual([
      { id: "tab-1", name: "Saved combos", rows: [row("236P"), row("6P", "Forward punch")] },
    ]);
    expect(workspace.games["street-fighter"]!.tabs).toEqual([
      { id: "tab-1", name: "Saved combos", rows: [row("5K 2K", "My jab string")] },
    ]);
    expect(report.importedCombos).toBe(3);
  });

  it("keeps the current session first and active when a game also has saved combos", () => {
    const outputList = JSON.stringify([{ Input: "2K", Game: "Street Fighter", Title: "2K" }]);

    const { workspace } = migrateLegacy(
      { rawInput: "5P", gameName: "Street Fighter", outputList },
      games,
    );

    const game = workspace.games["street-fighter"]!;
    expect(game.tabs.map((t) => t.name)).toEqual(["Last session", "Saved combos"]);
    expect(game.activeTab).toBe("tab-1");
  });

  it("files combos of an unknown game under an 'Imported' tab of the default game", () => {
    const outputList = JSON.stringify([
      { Input: "A", Game: "Vanished Game", Title: "A" },
      { Input: "B", Game: "Vanished Game", Title: "B" },
    ]);

    const { workspace } = migrateLegacy({ outputList }, games);

    expect(workspace.games["guilty-gear"]!.tabs).toEqual([
      { id: "tab-1", name: "Imported: Vanished Game", rows: [row("A"), row("B")] },
    ]);
  });

  it("skips damaged entries and unreadable lists instead of failing, and says so", () => {
    const damaged = JSON.stringify([
      { Input: "236P", Game: "Guilty Gear", Title: "236P" },
      { Game: "Guilty Gear", Title: "no input" },
      "not an object",
      { Input: 5, Game: "Guilty Gear", Title: "x" },
    ]);

    const partly = migrateLegacy({ outputList: damaged }, games);
    expect(partly.report).toMatchObject({ importedCombos: 1, skipped: 3, listUnreadable: false });

    for (const outputList of ["{nope", JSON.stringify({ not: "a list" })]) {
      const result = migrateLegacy({ outputList }, games);
      expect(result.report.listUnreadable).toBe(true);
      expect(result.workspace.games).toEqual({});
    }
  });
});
