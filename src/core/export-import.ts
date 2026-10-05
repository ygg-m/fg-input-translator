import type { ExportEnvelope } from "./export";
import type { Workspace } from "./workspace";
import { addTab } from "./tabs";
import type { TokenDefinition } from "./types";

const normalized = (alias: string) => alias.replace(/\s+/g, "");

export interface ImportChoices {
  /** Keys ("gameId:definitionId") of clashing incoming definitions to use instead of yours. */
  replace: string[];
}

export interface ImportPlan {
  tabs: { gameId: string; name: string; rows: number; finalName: string }[];
  definitions: { gameId: string; definition: TokenDefinition; status: "new" | "conflict" }[];
  /** Games in the file that this version does not have; their tabs and definitions are left out. */
  skippedGames: string[];
}

export interface ImportReport {
  tabsAdded: number;
  definitionsAdded: number;
  definitionsReplaced: number;
  definitionsKept: number;
  skippedGames: string[];
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

/** What importing would do, so the dialog can show it before anything changes. */
export function planImport(workspace: Workspace, envelope: ExportEnvelope, knownGameIds: string[]): ImportPlan {
  const known = new Set(knownGameIds);
  const skippedGames = new Set<string>();
  const taken = new Map<string, Set<string>>();

  const tabs: ImportPlan["tabs"] = [];
  for (const { gameId, tab } of envelope.tabs) {
    if (!known.has(gameId)) {
      skippedGames.add(gameId);
      continue;
    }
    const names = taken.get(gameId) ?? new Set((workspace.games[gameId]?.tabs ?? []).map((t) => t.name));
    taken.set(gameId, names);
    tabs.push({ gameId, name: tab.name, rows: tab.rows.length, finalName: uniqueName(tab.name, names) });
  }

  const definitions: ImportPlan["definitions"] = [];
  for (const [gameId, layer] of Object.entries(envelope.definitions)) {
    if (!known.has(gameId)) {
      skippedGames.add(gameId);
      continue;
    }
    const existing = workspace.customLayers[gameId] ?? [];
    for (const definition of layer) {
      definitions.push({ gameId, definition, status: clashes(existing, definition).length > 0 ? "conflict" : "new" });
    }
  }

  return { tabs, definitions, skippedGames: [...skippedGames] };
}

/** Add the file's tabs and saved definitions; nothing of yours is deleted except clashes you chose to replace. */
export function applyImport(
  workspace: Workspace,
  envelope: ExportEnvelope,
  knownGameIds: string[],
  choices: ImportChoices,
): { workspace: Workspace; report: ImportReport } {
  const plan = planImport(workspace, envelope, knownGameIds);

  let next = workspace;
  const firstImported = new Map<string, string>();
  const known = new Set(knownGameIds);
  const importable = envelope.tabs.filter(({ gameId }) => known.has(gameId));
  importable.forEach(({ gameId, tab }, index) => {
    const added = addTab(next, gameId, plan.tabs[index]!.finalName);
    const game = added.workspace.games[gameId]!;
    next = {
      ...added.workspace,
      games: {
        ...added.workspace.games,
        [gameId]: { ...game, tabs: game.tabs.map((t) => (t.id === added.tabId ? { ...t, rows: tab.rows } : t)) },
      },
    };
    if (!firstImported.has(gameId)) firstImported.set(gameId, added.tabId);
  });
  for (const [gameId, tabId] of firstImported) {
    next = { ...next, games: { ...next.games, [gameId]: { ...next.games[gameId]!, activeTab: tabId } } };
  }
  if (importable.length > 0) next = { ...next, selectedGame: importable[0]!.gameId };

  const layers = { ...next.customLayers };
  const report: ImportReport = {
    tabsAdded: plan.tabs.length,
    definitionsAdded: 0,
    definitionsReplaced: 0,
    definitionsKept: 0,
    skippedGames: plan.skippedGames,
  };
  for (const { gameId, definition, status } of plan.definitions) {
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
