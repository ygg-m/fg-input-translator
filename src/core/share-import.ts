import type { Row } from "./row";
import { addTab } from "./tabs";
import type { TokenDefinition } from "./types";
import type { Workspace } from "./workspace";

const normalized = (alias: string) => alias.replace(/\s+/g, "");

export interface ImportResult {
  workspace: Workspace;
  tabId: string;
  /** Shared saved definitions that were not added because you already save one for the same text. */
  skipped: TokenDefinition[];
  /** Ids of the shared definitions that were added, so the import can be undone. */
  added: string[];
  /** What to go back to when the import is discarded. `activeTab` is undefined if the game had no workspace. */
  previous: { selectedGame: string; activeTab: string | undefined };
}

/**
 * Add a shared tab to a game and select it. Its saved definitions are merged into the
 * game's Custom Layer, but yours win: one that clashes with an alias you already save is skipped.
 */
export function importSharedTab(
  workspace: Workspace,
  gameId: string,
  tab: { name: string; rows: Row[] },
  definitions: TokenDefinition[],
): ImportResult {
  const added = addTab(workspace, gameId, tab.name);
  const game = added.workspace.games[gameId]!;
  const withRows = {
    ...game,
    tabs: game.tabs.map((t) => (t.id === added.tabId ? { ...t, rows: tab.rows } : t)),
  };

  const layer = [...(workspace.customLayers[gameId] ?? [])];
  const taken = new Set(layer.flatMap((d) => d.aliases.map(normalized)));
  const skipped: TokenDefinition[] = [];
  const addedIds: string[] = [];
  for (const definition of definitions) {
    const aliases = definition.aliases.map(normalized);
    if (aliases.some((alias) => taken.has(alias))) {
      skipped.push(definition);
      continue;
    }
    layer.push(definition);
    addedIds.push(definition.id);
    aliases.forEach((alias) => taken.add(alias));
  }

  return {
    workspace: {
      ...added.workspace,
      selectedGame: gameId,
      customLayers: layer.length > 0 ? { ...workspace.customLayers, [gameId]: layer } : workspace.customLayers,
      games: { ...added.workspace.games, [gameId]: withRows },
    },
    tabId: added.tabId,
    skipped,
    added: addedIds,
    previous: {
      selectedGame: workspace.selectedGame,
      activeTab: workspace.games[gameId]?.activeTab,
    },
  };
}

/**
 * Undo an import: remove the shared tab and the definitions it brought, restore the
 * selection, and keep everything else the user has done since.
 */
export function discardSharedTab(
  workspace: Workspace,
  gameId: string,
  imported: Pick<ImportResult, "tabId" | "added" | "previous">,
): Workspace {
  const { games, customLayers } = workspace;
  const game = games[gameId];

  const nextGames = { ...games };
  if (game) {
    const tabs = game.tabs.filter((t) => t.id !== imported.tabId);
    if (tabs.length === 0 && imported.previous.activeTab === undefined) delete nextGames[gameId];
    else {
      const remembered = tabs.find((t) => t.id === imported.previous.activeTab);
      nextGames[gameId] = { activeTab: (remembered ?? tabs[0])?.id ?? "", tabs };
    }
  }

  const nextLayers = { ...customLayers };
  const layer = (customLayers[gameId] ?? []).filter((d) => !imported.added.includes(d.id));
  if (layer.length > 0) nextLayers[gameId] = layer;
  else delete nextLayers[gameId];

  return {
    ...workspace,
    selectedGame: imported.previous.selectedGame,
    games: nextGames,
    customLayers: nextLayers,
  };
}
