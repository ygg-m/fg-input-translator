import { describe, expect, it } from "vitest";
import type { ExportEnvelope } from "./export";
import { applyImport, planImport } from "./export-import";
import type { Row } from "./row";
import type { TokenDefinition } from "./types";
import { emptyWorkspace } from "./workspace";
import type { Workspace } from "./workspace";

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
