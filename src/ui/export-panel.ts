import type { ExportSelection } from "../core/export";

export interface ExportModel {
  games: {
    id: string;
    name: string;
    tabs: { id: string; name: string; rows: number }[];
    definitions: { id: string; name: string; aliases: string[] }[];
  }[];
  /** What starts out checked. */
  selection: ExportSelection;
}

export interface ExportHandlers {
  /** The export text for a selection; called again whenever a checkbox changes. */
  buildText: (selection: ExportSelection) => string;
  onCopy: (text: string) => void;
  onDownload: (text: string) => void;
  onRequest: (text: string) => void;
  onClose: () => void;
}

function checkbox(doc: Document, kind: "tab" | "definition", gameId: string, id: string, checked: boolean) {
  const element = doc.createElement("input");
  element.type = "checkbox";
  element.checked = checked;
  element.dataset.kind = kind;
  element.dataset.game = gameId;
  element.dataset.id = id;
  return element;
}

function item(doc: Document, box: HTMLInputElement, label: string) {
  const wrapper = doc.createElement("label");
  wrapper.className = "export-item";
  wrapper.append(box, doc.createTextNode(label));
  return wrapper;
}

function button(doc: Document, action: string, text: string) {
  const element = doc.createElement("button");
  element.type = "button";
  element.dataset.action = action;
  element.textContent = text;
  return element;
}

// Names and aliases go in as text nodes, so imported data can never inject markup.
export function createExportDialog(doc: Document, model: ExportModel, handlers: ExportHandlers): HTMLDialogElement {
  const dialog = doc.createElement("dialog");
  dialog.className = "export-dialog";

  const heading = doc.createElement("h2");
  heading.textContent = "Export";
  dialog.append(heading);

  const checked = {
    tabs: new Set(model.selection.tabs.map((t) => `${t.gameId}/${t.tabId}`)),
    definitions: new Set(model.selection.definitions.map((d) => `${d.gameId}/${d.id}`)),
  };

  const list = doc.createElement("div");
  list.className = "export-list";
  for (const game of model.games) {
    const group = doc.createElement("fieldset");
    const legend = doc.createElement("legend");
    legend.textContent = game.name;
    group.append(legend);

    for (const tab of game.tabs) {
      const rows = `${tab.rows} row${tab.rows === 1 ? "" : "s"}`;
      group.append(item(doc, checkbox(doc, "tab", game.id, tab.id, checked.tabs.has(`${game.id}/${tab.id}`)), `Tab: ${tab.name} (${rows})`));
    }
    for (const definition of game.definitions) {
      const label = `Saved: ${definition.name} (${definition.aliases.join(", ")})`;
      group.append(item(doc, checkbox(doc, "definition", game.id, definition.id, checked.definitions.has(`${game.id}/${definition.id}`)), label));
    }
    list.append(group);
  }
  dialog.append(list);

  const output = doc.createElement("textarea");
  output.name = "export";
  output.readOnly = true;
  output.rows = 10;
  output.setAttribute("aria-label", "Export text");
  dialog.append(output);

  const note = doc.createElement("p");
  note.className = "export-note";
  note.textContent =
    "Request implementation opens a draft issue on GitHub. Issues there are public, so only send what you are happy to share.";

  const actions = doc.createElement("div");
  actions.className = "export-actions";
  const copy = button(doc, "copy", "Copy");
  const download = button(doc, "download", "Download .json");
  const request = button(doc, "request", "Request implementation");
  const close = button(doc, "close", "Close");
  actions.append(copy, download, request, close);
  dialog.append(actions, note);

  const selection = (): ExportSelection => {
    const boxes = [...dialog.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')].filter((b) => b.checked);
    return {
      tabs: boxes.filter((b) => b.dataset.kind === "tab").map((b) => ({ gameId: b.dataset.game!, tabId: b.dataset.id! })),
      definitions: boxes
        .filter((b) => b.dataset.kind === "definition")
        .map((b) => ({ gameId: b.dataset.game!, id: b.dataset.id! })),
    };
  };

  const refresh = () => {
    const current = selection();
    output.value = handlers.buildText(current);
    const nothing = current.tabs.length === 0 && current.definitions.length === 0;
    for (const control of [copy, download, request]) control.disabled = nothing;
  };

  dialog.addEventListener("change", refresh);
  copy.addEventListener("click", () => handlers.onCopy(output.value));
  download.addEventListener("click", () => handlers.onDownload(output.value));
  request.addEventListener("click", () => handlers.onRequest(output.value));
  close.addEventListener("click", () => handlers.onClose());
  refresh();

  return dialog;
}
