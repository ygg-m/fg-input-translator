import type { CustomLayers } from "./games";
import type { Row } from "./row";

export const DEFAULT_GAME = "guilty-gear";

export interface Tab {
  id: string;
  name: string;
  rows: Row[];
}

export interface GameWorkspace {
  activeTab: string;
  tabs: Tab[];
}

/** Everything the app remembers: what is persisted, shared and exported is built from this. */
export interface Workspace {
  version: 1;
  selectedGame: string;
  customLayers: CustomLayers;
  games: Record<string, GameWorkspace>;
}

export function emptyWorkspace(): Workspace {
  return { version: 1, selectedGame: DEFAULT_GAME, customLayers: {}, games: {} };
}

const blankRow = (): Row => ({ notation: "", customizations: [] });

const activeTabOf = (game: GameWorkspace | undefined) =>
  game?.tabs.find((tab) => tab.id === game.activeTab) ?? game?.tabs[0];

/** The Row shown for a game: the first of its active tab, or a blank one. */
export function getActiveRow(workspace: Workspace, gameId: string): Row {
  return activeTabOf(workspace.games[gameId])?.rows[0] ?? blankRow();
}

/** Store the Row shown for a game, creating a 'Scratch' tab the first time. */
export function setActiveRow(workspace: Workspace, gameId: string, row: Row): Workspace {
  const game = workspace.games[gameId];
  const active = activeTabOf(game);

  const updated: GameWorkspace =
    game && active
      ? {
          ...game,
          tabs: game.tabs.map((tab) =>
            tab === active ? { ...tab, rows: [row, ...tab.rows.slice(1)] } : tab,
          ),
        }
      : {
          activeTab: "tab-1",
          tabs: [...(game?.tabs ?? []), { id: "tab-1", name: "Scratch", rows: [row] }],
        };

  return { ...workspace, games: { ...workspace.games, [gameId]: updated } };
}
