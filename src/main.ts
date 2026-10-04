import "./style.css";
import { createAutosave } from "./core/autosave";
import { deleteDefinition, saveAsDefinition } from "./core/custom";
import { resolveGame } from "./core/games";
import { BACKUP_KEY, loadWorkspace, saveWorkspace } from "./core/persistence";
import type { StorageLike } from "./core/persistence";
import {
  anchorFor,
  customizeToken,
  findCustomization,
  reassignToken,
  resetToken,
  resolveRow,
} from "./core/row";
import type { Anchor, Row, TokenChanges } from "./core/row";
import {
  addRow,
  addTab,
  clearTab,
  deleteRow,
  deleteTab,
  duplicateRow,
  moveRow,
  moveTab,
  renameTab,
  selectTab,
  updateRow,
} from "./core/tabs";
import { toView } from "./core/view";
import type { ViewNode } from "./core/view";
import { DEFAULT_GAME } from "./core/workspace";
import type { Tab, Workspace } from "./core/workspace";
import { registry } from "./data/index";
import { createEditor } from "./ui/editor";
import { renderView } from "./ui/render";
import { renderSavedList } from "./ui/saved-list";
import { renderTabs } from "./ui/tabs-view";
import type { TabsHandlers, TabsView } from "./ui/tabs-view";

const EXAMPLE_NOTATION = "236P > 623K, 2 3 6 P";

// Vite turns each bundled SVG into a URL; definitions refer to them by file name.
const assetUrls = import.meta.glob("./assets/inputs/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const assets = (id: string) => assetUrls[`./assets/inputs/${id}.svg`];
const assetIds = Object.keys(assetUrls).map((path) => path.split("/").pop()!.replace(".svg", ""));

const gameSelect = document.querySelector<HTMLSelectElement>("#game")!;
const workspaceHost = document.querySelector<HTMLElement>("#workspace")!;
const status = document.querySelector<HTMLElement>("#status")!;
const savedSection = document.querySelector<HTMLElement>("#saved")!;
const notices = document.querySelector<HTMLElement>("#notices")!;

for (const game of registry.games) {
  const option = document.createElement("option");
  option.value = game.id;
  option.textContent = game.name;
  gameSelect.append(option);
}

// ---- persistence -------------------------------------------------------------
function openStorage(): StorageLike | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined; // some privacy modes throw just for touching it
  }
}
const browserStorage = openStorage();
const memoryOnly: StorageLike = (() => {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
})();
const storage = browserStorage ?? memoryOnly;

const loaded = loadWorkspace(
  storage,
  registry.games.map((game) => ({ id: game.id, name: game.name })),
);
if (!browserStorage) loaded.notices.push({ code: "storage-unavailable" });

let workspace = loaded.workspace;
let firstVisit = Object.keys(workspace.games).length === 0;
gameSelect.value = registry.games.some((game) => game.id === workspace.selectedGame)
  ? workspace.selectedGame
  : DEFAULT_GAME;

let saveFailure: string | undefined;

function renderNotices() {
  const messages: string[] = [];
  for (const notice of loaded.notices) {
    if (notice.code === "migrated") {
      const { importedCombos, skipped, sessionRow } = notice.report;
      messages.push(
        `Imported your data from the previous version: ${importedCombos} saved combo(s)` +
          (sessionRow ? " and your last notation" : "") +
          (skipped > 0 ? `, ${skipped} damaged entr${skipped === 1 ? "y" : "ies"} skipped` : "") +
          '. Look in the "Saved combos" and "Last session" tabs.',
      );
    } else if (notice.code === "unreadable") {
      messages.push(
        `Your saved data could not be read (${notice.message}). ` +
          (notice.backedUp ? `A copy was kept under "${BACKUP_KEY}". ` : "No backup copy could be made. ") +
          "The app started fresh.",
      );
    } else {
      messages.push("This browser is not letting the app save, so changes will be lost when you close the page.");
    }
  }
  if (saveFailure) {
    messages.push(`Could not save your changes (${saveFailure}). They will be lost if you close this page.`);
  }
  notices.replaceChildren(
    ...messages.map((text) => {
      const line = document.createElement("p");
      line.textContent = text;
      return line;
    }),
  );
}

const autosave = createAutosave(
  () => saveWorkspace(storage, workspace),
  (result) => {
    saveFailure = result.ok ? undefined : result.error;
    renderNotices();
  },
);
window.addEventListener("pagehide", () => autosave.flush());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") autosave.flush();
});
renderNotices();

// ---- workspace state ---------------------------------------------------------
const gameId = () => gameSelect.value;

/** Every game always shows at least one tab. */
function ensureGame() {
  const game = workspace.games[gameId()];
  if (game && game.tabs.length > 0) return;
  const created = addTab(workspace, gameId(), "Scratch");
  const row: Row | undefined = firstVisit ? { notation: EXAMPLE_NOTATION, customizations: [] } : undefined;
  workspace = addRow(created.workspace, gameId(), created.tabId, row);
  firstVisit = false;
}

function activeTab(): Tab {
  const game = workspace.games[gameId()]!;
  return game.tabs.find((tab) => tab.id === game.activeTab) ?? game.tabs[0]!;
}

/** Make a change to the workspace and remember it. */
function apply(next: Workspace) {
  workspace = { ...next, selectedGame: gameId() };
  autosave.notify();
}

function resolve(row: Row) {
  const game = resolveGame(gameId(), registry, workspace.customLayers);
  if (!game.ok) {
    return { ok: false as const, error: `Could not load this game: ${JSON.stringify(game.errors)}` };
  }
  return { ok: true as const, game, resolved: resolveRow(row, game.definitions) };
}

// ---- rendering -----------------------------------------------------------------
let view: TabsView;

function updateStatus() {
  const dropped = activeTab().rows.reduce((total, row) => {
    const result = resolve(row);
    return total + (result.ok ? result.resolved.dropped.length : 0);
  }, 0);
  status.textContent =
    dropped > 0 ? `${dropped} customization(s) no longer match their notation and are hidden.` : "";
}

function renderRowOutput(index: number, preview?: Row) {
  const target = view.outputs[index];
  const row = preview ?? activeTab().rows[index];
  if (!target || !row) return;

  const result = resolve(row);
  if (!result.ok) {
    target.textContent = result.error;
    return;
  }
  const { resolved } = result;
  target.replaceChildren(
    renderView(toView(resolved.nodes, resolved.definitions), document, assets, {
      onSelect: (node) => openEditor(index, node),
    }),
  );
}

function renderSaved() {
  const id = gameId();
  savedSection.replaceChildren(
    renderSavedList(document, workspace.customLayers[id] ?? [], (definitionId) => {
      apply({ ...workspace, customLayers: deleteDefinition(workspace.customLayers, id, definitionId) });
      renderAll();
    }),
  );
}

const handlers: TabsHandlers = {
  onSelectTab: (tabId) => {
    apply(selectTab(workspace, gameId(), tabId));
    renderAll();
  },
  onAddTab: () => {
    const created = addTab(workspace, gameId());
    apply(created.workspace);
    renderAll();
    view.startRename(created.tabId);
  },
  onRenameTab: (tabId, name) => {
    apply(renameTab(workspace, gameId(), tabId, name));
    renderAll();
  },
  onDeleteTab: (tabId) => {
    apply(deleteTab(workspace, gameId(), tabId));
    renderAll();
  },
  onMoveTab: (tabId, delta) => {
    const tabs = workspace.games[gameId()]!.tabs;
    apply(moveTab(workspace, gameId(), tabId, tabs.findIndex((tab) => tab.id === tabId) + delta));
    renderAll();
  },
  onNotationInput: (index, text) => {
    const row = activeTab().rows[index];
    if (!row) return;
    apply(updateRow(workspace, gameId(), activeTab().id, index, { ...row, notation: text }));
    renderRowOutput(index);
    updateStatus();
  },
  onLabelInput: (index, text) => {
    const row = activeTab().rows[index];
    if (!row) return;
    const { label: _previous, ...rest } = row;
    apply(updateRow(workspace, gameId(), activeTab().id, index, text === "" ? rest : { ...rest, label: text }));
  },
  onAddRow: () => {
    apply(addRow(workspace, gameId(), activeTab().id));
    renderAll();
    view.focusRow(activeTab().rows.length - 1);
  },
  onDuplicateRow: (index) => {
    apply(duplicateRow(workspace, gameId(), activeTab().id, index));
    renderAll();
  },
  onDeleteRow: (index) => {
    apply(deleteRow(workspace, gameId(), activeTab().id, index));
    renderAll();
  },
  onMoveRow: (index, delta) => {
    apply(moveRow(workspace, gameId(), activeTab().id, index, index + delta));
    renderAll();
  },
  onClearTab: () => {
    apply(clearTab(workspace, gameId(), activeTab().id));
    renderAll();
  },
  confirm: (message) => window.confirm(message),
};

function renderAll() {
  ensureGame();
  const game = workspace.games[gameId()]!;
  const tab = activeTab();

  view = renderTabs(
    document,
    {
      tabs: game.tabs.map(({ id, name }) => ({ id, name })),
      activeTab: tab.id,
      rows: tab.rows.map((row) => ({ notation: row.notation, label: row.label })),
    },
    handlers,
  );
  workspaceHost.replaceChildren(view.element);
  tab.rows.forEach((_, index) => renderRowOutput(index));
  updateStatus();
  renderSaved();
}

// ---- editing a token -------------------------------------------------------------
function openEditor(rowIndex: number, node: ViewNode) {
  const tab = activeTab();
  const row = tab.rows[rowIndex];
  if (!row) return;
  const result = resolve(row);
  if (!result.ok) return;
  const { game, resolved } = result;
  const id = gameId();

  const anchor: Anchor = anchorFor(resolved.nodes, node);
  const existing = findCustomization(row, anchor);
  const basedOn = existing?.basedOn ?? node.definitionId;

  // Dropping the preview and removing the dialog happens here directly for the buttons;
  // the close event covers Escape. Whichever runs first does the work once.
  const cleanup = () => {
    if (!dialog.isConnected) return;
    dialog.remove();
    renderRowOutput(rowIndex);
  };
  const finish = () => {
    dialog.close();
    cleanup();
  };
  const setRow = (next: Row) => {
    apply(updateRow(workspace, id, tab.id, rowIndex, next));
    renderAll();
  };

  const dialog = createEditor(
    document,
    {
      text: node.text,
      definitionId: basedOn,
      name: node.name,
      display: node.display,
      label: node.label,
      description: node.description,
      more: node.more,
      custom: node.custom,
      choices: game.definitions
        .filter((d) => d.aliases.length > 0)
        .map((d) => ({ id: d.id, name: d.name })),
      assetIds,
    },
    {
      onChange: (changes: TokenChanges) =>
        renderRowOutput(rowIndex, customizeToken(row, anchor, basedOn, changes)),
      onApply: (changes) => {
        if (Object.keys(changes).length > 0) setRow(customizeToken(row, anchor, basedOn, changes));
        finish();
      },
      onSave: (changes, aliases) => {
        const base = game.definitions.find((d) => d.id === basedOn);
        if (base) {
          const [first, ...extra] = aliases.length > 0 ? aliases : [node.text];
          const customLayers = saveAsDefinition(
            workspace.customLayers,
            id,
            base,
            first!,
            { ...existing?.changes, ...changes },
            extra,
          );
          apply({ ...workspace, customLayers });
          setRow(resetToken(row, anchor));
        }
        finish();
      },
      onReset: () => {
        setRow(resetToken(row, anchor));
        finish();
      },
      onReassign: (definitionId) => {
        const reassigned = reassignToken(row, anchor, definitionId, game.definitions);
        if (reassigned.ok) setRow(reassigned.row);
        else status.textContent = `Could not switch this token (${reassigned.reason}).`;
        finish();
      },
      onCancel: finish,
    },
  );

  dialog.addEventListener("close", cleanup);
  document.body.append(dialog);
  dialog.showModal();
}

gameSelect.addEventListener("change", () => {
  apply(workspace);
  renderAll();
});
renderAll();
