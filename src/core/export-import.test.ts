import { describe, expect, it } from "vitest";
import type { ExportEnvelope } from "./export";
import { applyImport, planImport } from "./export-import";
import type { Row } from "./row";
import type { TokenDefinition } from "./types";
import { emptyWorkspace } from "./workspace";
import type { CustomGame, Workspace } from "./workspace";

const known = ["street-fighter", "guilty-gear"];

const row = (notation: string): Row => ({ notation, customizations: [] });

const saved = (gameId: string, alias: string, name: string): TokenDefinition => ({
  id: `custom.${gameId}.${alias}`,
  name,
  aliases: [alias],
  basedOn: "base.x",
  saved: true,
});

const envelope = (overrides: Partial<ExportEnvelope> = {}): ExportEnvelope => ({
  format: "fg-input-translator",
  version: 1,
  customGames: [],
  tabs: [
    { gameId: "street-fighter", tab: { name: "Ryu", rows: [row("236P")] } },
    { gameId: "guilty-gear", tab: { name: "Sol", rows: [row("5P"), row("2K")] } },
  ],
  definitions: {},
  ...overrides,
});

const existing = (): Workspace => ({
  ...emptyWorkspace(),
  selectedGame: "guilty-gear",
  customLayers: { "street-fighter": [saved("street-fighter", "lp", "My Jab")] },
  games: {
    "street-fighter": {
      activeTab: "tab-1",
      tabs: [{ id: "tab-1", name: "Ryu", rows: [row("5K")] }],
    },
  },
});

describe("applyImport tabs", () => {
  it("adds each tab to its game with a fresh id and a unique name, and selects the first imported tab", () => {
    const before = existing();

    const { workspace, report } = applyImport(before, envelope(), known, { replace: [] });

    expect(workspace.games["street-fighter"]!.tabs.map((t) => [t.id, t.name])).toEqual([
      ["tab-1", "Ryu"],
      ["tab-2", "Ryu (2)"],
    ]);
    expect(workspace.games["street-fighter"]!.tabs[1]!.rows).toEqual([row("236P")]);
    expect(workspace.games["guilty-gear"]!.tabs.map((t) => [t.id, t.name])).toEqual([["tab-1", "Sol"]]);
    expect(workspace.games["street-fighter"]!.activeTab).toBe("tab-2");
    expect(workspace.selectedGame).toBe("street-fighter");
    expect(report).toMatchObject({ tabsAdded: 2, skippedGames: [] });
    expect(before).toEqual(existing());
  });

  it("keeps names unique across several imported tabs with the same name", () => {
    const twice = envelope({
      tabs: [
        { gameId: "guilty-gear", tab: { name: "Combos", rows: [] } },
        { gameId: "guilty-gear", tab: { name: "Combos", rows: [] } },
      ],
    });

    const { workspace } = applyImport(emptyWorkspace(), twice, known, { replace: [] });

    expect(workspace.games["guilty-gear"]!.tabs.map((t) => t.name)).toEqual(["Combos", "Combos (2)"]);
  });

  it("skips tabs and definitions of games this version does not have, and says which", () => {
    const unknownGame = envelope({
      tabs: [
        { gameId: "vanished-game", tab: { name: "Old", rows: [row("A")] } },
        { gameId: "guilty-gear", tab: { name: "Sol", rows: [] } },
      ],
      definitions: { "vanished-game": [saved("vanished-game", "x", "X")] },
    });

    const { workspace, report } = applyImport(emptyWorkspace(), unknownGame, known, { replace: [] });

    expect(Object.keys(workspace.games)).toEqual(["guilty-gear"]);
    expect(workspace.customLayers).toEqual({});
    expect(report).toMatchObject({ tabsAdded: 1, skippedGames: ["vanished-game"] });
  });
});

describe("saved definitions on import", () => {
  const incoming = () =>
    envelope({
      tabs: [],
      definitions: {
        "street-fighter": [saved("street-fighter", "lp", "Their Jab"), saved("street-fighter", "mp", "Their Mid")],
      },
    });

  it("previews which definitions are new and which clash with yours", () => {
    const plan = planImport(existing(), incoming(), known);

    expect(plan.definitions.map((d) => [d.definition.name, d.status])).toEqual([
      ["Their Jab", "conflict"],
      ["Their Mid", "new"],
    ]);
  });

  it("keeps your definition on a clash unless you choose to replace it", () => {
    const kept = applyImport(existing(), incoming(), known, { replace: [] });

    expect(kept.workspace.customLayers["street-fighter"]!.map((d) => d.name)).toEqual(["My Jab", "Their Mid"]);
    expect(kept.report).toMatchObject({ definitionsAdded: 1, definitionsReplaced: 0, definitionsKept: 1 });

    const replaced = applyImport(existing(), incoming(), known, {
      replace: ["street-fighter:custom.street-fighter.lp"],
    });

    expect(replaced.workspace.customLayers["street-fighter"]!.map((d) => d.name)).toEqual(["Their Jab", "Their Mid"]);
    expect(replaced.report).toMatchObject({ definitionsAdded: 1, definitionsReplaced: 1, definitionsKept: 0 });
  });

  it("treats aliases that differ only by spacing as the same text", () => {
    const spaced = envelope({
      tabs: [],
      definitions: { "street-fighter": [{ ...saved("street-fighter", "l p", "Spaced"), id: "custom.street-fighter.lp-2" }] },
    });

    expect(planImport(existing(), spaced, known).definitions[0]!.status).toBe("conflict");
  });
});

describe("custom games in an import", () => {
  const ryu: CustomGame = { id: "custom-ryu", name: "Ryu training", extends: "street-fighter" };
  const withRyu = (extra: Partial<ExportEnvelope> = {}): ExportEnvelope =>
    envelope({
      customGames: [ryu],
      tabs: [{ gameId: "custom-ryu", tab: { name: "Drills", rows: [row("lp")] } }],
      definitions: { "custom-ryu": [saved("custom-ryu", "lp", "Jab")] },
      ...extra,
    });

  it("previews the game that would be added, with its saved definitions as new", () => {
    const plan = planImport(existing(), withRyu(), known);

    expect(plan.games).toEqual([{ name: "Ryu training", status: "new" }]);
    expect(plan.tabs.map((t) => t.finalName)).toEqual(["Drills"]);
    expect(plan.definitions.map((d) => [d.definition.name, d.status])).toEqual([["Jab", "new"]]);
    expect(plan.blocked).toBeUndefined();
  });

  it("adds the game, its saved definitions and its tabs, and selects it", () => {
    const { workspace, report } = applyImport(existing(), withRyu(), known, { replace: [] });

    expect(workspace.customGames).toEqual([{ id: "custom-ryu-training", name: "Ryu training", extends: "street-fighter" }]);
    expect(workspace.customLayers["custom-ryu-training"]!.map((d) => d.name)).toEqual(["Jab"]);
    expect(workspace.games["custom-ryu-training"]!.tabs.map((t) => t.name)).toEqual(["Drills"]);
    expect(workspace.selectedGame).toBe("custom-ryu-training");
    expect(report).toMatchObject({ tabsAdded: 1, gamesAdded: 1, definitionsAdded: 1, skippedGames: [] });
  });

  it("reuses an identical game you already have and adds only the tabs", () => {
    const first = applyImport(existing(), withRyu(), known, { replace: [] }).workspace;

    const plan = planImport(first, withRyu(), known);
    const again = applyImport(first, withRyu(), known, { replace: [] });

    expect(plan.games).toEqual([{ name: "Ryu training", status: "reuse" }]);
    expect(plan.definitions).toEqual([]);
    expect(again.workspace.customGames).toHaveLength(1);
    expect(again.workspace.games["custom-ryu-training"]!.tabs.map((t) => t.name)).toEqual(["Drills", "Drills (2)"]);
    expect(again.report).toMatchObject({ gamesAdded: 0, definitionsAdded: 0 });
  });

  it("changes nothing and says why when a game is based on one that does not exist", () => {
    const broken = withRyu({ customGames: [{ id: "custom-ryu", name: "Ryu training", extends: "vanished" }] });
    const before = existing();

    expect(planImport(before, broken, known).blocked).toMatch(/vanished/);
    const result = applyImport(before, broken, known, { replace: [] });
    expect(result.workspace).toBe(before);
    expect(result.report).toMatchObject({ tabsAdded: 0, gamesAdded: 0, blocked: expect.stringMatching(/vanished/) });
  });
});
