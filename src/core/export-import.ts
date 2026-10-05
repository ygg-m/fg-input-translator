import type { ExportEnvelope } from "./export";
import { mergeGames } from "./game-bundle";
import { addTab } from "./tabs";
import type { TokenDefinition } from "./types";
import type { Workspace } from "./workspace";

const normalized = (alias: string) => alias.replace(/\s+/g, "");

export interface ImportChoices {
  /** Keys ("gameId:definitionId") of clashing incoming definitions to use instead of yours. */
  replace: string[];
}

export interface ImportPlan {
  /** `gameId` is the id in the file; a custom game may end up with another id here. */
  tabs: { gameId: string; name: string; rows: number; finalName: string }[];
  definitions: { gameId: string; definition: TokenDefinition; status: "new" | "conflict" }[];
  /** The custom games in the file: added as new, or already here (identical) and reused. */
  games: { name: string; status: "new" | "reuse" }[];
  /** Games in the file that this version does not have; their tabs and definitions are left out. */
  skippedGames: string[];
  /** Set when the file cannot be imported at all, and why. */
  blocked?: string;
}

export interface ImportReport {
  tabsAdded: number;
  gamesAdded: number;
  definitionsAdded: number;
  definitionsReplaced: number;
  definitionsKept: number;
  skippedGames: string[];
  blocked?: string;
}

export const definitionKey = (gameId: string, definition: TokenDefinition) => `${gameId}:${definition.id}`;

/** Existing saved definitions that an incoming one would clash with: same id, or any alias in common. */
const clashes = (layer: TokenDefinition[], incoming: TokenDefinition) => {
  const aliases = new Set(incoming.aliases.map(normalized));
  return layer.filter((d) => d.id === incoming.id || d.aliases.some((a) => aliases.has(normalized(a))));
};

/** A tab name that does not repeat one already in the game, adding " (2)", " (3)" ... as needed. */
const uniqueName = (name: string, taken: Set<string>) => {
  let candidate = name;
  for (let n = 2; taken.has(candidate); n += 1) candidate = `${name} (${n})`;
  taken.add(candidate);
  return candidate;
};

const blockedMessage = (merged: { reason: string; gameId: string; parent?: string }) =>
  merged.reason === "unknown-parent"
    ? `The game "${merged.gameId}" is based on "${merged.parent}", which is not in this file or in this app.`
    : `The games in this file are based on each other in a loop (at "${merged.gameId}").`;

const blockedPlan = (blocked: string): ImportPlan => ({
  tabs: [],
  definitions: [],
  games: [],
  skippedGames: [],
  blocked,
});

/** What importing would do, so the dialog can show it before anything changes. */
export function planImport(workspace: Workspace, envelope: ExportEnvelope, knownGameIds: string[]): ImportPlan {
  const merged = mergeGames(workspace, envelope.customGames, envelope.definitions, knownGameIds);
  if (!merged.ok) return blockedPlan(blockedMessage(merged as never));

  const fileGameIds = new Set(envelope.customGames.map((g) => g.id));
  const known = new Set([...knownGameIds, ...fileGameIds]);
  const target = (gameId: string) => merged.idMap[gameId] ?? gameId;
  const isNew = (gameId: string) => merged.added.includes(target(gameId));
  const skippedGames = new Set<string>();
  const taken = new Map<string, Set<string>>();

  const tabs: ImportPlan["tabs"] = [];
  for (const { gameId, tab } of envelope.tabs) {
    if (!known.has(gameId)) {
      skippedGames.add(gameId);
      continue;
    }
    const into = target(gameId);
    const names = taken.get(into) ?? new Set((merged.workspace.games[into]?.tabs ?? []).map((t) => t.name));
    taken.set(into, names);
    tabs.push({ gameId, name: tab.name, rows: tab.rows.length, finalName: uniqueName(tab.name, names) });
  }

  const definitions: ImportPlan["definitions"] = [];
  for (const [gameId, layer] of Object.entries(envelope.definitions)) {
    if (!known.has(gameId)) {
      skippedGames.add(gameId);
      continue;
    }
    if (fileGameIds.has(gameId)) {
      // A custom game's saved definitions travel with the game: new ones are all new, a reused game adds none.
      if (isNew(gameId)) for (const definition of layer) definitions.push({ gameId, definition, status: "new" });
      continue;
    }
    const existing = workspace.customLayers[gameId] ?? [];
    for (const definition of layer) {
      definitions.push({ gameId, definition, status: clashes(existing, definition).length > 0 ? "conflict" : "new" });
    }
  }

  const games = envelope.customGames.map((g) => ({ name: g.name, status: (isNew(g.id) ? "new" : "reuse") as "new" | "reuse" }));
  return { tabs, definitions, games, skippedGames: [...skippedGames] };
}

/** Add the file's games, tabs and saved definitions; nothing of yours is deleted except clashes you chose to replace. */
export function applyImport(
  workspace: Workspace,
  envelope: ExportEnvelope,
  knownGameIds: string[],
  choices: ImportChoices,
): { workspace: Workspace; report: ImportReport } {
  const plan = planImport(workspace, envelope, knownGameIds);
  const report: ImportReport = {
    tabsAdded: plan.tabs.length,
    gamesAdded: 0,
    definitionsAdded: 0,
    definitionsReplaced: 0,
    definitionsKept: 0,
    skippedGames: plan.skippedGames,
  };
  if (plan.blocked) {
    return { workspace, report: { ...report, tabsAdded: 0, skippedGames: [], blocked: plan.blocked } };
  }

  const merged = mergeGames(workspace, envelope.customGames, envelope.definitions, knownGameIds);
  if (!merged.ok) return { workspace, report: { ...report, tabsAdded: 0, blocked: blockedMessage(merged as never) } };
  report.gamesAdded = merged.added.length;

  const fileGameIds = new Set(envelope.customGames.map((g) => g.id));
  const known = new Set([...knownGameIds, ...fileGameIds]);
  const target = (gameId: string) => merged.idMap[gameId] ?? gameId;

  let next = merged.workspace;
  const firstImported = new Map<string, string>();
  const importable = envelope.tabs.filter(({ gameId }) => known.has(gameId));
  importable.forEach(({ gameId, tab }, index) => {
    const into = target(gameId);
    const added = addTab(next, into, plan.tabs[index]!.finalName);
    const game = added.workspace.games[into]!;
    next = {
      ...added.workspace,
      games: {
        ...added.workspace.games,
        [into]: { ...game, tabs: game.tabs.map((t) => (t.id === added.tabId ? { ...t, rows: tab.rows } : t)) },
      },
    };
    if (!firstImported.has(into)) firstImported.set(into, added.tabId);
  });
  for (const [gameId, tabId] of firstImported) {
    next = { ...next, games: { ...next.games, [gameId]: { ...next.games[gameId]!, activeTab: tabId } } };
  }
  if (importable.length > 0) next = { ...next, selectedGame: target(importable[0]!.gameId) };

  const layers = { ...next.customLayers };
  for (const { gameId, definition, status } of plan.definitions) {
    if (fileGameIds.has(gameId)) {
      report.definitionsAdded += 1; // already placed with its new game
      continue;
    }
    let layer = layers[gameId] ?? [];
    if (status === "conflict") {
      if (!choices.replace.includes(definitionKey(gameId, definition))) {
        report.definitionsKept += 1;
        continue;
      }
      const clashing = new Set(clashes(layer, definition));
      layer = layer.filter((d) => !clashing.has(d));
      report.definitionsReplaced += 1;
    } else {
      report.definitionsAdded += 1;
    }
    layers[gameId] = [...layer, definition];
  }

  return { workspace: { ...next, customLayers: layers }, report };
}
