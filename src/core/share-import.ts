import { mergeGames } from "./game-bundle";
import type { SharedTab } from "./share";
import { addTab } from "./tabs";
import type { TokenDefinition } from "./types";
import type { Workspace } from "./workspace";

const normalized = (alias: string) => alias.replace(/\s+/g, "");

export type SharedImport =
  | {
      ok: true;
      workspace: Workspace;
      /** Where the tab went: the shared game, or the id its custom game was given here. */
      gameId: string;
      tabId: string;
      /** Shared saved definitions that were not added because you already save one for the same text. */
      skipped: TokenDefinition[];
      /** Ids of the shared definitions added to an existing game's saved definitions, so the import can be undone. */
      added: string[];
      /** Custom games that only this import created. */
      addedGames: string[];
      /** What to go back to when the import is discarded. `activeTab` is undefined if the game had no workspace. */
      previous: { selectedGame: string; activeTab: string | undefined };
    }
  | { ok: false; reason: "unknown-parent" | "cycle" | "unknown-game" };

/**
 * Add a shared tab and select it. A custom game it carries is added (or reused when you already have an
 * identical one). For a built-in game, its saved definitions are merged into yours, and yours win:
 * one that clashes with an alias you already save is skipped.
 */
export function importSharedTab(
  workspace: Workspace,
  shared: SharedTab,
  builtInIds: string[],
): SharedImport {
  const merged = mergeGames(workspace, shared.customGames, shared.definitions, builtInIds);
  if (!merged.ok) return { ok: false, reason: merged.reason };

  const gameId = merged.idMap[shared.gameId] ?? shared.gameId;
  if (!builtInIds.includes(gameId) && !merged.workspace.customGames.some((g) => g.id === gameId)) {
    return { ok: false, reason: "unknown-game" };
  }

  const added = addTab(merged.workspace, gameId, shared.tab.name);
  const game = added.workspace.games[gameId]!;
  const withRows = {
    ...game,
    tabs: game.tabs.map((t) => (t.id === added.tabId ? { ...t, rows: shared.tab.rows } : t)),
  };

  // A custom game brought its saved definitions with it; only a built-in game's layer is merged here.
  const layer = [...(merged.workspace.customLayers[gameId] ?? [])];
  const skipped: TokenDefinition[] = [];
  const addedIds: string[] = [];
  if (builtInIds.includes(gameId)) {
    const taken = new Set(layer.flatMap((d) => d.aliases.map(normalized)));
    for (const definition of shared.definitions[shared.gameId] ?? []) {
      const aliases = definition.aliases.map(normalized);
      if (aliases.some((alias) => taken.has(alias))) {
        skipped.push(definition);
        continue;
      }
      layer.push(definition);
      addedIds.push(definition.id);
      aliases.forEach((alias) => taken.add(alias));
    }
  }

  return {
    ok: true,
    gameId,
    workspace: {
      ...added.workspace,
      selectedGame: gameId,
      customLayers:
        layer.length > 0 ? { ...merged.workspace.customLayers, [gameId]: layer } : merged.workspace.customLayers,
      games: { ...added.workspace.games, [gameId]: withRows },
    },
    tabId: added.tabId,
    skipped,
    added: addedIds,
    addedGames: merged.added,
    previous: {
      selectedGame: workspace.selectedGame,
      activeTab: workspace.games[gameId]?.activeTab,
    },
  };
}

/**
 * Undo an import: remove the shared tab, the definitions it brought and any custom game it created,
 * restore the selection, and keep everything else the user has done since.
 */
export function discardSharedTab(
  workspace: Workspace,
  imported: Pick<Extract<SharedImport, { ok: true }>, "gameId" | "tabId" | "added" | "addedGames" | "previous">,
): Workspace {
  const { gameId } = imported;
  const nextGames = { ...workspace.games };
  const game = workspace.games[gameId];
  if (game) {
    const tabs = game.tabs.filter((t) => t.id !== imported.tabId);
    if (tabs.length === 0 && imported.previous.activeTab === undefined) delete nextGames[gameId];
    else {
      const remembered = tabs.find((t) => t.id === imported.previous.activeTab);
      nextGames[gameId] = { activeTab: (remembered ?? tabs[0])?.id ?? "", tabs };
    }
  }

  const nextLayers = { ...workspace.customLayers };
  const layer = (workspace.customLayers[gameId] ?? []).filter((d) => !imported.added.includes(d.id));
  if (layer.length > 0) nextLayers[gameId] = layer;
  else delete nextLayers[gameId];

  for (const added of imported.addedGames) {
    delete nextGames[added];
    delete nextLayers[added];
  }

  return {
    ...workspace,
    selectedGame: imported.previous.selectedGame,
    customGames: workspace.customGames.filter((g) => !imported.addedGames.includes(g.id)),
    games: nextGames,
    customLayers: nextLayers,
  };
}
