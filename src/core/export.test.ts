import { describe, expect, it } from "vitest";
import { buildExport, defaultSelection } from "./export";
import type { GameRegistry } from "./games";
import type { Row } from "./row";
import type { TokenDefinition } from "./types";
import { emptyWorkspace } from "./workspace";
import type { Workspace } from "./workspace";

const row = (notation: string, label?: string): Row => ({
  notation,
  ...(label ? { label } : {}),
  customizations: [],
});

const saved = (gameId: string, alias: string, name: string): TokenDefinition => ({
  id: `custom.${gameId}.${alias}`,
  name,
  aliases: [alias],
  basedOn: "base.x",
  saved: true,
});

const workspace = (): Workspace => ({
  ...emptyWorkspace(),
  customLayers: {
    "street-fighter": [saved("street-fighter", "lp", "Jab"), saved("street-fighter", "mp", "Mid")],
    "guilty-gear": [saved("guilty-gear", "P", "Pistol")],
  },
  games: {
    "street-fighter": {
      activeTab: "tab-1",
      tabs: [
        { id: "tab-1", name: "Ryu", rows: [row("236P", "Fireball")] },
        { id: "tab-2", name: "Ken", rows: [row("623P")] },
      ],
    },
    "guilty-gear": {
      activeTab: "tab-1",
      tabs: [{ id: "tab-1", name: "Sol", rows: [row("5P")] }],
    },
  },
});

describe("buildExport", () => {
  it("contains exactly the selected tabs and saved definitions, in selection order", () => {
    const envelope = buildExport(workspace(), {
      tabs: [
        { gameId: "guilty-gear", tabId: "tab-1" },
        { gameId: "street-fighter", tabId: "tab-2" },
      ],
      definitions: [
        { gameId: "street-fighter", id: "custom.street-fighter.mp" },
        { gameId: "guilty-gear", id: "custom.guilty-gear.P" },
      ],
    });

    expect(envelope).toEqual({
      format: "fg-input-translator",
      version: 1,
      tabs: [
        { gameId: "guilty-gear", tab: { name: "Sol", rows: [row("5P")] } },
        { gameId: "street-fighter", tab: { name: "Ken", rows: [row("623P")] } },
      ],
      definitions: {
        "street-fighter": [saved("street-fighter", "mp", "Mid")],
        "guilty-gear": [saved("guilty-gear", "P", "Pistol")],
      },
    });
  });

  it("ignores selections that do not exist and leaves out games with nothing selected", () => {
    const envelope = buildExport(workspace(), {
      tabs: [
        { gameId: "street-fighter", tabId: "tab-9" },
        { gameId: "unknown-game", tabId: "tab-1" },
      ],
      definitions: [{ gameId: "street-fighter", id: "nope" }],
    });

    expect(envelope.tabs).toEqual([]);
    expect(envelope.definitions).toEqual({});
  });
});

describe("defaultSelection", () => {
  const punch: TokenDefinition = { id: "base.punch", name: "Punch", aliases: ["P"] };
  const kick: TokenDefinition = { id: "base.kick", name: "Kick", aliases: ["K"] };
  const registry: GameRegistry = {
    base: [punch, kick],
    games: [
      { id: "street-fighter", name: "SF", definitions: [] },
      { id: "guilty-gear", name: "GG", definitions: [] },
    ],
  };

  it("picks the game's tabs and only the saved definitions its rows use", () => {
    const base = workspace();
    const ws: Workspace = {
      ...base,
      customLayers: {
        "street-fighter": [
          { id: "custom.street-fighter.P", name: "Jab", aliases: ["P"], basedOn: "base.punch", saved: true },
          { id: "custom.street-fighter.K", name: "Unused", aliases: ["K"], basedOn: "base.kick", saved: true },
        ],
        "guilty-gear": base.customLayers["guilty-gear"]!,
      },
      games: {
        ...base.games,
        "street-fighter": {
          activeTab: "tab-1",
          tabs: [
            { id: "tab-1", name: "Ryu", rows: [row("P P")] },
            { id: "tab-2", name: "Ken", rows: [row("2")] },
          ],
        },
      },
    };

    expect(defaultSelection(ws, registry, "street-fighter")).toEqual({
      tabs: [
        { gameId: "street-fighter", tabId: "tab-1" },
        { gameId: "street-fighter", tabId: "tab-2" },
      ],
      definitions: [{ gameId: "street-fighter", id: "custom.street-fighter.P" }],
    });
  });

  it("is empty for a game with no tabs", () => {
    expect(defaultSelection(emptyWorkspace(), registry, "street-fighter")).toEqual({ tabs: [], definitions: [] });
  });
});
