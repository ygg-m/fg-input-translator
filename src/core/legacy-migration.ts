import type { Row } from "./row";
import type { GameWorkspace, Tab, Workspace } from "./workspace";
import { DEFAULT_GAME, emptyWorkspace } from "./workspace";

/** The raw strings the legacy app left in localStorage (null or missing when absent). */
export interface LegacyData {
  rawInput?: string | null;
  gameName?: string | null;
  outputList?: string | null;
}

export interface MigrationReport {
  sessionRow: boolean;
  importedCombos: number;
  skipped: number;
  listUnreadable: boolean;
}

export interface MigrationResult {
  workspace: Workspace;
  report: MigrationReport;
}

const SESSION_TAB = "Last session";
const SAVED_TAB = "Saved combos";

// Legacy items are { Input, Game, Title }; anything else is damaged.
const readItems = (text: string): { items: unknown[] } | undefined => {
  try {
    const parsed: unknown = JSON.parse(text);
    return Array.isArray(parsed) ? { items: parsed } : undefined;
  } catch {
    return undefined;
  }
};

/** Convert what the old app stored into a Workspace; the old keys are left alone. */
export function migrateLegacy(
  data: LegacyData,
  games: { id: string; name: string }[],
): MigrationResult {
  const workspace = emptyWorkspace();
  const report: MigrationReport = { sessionRow: false, importedCombos: 0, skipped: 0, listUnreadable: false };
  const idOf = (name: string | null | undefined) => games.find((g) => g.name === name)?.id;

  // Tabs are added in the order they should appear, so ids count up per game.
  const addTab = (gameId: string, name: string, rows: Row[]) => {
    const game: GameWorkspace = (workspace.games[gameId] ??= { activeTab: "", tabs: [] });
    const existing = game.tabs.find((t) => t.name === name);
    if (existing) {
      existing.rows.push(...rows);
      return;
    }
    const tab: Tab = { id: `tab-${game.tabs.length + 1}`, name, rows };
    game.tabs.push(tab);
    if (game.activeTab === "") game.activeTab = tab.id;
  };
  const rowOf = (notation: string, title?: string): Row => ({
    notation,
    ...(title !== undefined && title !== notation ? { label: title } : {}),
    customizations: [],
  });

  const sessionGame = idOf(data.gameName) ?? DEFAULT_GAME;
  workspace.selectedGame = sessionGame;
  if (data.rawInput) {
    addTab(sessionGame, SESSION_TAB, [rowOf(data.rawInput)]);
    report.sessionRow = true;
  }

  if (data.outputList) {
    const list = readItems(data.outputList);
    if (!list) report.listUnreadable = true;
    else {
      for (const item of list.items) {
        const entry = item as { Input?: unknown; Game?: unknown; Title?: unknown } | null;
        if (typeof entry !== "object" || entry === null || typeof entry.Input !== "string") {
          report.skipped += 1;
          continue;
        }
        const title = typeof entry.Title === "string" ? entry.Title : undefined;
        const gameId = idOf(typeof entry.Game === "string" ? entry.Game : undefined);
        if (gameId) addTab(gameId, SAVED_TAB, [rowOf(entry.Input, title)]);
        else addTab(DEFAULT_GAME, `Imported: ${String(entry.Game)}`, [rowOf(entry.Input, title)]);
        report.importedCombos += 1;
      }
    }
  }

  return { workspace, report };
}
