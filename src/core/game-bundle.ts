import { slug } from "./custom-games";
import type { TokenDefinition } from "./types";
import type { CustomGame, Workspace } from "./workspace";

/** A custom game's custom ancestors and the game itself, ancestors first (empty for any other game). */
export function customAncestry(games: CustomGame[], gameId: string): CustomGame[] {
  const chain: CustomGame[] = [];
  const seen = new Set<string>();
  for (let id: string | undefined = gameId; id !== undefined && !seen.has(id); ) {
    seen.add(id);
    const game = games.find((g) => g.id === id);
    if (!game) break;
    chain.unshift(game);
    id = game.extends;
  }
  return chain;
}

export type MergeGamesResult =
  | { ok: true; workspace: Workspace; idMap: Record<string, string>; added: string[] }
  | { ok: false; reason: "unknown-parent"; gameId: string; parent: string }
  | { ok: false; reason: "cycle"; gameId: string };

// Ids inside saved definitions mention the game they were saved for, so they are left out.
const content = (definitions: TokenDefinition[]) =>
  JSON.stringify(definitions.map(({ id: _id, ...rest }) => rest));

/**
 * Bring games from outside (a link or a file) into the workspace. A game you already have that is
 * identical is reused; anything else is added as a new game with its own id and, if the name is
 * taken, a distinct name. `idMap` says where each incoming game ended up.
 */
export function mergeGames(
  workspace: Workspace,
  incoming: CustomGame[],
  layers: Record<string, TokenDefinition[]>,
  builtInIds: string[],
): MergeGamesResult {
  const idMap: Record<string, string> = {};
  const added: string[] = [];
  let customGames = [...workspace.customGames];
  const customLayers = { ...workspace.customLayers };
  const taken = new Set([...builtInIds, ...customGames.map((g) => g.id)]);

  // Parents first, so a child can be pointed at its parent's final id.
  const pending = [...incoming];
  while (pending.length > 0) {
    const index = pending.findIndex((g) => g.extends === undefined || !pending.some((p) => p.id === g.extends));
    if (index === -1) return { ok: false, reason: "cycle", gameId: pending[0]!.id };
    const game = pending.splice(index, 1)[0]!;

    const parent = game.extends === undefined ? undefined : (idMap[game.extends] ?? game.extends);
    if (parent !== undefined && !taken.has(parent)) {
      return { ok: false, reason: "unknown-parent", gameId: game.id, parent };
    }

    const layer = layers[game.id] ?? [];
    const same = customGames.find(
      (g) => g.name === game.name && g.extends === parent && content(customLayers[g.id] ?? []) === content(layer),
    );
    if (same) {
      idMap[game.id] = same.id;
      continue;
    }

    let name = game.name;
    for (let n = 2; customGames.some((g) => g.name === name); n += 1) name = `${game.name} (${n})`;
    const base = `custom-${slug(name)}`;
    let id = base;
    for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`;

    taken.add(id);
    idMap[game.id] = id;
    added.push(id);
    customGames = [...customGames, { id, name, ...(parent !== undefined ? { extends: parent } : {}) }];
    if (layer.length > 0) customLayers[id] = layer;
  }

  return { ok: true, workspace: { ...workspace, customGames, customLayers }, idMap, added };
}
