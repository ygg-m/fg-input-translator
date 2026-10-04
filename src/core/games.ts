import type { TokenDefinition } from "./types";

export interface Game {
  id: string;
  name: string;
  extends?: string;
  definitions: TokenDefinition[];
}

export interface GameRegistry {
  base: TokenDefinition[];
  games: Game[];
}

export interface DuplicateAliasError {
  code: "duplicate-alias";
  alias: string;
  definitionIds: string[];
}

export interface EmptyAliasError {
  code: "empty-alias";
  definitionId: string;
}

export type LayerError = DuplicateAliasError | EmptyAliasError;

export type GameError =
  | { code: "unknown-game" | "extends-cycle"; gameId: string }
  | (LayerError & { gameId?: string });

// Notation is matched with whitespace removed, so aliases are stored the same way.
const normalizeAlias = (alias: string) => alias.replace(/\s+/g, "");

const normalizeDefinition = (definition: TokenDefinition): TokenDefinition => {
  const aliases = definition.aliases.map(normalizeAlias);
  return aliases.every((alias, i) => alias === definition.aliases[i])
    ? definition
    : { ...definition, aliases };
};

/** Problems inside one layer: empty aliases, or an alias claiming the same text twice. */
export function validateLayer(definitions: TokenDefinition[]): LayerError[] {
  const errors: LayerError[] = [];
  const owners = new Map<string, string[]>();

  for (const definition of definitions) {
    const aliases = definition.aliases.map(normalizeAlias);
    if (aliases.includes("")) errors.push({ code: "empty-alias", definitionId: definition.id });

    for (const alias of new Set(aliases)) {
      if (alias === "") continue;
      owners.set(alias, [...(owners.get(alias) ?? []), definition.id]);
    }
  }

  for (const [alias, definitionIds] of owners) {
    if (definitionIds.length > 1) errors.push({ code: "duplicate-alias", alias, definitionIds });
  }
  return errors;
}

export type ResolveResult =
  | { ok: true; definitions: TokenDefinition[] }
  | { ok: false; errors: GameError[] };

/** Saved Custom Token Definitions per Game id; each layer sits on top of its Game. */
export type CustomLayers = Record<string, TokenDefinition[]>;

export function resolveGame(
  gameId: string,
  registry: GameRegistry,
  customLayers: CustomLayers = {},
): ResolveResult {
  const layers: TokenDefinition[][] = [];
  const errors: GameError[] = [];
  const custom = (customLayers[gameId] ?? []).map(normalizeDefinition);
  if (custom.length > 0) {
    layers.push(custom);
    for (const error of validateLayer(custom)) errors.push({ ...error, gameId });
  }
  const visited = new Set<string>();
  let id: string | undefined = gameId;
  while (id !== undefined) {
    if (visited.has(id)) return { ok: false, errors: [{ code: "extends-cycle", gameId: id }] };
    visited.add(id);
    const game = registry.games.find((g) => g.id === id);
    if (!game) return { ok: false, errors: [{ code: "unknown-game", gameId: id }] };
    const definitions = game.definitions.map(normalizeDefinition);
    layers.push(definitions);
    for (const error of validateLayer(definitions)) errors.push({ ...error, gameId: game.id });
    id = game.extends;
  }
  const base = registry.base.map(normalizeDefinition);
  layers.push(base);
  errors.push(...validateLayer(base));
  if (errors.length > 0) return { ok: false, errors };

  // Most specific layer first; an alias claimed by a nearer layer is removed
  // from every layer behind it.
  // An ignoreCase alias claims every casing of its text.
  const claimed = new Set<string>();
  const claimedAnyCase = new Set<string>();
  const isClaimed = (alias: string) =>
    claimed.has(alias) || claimedAnyCase.has(alias.toLowerCase());
  const definitions: TokenDefinition[] = [];

  for (const layer of layers) {
    const layerClaims: { alias: string; anyCase: boolean }[] = [];
    for (const definition of layer) {
      const aliases = definition.aliases.filter((alias) => !isClaimed(alias));
      for (const alias of definition.aliases) {
        layerClaims.push({ alias, anyCase: definition.ignoreCase === true });
      }
      // Losing every alias retires the definition; alias-less ones (groups) stay.
      if (aliases.length === 0 && definition.aliases.length > 0) continue;
      definitions.push(
        aliases.length === definition.aliases.length ? definition : { ...definition, aliases },
      );
    }
    for (const { alias, anyCase } of layerClaims) {
      if (anyCase) claimedAnyCase.add(alias.toLowerCase());
      else claimed.add(alias);
    }
  }

  return { ok: true, definitions };
}
