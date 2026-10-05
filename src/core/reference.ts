import type { GameRegistry } from "./games";
import type { TokenDefinition } from "./types";

export interface ReferenceEntry {
  aliases: string[];
  name: string;
}

export interface ReferenceSection {
  title: string;
  entries: ReferenceEntry[];
}

// A group has no alias to type, so it is shown the way it is written: [...] or a+b.
function aliasesOf(definition: TokenDefinition): string[] {
  if (definition.aliases.length > 0) return definition.aliases;
  const group = definition.group;
  if (!group) return [];
  if ("separator" in group) return [`a${group.separator}b`];
  return [`${group.open}…${group.close}${group.param ? "N" : ""}`];
}

const entriesOf = (definitions: TokenDefinition[]): ReferenceEntry[] =>
  definitions
    .map((definition) => ({ aliases: aliasesOf(definition), name: definition.name }))
    .filter((entry) => entry.aliases.length > 0);

/** What the "All Inputs" dialog shows, built from the data so it can never go stale. */
export function buildReference(registry: GameRegistry): ReferenceSection[] {
  const sections: ReferenceSection[] = [
    { title: "Shared by every game", entries: entriesOf(registry.base) },
    ...registry.games.map((game) => ({ title: game.name, entries: entriesOf(game.definitions) })),
  ];
  return sections.filter((section) => section.entries.length > 0);
}
