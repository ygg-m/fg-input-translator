import type { CustomLayers } from "./games";
import type { TokenChanges } from "./row";
import type { TokenDefinition } from "./types";

const stripWhitespace = (text: string) => text.replace(/\s+/g, "");

/**
 * Save a customization as a Custom Token Definition for `text` in a Game's
 * Custom Layer. Saving the same text again replaces it. `base` may itself be a
 * custom definition; the result always points at the Pure one.
 */
export function saveAsDefinition(
  layers: CustomLayers,
  gameId: string,
  base: TokenDefinition,
  text: string,
  changes: TokenChanges,
  extraAliases: string[] = [],
): CustomLayers {
  const alias = stripWhitespace(text);
  const id = `custom.${gameId}.${alias}`;
  const aliases = [...new Set([alias, ...extraAliases.map(stripWhitespace)])];

  const saved: TokenDefinition = {
    ...base,
    ...changes,
    id,
    aliases,
    basedOn: base.basedOn ?? base.id,
    saved: true,
  };

  // Another saved definition cannot keep an alias this one now owns.
  const others = (layers[gameId] ?? [])
    .filter((d) => d.id !== id)
    .map((d) => ({ ...d, aliases: d.aliases.filter((a) => !aliases.includes(a)) }))
    .filter((d) => d.aliases.length > 0);

  return { ...layers, [gameId]: [...others, saved] };
}

export function deleteDefinition(layers: CustomLayers, gameId: string, id: string): CustomLayers {
  const remaining = (layers[gameId] ?? []).filter((d) => d.id !== id);
  const { [gameId]: _removed, ...rest } = layers;
  return remaining.length > 0 ? { ...rest, [gameId]: remaining } : rest;
}
