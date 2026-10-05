import type { Row } from "./row";
import type { GameWorkspace, Tab, Workspace } from "./workspace";

const nextTabId = (tabs: Tab[]) => {
  const used = tabs.map((tab) => /^tab-(\d+)$/.exec(tab.id)?.[1]).map(Number).filter((n) => n > 0);
  return `tab-${Math.max(0, ...used) + 1}`;
};

/** Append a tab to a game and select it. */
export function addTab(
  workspace: Workspace,
  gameId: string,
  name = "Untitled",
): { workspace: Workspace; tabId: string } {
  const game: GameWorkspace = workspace.games[gameId] ?? { activeTab: "", tabs: [] };
  const tabId = nextTabId(game.tabs);
  const updated: GameWorkspace = {
    activeTab: tabId,
    tabs: [...game.tabs, { id: tabId, name, rows: [] }],
  };
  return { workspace: { ...workspace, games: { ...workspace.games, [gameId]: updated } }, tabId };
}

/** Apply a change to one game; unchanged or unknown games return the workspace itself. */
function updateGame(
  workspace: Workspace,
  gameId: string,
  change: (game: GameWorkspace) => GameWorkspace | undefined,
): Workspace {
  const game = workspace.games[gameId];
  const changed = game && change(game);
  if (!game || !changed || changed === game) return workspace;
  return { ...workspace, games: { ...workspace.games, [gameId]: changed } };
}

export function renameTab(workspace: Workspace, gameId: string, tabId: string, name: string): Workspace {
  const trimmed = name.trim();
  if (trimmed === "") return workspace;
  return updateGame(workspace, gameId, (game) =>
    game.tabs.some((t) => t.id === tabId)
      ? { ...game, tabs: game.tabs.map((t) => (t.id === tabId ? { ...t, name: trimmed } : t)) }
      : undefined,
  );
}

export function selectTab(workspace: Workspace, gameId: string, tabId: string): Workspace {
  return updateGame(workspace, gameId, (game) =>
    game.tabs.some((t) => t.id === tabId) ? { ...game, activeTab: tabId } : undefined,
  );
}

/** Delete a tab; a game is never left without one, so the last deletion leaves a fresh 'Scratch'. */
export function deleteTab(workspace: Workspace, gameId: string, tabId: string): Workspace {
  return updateGame(workspace, gameId, (game) => {
    const index = game.tabs.findIndex((t) => t.id === tabId);
    if (index === -1) return undefined;

    const tabs = game.tabs.filter((t) => t.id !== tabId);
    if (tabs.length === 0) {
      return { activeTab: "tab-1", tabs: [{ id: "tab-1", name: "Scratch", rows: [] }] };
    }
    const activeTab =
      game.activeTab === tabId ? tabs[Math.min(index, tabs.length - 1)]!.id : game.activeTab;
    return { activeTab, tabs };
  });
}

const clamp = (index: number, length: number) => Math.max(0, Math.min(index, length - 1));

/** Move the item at `from` to position `to` (clamped); undefined when `from` is out of range. */
function moved<T>(items: T[], from: number, to: number): T[] | undefined {
  if (!Number.isInteger(from) || from < 0 || from >= items.length) return undefined;
  const rest = items.filter((_, i) => i !== from);
  rest.splice(clamp(to, items.length), 0, items[from]!);
  return rest;
}

export function moveTab(workspace: Workspace, gameId: string, tabId: string, toIndex: number): Workspace {
  return updateGame(workspace, gameId, (game) => {
    const tabs = moved(game.tabs, game.tabs.findIndex((t) => t.id === tabId), toIndex);
    return tabs && { ...game, tabs };
  });
}

/** Apply a change to the rows of one tab; unknown games or tabs, or an undefined result, change nothing. */
function updateRows(
  workspace: Workspace,
  gameId: string,
  tabId: string,
  change: (rows: Row[]) => Row[] | undefined,
): Workspace {
  return updateGame(workspace, gameId, (game) => {
    const tab = game.tabs.find((t) => t.id === tabId);
    const rows = tab && change(tab.rows);
    return tab && rows ? { ...game, tabs: game.tabs.map((t) => (t === tab ? { ...t, rows } : t)) } : undefined;
  });
}

const blankRow = (): Row => ({ notation: "", customizations: [] });
const inRange = (index: number, rows: Row[]) => Number.isInteger(index) && index >= 0 && index < rows.length;

/** Add a row (blank by default) at the end, or at `atIndex`. */
export function addRow(
  workspace: Workspace,
  gameId: string,
  tabId: string,
  row: Row = blankRow(),
  atIndex?: number,
): Workspace {
  return updateRows(workspace, gameId, tabId, (rows) => {
    const at = atIndex === undefined ? rows.length : Math.max(0, Math.min(atIndex, rows.length));
    return [...rows.slice(0, at), row, ...rows.slice(at)];
  });
}

export function updateRow(workspace: Workspace, gameId: string, tabId: string, index: number, row: Row): Workspace {
  return updateRows(workspace, gameId, tabId, (rows) =>
    inRange(index, rows) ? rows.map((r, i) => (i === index ? row : r)) : undefined,
  );
}

export function deleteRow(workspace: Workspace, gameId: string, tabId: string, index: number): Workspace {
  return updateRows(workspace, gameId, tabId, (rows) =>
    inRange(index, rows) ? rows.filter((_, i) => i !== index) : undefined,
  );
}

export function moveRow(workspace: Workspace, gameId: string, tabId: string, from: number, to: number): Workspace {
  return updateRows(workspace, gameId, tabId, (rows) => moved(rows, from, to));
}

/** Insert a deep copy of a row right after the original. */
export function duplicateRow(workspace: Workspace, gameId: string, tabId: string, index: number): Workspace {
  return updateRows(workspace, gameId, tabId, (rows) =>
    inRange(index, rows)
      ? [...rows.slice(0, index + 1), structuredClone(rows[index]!), ...rows.slice(index + 1)]
      : undefined,
  );
}

export function clearTab(workspace: Workspace, gameId: string, tabId: string): Workspace {
  return updateRows(workspace, gameId, tabId, (rows) => (rows.length === 0 ? undefined : []));
}
