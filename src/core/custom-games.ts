import type { Game, GameRegistry } from "./games";
import { DEFAULT_GAME } from "./workspace";
import type { Workspace } from "./workspace";

/** The built-in games plus the user's, in one registry that `resolveGame` can walk. */
export function effectiveRegistry(registry: GameRegistry, workspace: Workspace): GameRegistry {
  const custom: Game[] = workspace.customGames.map((game) => ({
    id: game.id,
    name: game.name,
    ...(game.extends !== undefined ? { extends: game.extends } : {}),
    definitions: [],
  }));
  return { base: registry.base, games: [...registry.games, ...custom] };
}

export type CreateGameResult =
  | { ok: true; workspace: Workspace; gameId: string }
  | { ok: false; reason: "empty-name" | "unknown-parent" };

// Digits and Latin letters only; a name with none (e.g. Japanese) falls back to "game".
export const slug = (name: string) => {
  const text = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return text === "" ? "game" : text;
};

export function createGame(
  workspace: Workspace,
  registry: GameRegistry,
  options: { name: string; extends?: string },
): CreateGameResult {
  const name = options.name.trim();
  if (name === "") return { ok: false, reason: "empty-name" };

  const all = effectiveRegistry(registry, workspace);
  if (options.extends !== undefined && !all.games.some((game) => game.id === options.extends)) {
    return { ok: false, reason: "unknown-parent" };
  }

  const used = new Set(all.games.map((game) => game.id));
  const base = `custom-${slug(name)}`;
  let gameId = base;
  for (let n = 2; used.has(gameId); n += 1) gameId = `${base}-${n}`;

  return {
    ok: true,
    gameId,
    workspace: {
      ...workspace,
      selectedGame: gameId,
      customGames: [
        ...workspace.customGames,
        { id: gameId, name, ...(options.extends !== undefined ? { extends: options.extends } : {}) },
      ],
    },
  };
}

const withoutKey = <T>(record: Record<string, T>, key: string): Record<string, T> => {
  const { [key]: _removed, ...rest } = record;
  return rest;
};

/** Rename one of the user's games; empty names, built-in games and unknown ids change nothing. */
export function renameGame(workspace: Workspace, gameId: string, name: string): Workspace {
  const trimmed = name.trim();
  if (trimmed === "" || !workspace.customGames.some((game) => game.id === gameId)) return workspace;
  return {
    ...workspace,
    customGames: workspace.customGames.map((game) => (game.id === gameId ? { ...game, name: trimmed } : game)),
  };
}

export type SetParentResult =
  | { ok: true; workspace: Workspace }
  | { ok: false; reason: "unknown-game" | "unknown-parent" | "cycle" };

/** Change what a custom game is based on (or clear it); a game cannot end up based on itself. */
export function setParent(
  workspace: Workspace,
  registry: GameRegistry,
  gameId: string,
  parentId: string | undefined,
): SetParentResult {
  if (!workspace.customGames.some((game) => game.id === gameId)) return { ok: false, reason: "unknown-game" };

  const all = effectiveRegistry(registry, workspace);
  if (parentId !== undefined) {
    if (!all.games.some((game) => game.id === parentId)) return { ok: false, reason: "unknown-parent" };
    // Walk up from the new parent: meeting this game means the chain would loop.
    for (let id: string | undefined = parentId; id !== undefined; id = all.games.find((g) => g.id === id)?.extends) {
      if (id === gameId) return { ok: false, reason: "cycle" };
    }
  }

  return {
    ok: true,
    workspace: {
      ...workspace,
      customGames: workspace.customGames.map((game) => {
        if (game.id !== gameId) return game;
        const { extends: _old, ...rest } = game;
        return parentId === undefined ? rest : { ...rest, extends: parentId };
      }),
    },
  };
}

export type DeleteGameResult =
  | { ok: true; workspace: Workspace }
  | { ok: false; reason: "unknown-game" }
  | { ok: false; reason: "has-children"; children: string[] };

/** Delete a custom game with its tabs and saved definitions; blocked while others are based on it. */
export function deleteGame(workspace: Workspace, gameId: string): DeleteGameResult {
  const game = workspace.customGames.find((g) => g.id === gameId);
  if (!game) return { ok: false, reason: "unknown-game" };

  const children = workspace.customGames.filter((g) => g.extends === gameId).map((g) => g.id);
  if (children.length > 0) return { ok: false, reason: "has-children", children };

  return {
    ok: true,
    workspace: {
      ...workspace,
      selectedGame: workspace.selectedGame === gameId ? (game.extends ?? DEFAULT_GAME) : workspace.selectedGame,
      customGames: workspace.customGames.filter((g) => g.id !== gameId),
      customLayers: withoutKey(workspace.customLayers, gameId),
      games: withoutKey(workspace.games, gameId),
    },
  };
}

/** The games a game may be based on: everything but itself and the games that are based on it. */
export function parentChoices(
  workspace: Workspace,
  registry: GameRegistry,
  gameId: string | undefined,
): { id: string; name: string }[] {
  const all = effectiveRegistry(registry, workspace).games;
  const basedOnIt = (id: string): boolean => {
    for (let at: string | undefined = id; at !== undefined; at = all.find((g) => g.id === at)?.extends) {
      if (at === gameId) return true;
    }
    return false;
  };
  return all.filter((g) => gameId === undefined || !basedOnIt(g.id)).map((g) => ({ id: g.id, name: g.name }));
}
