import "./style.css";
import { createAutosave } from "./core/autosave";
import { deleteDefinition, saveAsDefinition } from "./core/custom";
import {
  createGame,
  deleteGame,
  effectiveRegistry,
  parentChoices,
  renameGame,
  setParent,
} from "./core/custom-games";
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
import { buildExport, defaultSelection, parseExport, serializeExport } from "./core/export";
import { applyImport, planImport } from "./core/export-import";
import { buildIssueUrl } from "./core/issue-link";
import { buildReference } from "./core/reference";
import { bundleFor, decodeShare, encodeRowShare, encodeTabLink } from "./core/share";
import type { SharedTab } from "./core/share";
import { discardSharedTab, importSharedTab } from "./core/share-import";
import type { SharedImport } from "./core/share-import";
import { DEFAULT_GAME } from "./core/workspace";
import type { Tab, Workspace } from "./core/workspace";
import pkg from "../package.json";
import { registry } from "./data/index";
import { GLOSSARY_URL, about, credit, siteLinks, siteLogo } from "./data/site";
import { createEditor } from "./ui/editor";
import { renderView } from "./ui/render";
import { createExportDialog } from "./ui/export-panel";
import { createGamesDialog, fillGamePicker } from "./ui/games-panel";
import type { GamesModel } from "./ui/games-panel";
import { createImportDialog } from "./ui/import-panel";
import { renderSavedList } from "./ui/saved-list";
import { renderShareBanner } from "./ui/share-banner";
import { copyPng, downloadBlob, renderPng } from "./ui/image-export";
import { createAboutDialog, createReferenceDialog, renderFooter, renderHeader } from "./ui/site-chrome";
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
const shareBanner = document.querySelector<HTMLElement>("#share-banner")!;
const shareMessage = document.querySelector<HTMLElement>("#share-message")!;

const builtInIds = registry.games.map((game) => game.id);

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
if (![...builtInIds, ...workspace.customGames.map((game) => game.id)].includes(workspace.selectedGame)) {
  workspace = { ...workspace, selectedGame: DEFAULT_GAME };
}

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
  () => saveWorkspace(storage, persistable()),
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
// The workspace decides which game is selected; the dropdown is redrawn from it.
const gameId = () => workspace.selectedGame;

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
  workspace = next;
  autosave.notify();
}

function resolve(row: Row) {
  const game = resolveGame(gameId(), effectiveRegistry(registry, workspace), workspace.customLayers);
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

// ---- sharing ---------------------------------------------------------------------
/** A tab opened from a link: shown and editable, but not part of the saved data until the user saves it. */
let pending: Extract<SharedImport, { ok: true }> | undefined;

/** What gets written to storage: everything except an unsaved shared tab (and a game only it brought). */
function persistable(): Workspace {
  return pending ? discardSharedTab(workspace, pending) : workspace;
}

const compressionAvailable =
  typeof CompressionStream !== "undefined" && typeof DecompressionStream !== "undefined";
const LONG_LINK = 2000;
const baseUrl = () => location.href.split("#")[0]!;
const clearHash = () => history.replaceState(null, "", location.pathname + location.search);

function say(message: string, field?: HTMLInputElement) {
  const line = document.createElement("p");
  line.textContent = message;
  shareMessage.replaceChildren(...(field ? [line, field] : [line]));
  field?.focus();
  field?.select();
}

async function deliver(hash: string, length: number) {
  const url = baseUrl() + hash;
  const warning = length > LONG_LINK ? " It is long, so some apps may cut it off." : "";
  try {
    await navigator.clipboard.writeText(url);
    say("Link copied." + warning);
  } catch {
    // No clipboard access: show the link so it can be copied by hand.
    const field = document.createElement("input");
    field.readOnly = true;
    field.value = url;
    field.setAttribute("aria-label", "Share link");
    say("Could not copy automatically; copy the link below." + warning, field);
  }
}

const unsupported = "Sharing this needs a newer browser; a plain notation can still be shared from its row.";

async function shareRow(index: number) {
  const row = activeTab().rows[index];
  if (!row) return;
  const bundle = bundleFor(workspace, registry, gameId(), [row]);
  const plain =
    row.customizations.length === 0 && bundle.customGames.length === 0 && Object.keys(bundle.definitions).length === 0;
  if (!plain && !compressionAvailable) return say(unsupported);
  const { hash, length } = await encodeRowShare(gameId(), row, bundle);
  await deliver(hash, length);
}

async function shareTab() {
  if (!compressionAvailable) return say(unsupported);
  const tab = activeTab();
  const bundle = bundleFor(workspace, registry, gameId(), tab.rows);
  const { hash, length } = await encodeTabLink({
    gameId: gameId(),
    tab: { name: tab.name, rows: tab.rows },
    ...bundle,
  });
  await deliver(hash, length);
}

const importProblem = {
  "unknown-parent": "a game in it is based on one that is not in the link or in this app.",
  cycle: "the games in it are based on each other in a loop.",
  "unknown-game": "it is for a game that is not in the link or in this app.",
} as const;

function begin(shared: SharedTab) {
  const imported = importSharedTab(workspace, shared, builtInIds);
  if (!imported.ok) {
    say(`This link could not be opened: ${importProblem[imported.reason]}`);
    return;
  }
  workspace = imported.workspace;
  pending = imported;
  autosave.notify();
  renderAll();
}

async function openShare(hash: string) {
  const games = registry.games.map((game) => ({ id: game.id, name: game.name }));
  const result = await decodeShare(hash, games);
  if (result.kind === "none") return;
  clearHash();

  if (result.kind === "error") {
    say(`This link could not be opened: ${result.error.message}`);
    return;
  }

  // Opening another link replaces an earlier unsaved one.
  if (pending) {
    workspace = discardSharedTab(workspace, pending);
    pending = undefined;
  }

  if (result.kind === "tab") {
    begin(result);
    return;
  }
  if (result.warning) {
    const fallback = games.find((game) => game.id === DEFAULT_GAME)?.name ?? DEFAULT_GAME;
    say(`The game "${result.warning.name}" is not available here, so this was opened in ${fallback}.`);
  }
  if (result.notation === "") {
    apply({ ...workspace, selectedGame: result.gameId });
    renderAll();
    return;
  }
  begin({
    gameId: result.gameId,
    tab: { name: "Shared row", rows: [{ notation: result.notation, customizations: [] }] },
    customGames: [],
    definitions: {},
  });
}

function saveShared() {
  pending = undefined;
  apply(workspace);
  renderAll();
  say("Tab saved.");
}

function dismissShared() {
  if (!pending) return;
  workspace = discardSharedTab(workspace, pending);
  pending = undefined;
  apply(workspace);
  renderAll();
}

function renderShareBanner_() {
  if (pending && !workspace.games[pending.gameId]?.tabs.some((tab) => tab.id === pending!.tabId)) {
    pending = undefined; // the user deleted the shared tab themselves
  }
  const tab = pending && workspace.games[pending.gameId]?.tabs.find((t) => t.id === pending!.tabId);
  shareBanner.replaceChildren(
    ...(pending && tab
      ? [
          renderShareBanner(
            document,
            { tabName: tab.name, skipped: pending.skipped.length },
            { onSave: saveShared, onDismiss: dismissShared },
          ),
        ]
      : []),
  );
}

// ---- export and import --------------------------------------------------------------
const REPO = "ygg-m/fg-input-translator";

async function copyText(text: string, done: string) {
  try {
    await navigator.clipboard.writeText(text);
    say(done);
    return true;
  } catch {
    return false;
  }
}

function download(text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "fg-input-translator-export.json";
  link.click();
  URL.revokeObjectURL(url);
  say("Export downloaded.");
}

/** Show a dialog; whichever of the buttons or the close event runs first removes it, once. */
function showDialog(dialog: HTMLDialogElement) {
  const cleanup = () => {
    if (dialog.isConnected) dialog.remove();
  };
  dialog.addEventListener("close", cleanup);
  document.body.append(dialog);
  dialog.showModal();
  return () => {
    dialog.close();
    cleanup();
  };
}

function openExport() {
  const model = {
    games: effectiveRegistry(registry, workspace)
      .games.map((game) => ({
        id: game.id,
        name: game.name,
        tabs: (workspace.games[game.id]?.tabs ?? []).map((tab) => ({
          id: tab.id,
          name: tab.name,
          rows: tab.rows.length,
        })),
        definitions: (workspace.customLayers[game.id] ?? []).map((d) => ({
          id: d.id,
          name: d.name,
          aliases: d.aliases,
        })),
      }))
      .filter((game) => game.tabs.length > 0 || game.definitions.length > 0),
    selection: defaultSelection(workspace, registry, gameId()),
  };

  const close = showDialog(
    createExportDialog(document, model, {
      buildText: (selection) => serializeExport(buildExport(workspace, selection)),
      onCopy: async (text) => {
        const copied = await copyText(text, "Export copied.");
        if (!copied) say("Could not copy automatically; select the text in the box and copy it.");
      },
      onDownload: download,
      onRequest: async (text) => {
        const { url, truncated } = buildIssueUrl(text, REPO);
        if (truncated) await copyText(text, "The configuration was too long for the link, so it was copied: paste it into the issue.");
        window.open(url, "_blank", "noopener,noreferrer");
      },
      onClose: () => close(),
    }),
  );
}

function openImport() {
  const close = showDialog(
    createImportDialog(document, {
      check: (text) => {
        const parsed = parseExport(text);
        return parsed.ok
          ? { ok: true, plan: planImport(workspace, parsed.envelope, builtInIds) }
          : { ok: false, message: parsed.error.message };
      },
      onImport: (text, replace) => {
        const parsed = parseExport(text);
        if (!parsed.ok) return;
        const { workspace: next, report } = applyImport(workspace, parsed.envelope, builtInIds, { replace });
        if (report.blocked) {
          say(`Nothing was imported: ${report.blocked}`);
          return;
        }
        apply(next);
        renderAll();
        close();
        say(
          `Imported ${report.tabsAdded} tab(s)` +
            (report.gamesAdded > 0 ? `, ${report.gamesAdded} game(s)` : "") +
            ` and ${report.definitionsAdded + report.definitionsReplaced} saved definition(s)` +
            (report.definitionsKept > 0 ? `; kept your own for ${report.definitionsKept}` : "") +
            (report.skippedGames.length > 0 ? `; left out unknown games: ${report.skippedGames.join(", ")}` : "") +
            ".",
        );
      },
      onClose: () => close(),
    }),
  );
}

// ---- images and site chrome ---------------------------------------------------------
let chroma = false;
const chromaButton = document.querySelector<HTMLButtonElement>("#chroma-button")!;
chromaButton.addEventListener("click", () => {
  chroma = !chroma;
  chromaButton.setAttribute("aria-pressed", String(chroma));
  workspaceHost.dataset.chroma = String(chroma);
});

/** Draw one row's token box to a PNG; says why when it cannot. */
async function rowImage(index: number): Promise<Blob | undefined> {
  const target = view.outputs[index]?.querySelector<HTMLElement>(".notation");
  if (!target || target.childElementCount === 0) {
    say("There is nothing to draw in this row yet.");
    return undefined;
  }
  try {
    return await renderPng(target, { chroma });
  } catch (error) {
    say(error instanceof Error ? error.message : "Could not draw this row as an image.");
    return undefined;
  }
}

const saveImage = (blob: Blob) =>
  downloadBlob(blob, "combo-output.png", {
    document,
    createObjectURL: (b) => URL.createObjectURL(b),
    revokeObjectURL: (url) => URL.revokeObjectURL(url),
  });

async function downloadRowImage(index: number) {
  const blob = await rowImage(index);
  if (!blob) return;
  saveImage(blob);
  say("Image downloaded.");
}

async function copyRowImage(index: number) {
  const blob = await rowImage(index);
  if (!blob) return;
  const result = await copyPng(blob, {
    clipboard: navigator.clipboard as never,
    ClipboardItem: typeof ClipboardItem === "undefined" ? undefined : ClipboardItem,
  });
  if (result === "copied") say("Image copied.");
  else {
    saveImage(blob);
    say("This browser would not copy the image, so it was downloaded instead.");
  }
}

function openAbout() {
  const close = showDialog(createAboutDialog(document, about, () => close()));
}

function openReference() {
  const close = showDialog(createReferenceDialog(document, buildReference(registry), () => close()));
}

// ---- your games ---------------------------------------------------------------------
function fillPicker() {
  fillGamePicker(document, gameSelect, {
    builtIn: registry.games.map(({ id, name }) => ({ id, name })),
    custom: workspace.customGames.map(({ id, name }) => ({ id, name })),
    selected: gameId(),
  });
}

function gamesModel(): GamesModel {
  return {
    games: workspace.customGames.map((game) => ({
      id: game.id,
      name: game.name,
      parent: game.extends,
      parentChoices: parentChoices(workspace, registry, game.id),
      blockedBy: workspace.customGames.filter((g) => g.extends === game.id).map((g) => g.name),
    })),
    newParentChoices: parentChoices(workspace, registry, undefined),
  };
}

const parentProblem = {
  "unknown-game": "That game no longer exists.",
  "unknown-parent": "That base game no longer exists.",
  cycle: "A game cannot be based on itself or on a game that is based on it.",
} as const;

function openGames() {
  // Whatever changed is redrawn behind the dialog and in the dialog itself.
  const changed = (message: string) => {
    renderAll();
    panel.update(gamesModel());
    return message;
  };

  const panel = createGamesDialog(document, gamesModel(), {
    onCreate: (name, parent) => {
      const result = createGame(workspace, registry, { name, extends: parent });
      if (!result.ok) {
        return result.reason === "unknown-parent" ? parentProblem["unknown-parent"] : "Give the game a name first.";
      }
      apply(result.workspace);
      return changed(`Created "${name}" and switched to it.`);
    },
    onRename: (id, name) => {
      const next = renameGame(workspace, id, name);
      if (next === workspace) return "Give the game a name first.";
      apply(next);
      return changed("Renamed.");
    },
    onSetParent: (id, parent) => {
      const result = setParent(workspace, registry, id, parent);
      if (!result.ok) {
        panel.update(gamesModel()); // put the dropdown back to what is really saved
        return parentProblem[result.reason];
      }
      apply(result.workspace);
      return changed("Updated.");
    },
    onDelete: (id) => {
      const result = deleteGame(workspace, id);
      if (!result.ok) return "Other games are based on it, so it cannot be deleted yet.";
      apply(result.workspace);
      return changed("Deleted.");
    },
    confirm: (message) => window.confirm(message),
    onClose: () => close(),
  });
  const close = showDialog(panel.dialog);
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
  onShareRow: (index) => void shareRow(index),
  onShareTab: () => void shareTab(),
  onCopyImage: (index) => void copyRowImage(index),
  onDownloadImage: (index) => void downloadRowImage(index),
  confirm: (message) => window.confirm(message),
};

function renderAll() {
  fillPicker();
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
  renderShareBanner_();
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
  apply({ ...workspace, selectedGame: gameSelect.value });
  renderAll();
});
document.querySelector<HTMLButtonElement>("#games-button")!.addEventListener("click", openGames);
document.querySelector<HTMLButtonElement>("#export-button")!.addEventListener("click", openExport);
document.querySelector<HTMLButtonElement>("#import-button")!.addEventListener("click", openImport);
document.querySelector<HTMLElement>("#site-header")!.replaceChildren(
  renderHeader(
    document,
    { version: pkg.version, logo: siteLogo, glossaryUrl: GLOSSARY_URL, links: siteLinks },
    { onAbout: openAbout, onReference: openReference },
  ),
);
document.querySelector<HTMLElement>("#site-footer")!.replaceChildren(renderFooter(document, credit));
window.addEventListener("hashchange", () => void openShare(location.hash));
renderAll();
void openShare(location.hash);
