export interface TabsModel {
  tabs: { id: string; name: string }[];
  activeTab: string;
  /** The rows of the active tab. */
  rows: { notation: string; label?: string }[];
}

export interface TabsHandlers {
  onSelectTab: (tabId: string) => void;
  onAddTab: () => void;
  onRenameTab: (tabId: string, name: string) => void;
  onDeleteTab: (tabId: string) => void;
  onMoveTab: (tabId: string, delta: -1 | 1) => void;
  onNotationInput: (index: number, text: string) => void;
  onLabelInput: (index: number, text: string) => void;
  onAddRow: () => void;
  onDuplicateRow: (index: number) => void;
  onDeleteRow: (index: number) => void;
  onMoveRow: (index: number, delta: -1 | 1) => void;
  onClearTab: () => void;
  onShareRow: (index: number) => void;
  onShareTab: () => void;
  onCopyImage: (index: number) => void;
  onDownloadImage: (index: number) => void;
  /** Asked before anything is deleted; the page passes window.confirm. */
  confirm: (message: string) => boolean;
}

export interface TabsView {
  element: HTMLElement;
  /** One empty container per row, for the page to draw that row's tokens into. */
  outputs: HTMLElement[];
  /** Swap a tab for a text box, e.g. right after it was created. */
  startRename: (tabId: string) => void;
  /** Put the cursor in a row's notation box, e.g. right after it was added. */
  focusRow: (index: number) => void;
}

function button(doc: Document, action: string, text: string): HTMLButtonElement {
  const element = doc.createElement("button");
  element.type = "button";
  element.dataset.action = action;
  element.textContent = text;
  return element;
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

export function renderTabs(doc: Document, model: TabsModel, handlers: TabsHandlers): TabsView {
  const element = doc.createElement("div");
  element.className = "workspace";

  const list = doc.createElement("div");
  list.className = "tabs";
  list.setAttribute("role", "tablist");

  for (const tab of model.tabs) {
    const item = doc.createElement("button");
    item.type = "button";
    item.className = "tab";
    item.setAttribute("role", "tab");
    item.setAttribute("aria-selected", String(tab.id === model.activeTab));
    item.dataset.tabId = tab.id;
    item.textContent = tab.name;
    item.addEventListener("click", () => handlers.onSelectTab(tab.id));
    list.append(item);
  }

  const add = button(doc, "add-tab", "+ New tab");
  add.addEventListener("click", () => handlers.onAddTab());
  list.append(add);
  element.append(list);

  // Renaming happens in place: Enter or blur commits a changed name, Escape puts the tab back.
  const startRename = (tabId: string) => {
    const tab = model.tabs.find((t) => t.id === tabId);
    const shown = list.querySelector<HTMLElement>(`[data-tab-id="${tabId}"]`);
    if (!tab || !shown) return;

    const input = doc.createElement("input");
    input.name = "tabName";
    input.className = "tab-name";
    input.setAttribute("aria-label", "Tab name");
    input.value = tab.name;

    let finished = false;
    const finish = (commit: boolean) => {
      if (finished) return;
      finished = true;
      if (commit && input.value !== tab.name) handlers.onRenameTab(tabId, input.value);
      else if (input.parentNode) input.replaceWith(shown);
    };
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") finish(true);
      else if (event.key === "Escape") finish(false);
    });
    input.addEventListener("blur", () => finish(true));

    shown.replaceWith(input);
    input.focus();
    input.select();
  };

  const index = model.tabs.findIndex((t) => t.id === model.activeTab);
  const active = model.tabs[index];
  if (active) {
    const actions = doc.createElement("div");
    actions.className = "tab-actions";

    const rename = button(doc, "rename-tab", "Rename");
    rename.addEventListener("click", () => startRename(active.id));
    const left = button(doc, "move-tab-left", "Move left");
    left.disabled = index === 0;
    left.addEventListener("click", () => handlers.onMoveTab(active.id, -1));
    const right = button(doc, "move-tab-right", "Move right");
    right.disabled = index === model.tabs.length - 1;
    right.addEventListener("click", () => handlers.onMoveTab(active.id, 1));
    const remove = button(doc, "delete-tab", "Delete tab");
    remove.addEventListener("click", () => {
      const message = `Delete the tab "${active.name}" and its ${plural(model.rows.length, "row")}?`;
      if (handlers.confirm(message)) handlers.onDeleteTab(active.id);
    });

    const share = button(doc, "share-tab", "Share tab");
    share.addEventListener("click", () => handlers.onShareTab());

    actions.append(rename, left, right, share, remove);
    element.append(actions);
  }

  const outputs: HTMLElement[] = [];
  const rowList = doc.createElement("ol");
  rowList.className = "rows";

  model.rows.forEach((row, rowIndex) => {
    const item = doc.createElement("li");
    item.className = "row";

    const label = doc.createElement("input");
    label.name = "label";
    label.placeholder = "Label (optional)";
    label.value = row.label ?? "";
    label.addEventListener("input", () => handlers.onLabelInput(rowIndex, label.value));

    const notation = doc.createElement("textarea");
    notation.name = "notation";
    notation.rows = 2;
    notation.spellcheck = false;
    notation.value = row.notation;
    notation.addEventListener("input", () => handlers.onNotationInput(rowIndex, notation.value));

    const output = doc.createElement("div");
    output.className = "row-output";
    outputs.push(output);

    const controls = doc.createElement("div");
    controls.className = "row-actions";
    const up = button(doc, "move-row-up", "Up");
    up.disabled = rowIndex === 0;
    up.addEventListener("click", () => handlers.onMoveRow(rowIndex, -1));
    const down = button(doc, "move-row-down", "Down");
    down.disabled = rowIndex === model.rows.length - 1;
    down.addEventListener("click", () => handlers.onMoveRow(rowIndex, 1));
    const duplicate = button(doc, "duplicate-row", "Duplicate");
    duplicate.addEventListener("click", () => handlers.onDuplicateRow(rowIndex));
    const remove = button(doc, "delete-row", "Delete");
    remove.addEventListener("click", () => {
      if (handlers.confirm("Delete this row?")) handlers.onDeleteRow(rowIndex);
    });
    const shareRow = button(doc, "share-row", "Copy link");
    shareRow.addEventListener("click", () => handlers.onShareRow(rowIndex));
    const copyImage = button(doc, "copy-image", "Copy image");
    copyImage.addEventListener("click", () => handlers.onCopyImage(rowIndex));
    const downloadImage = button(doc, "download-image", "Download PNG");
    downloadImage.addEventListener("click", () => handlers.onDownloadImage(rowIndex));
    controls.append(up, down, duplicate, shareRow, copyImage, downloadImage, remove);

    item.append(label, notation, output, controls);
    rowList.append(item);
  });
  element.append(rowList);

  const footer = doc.createElement("div");
  footer.className = "workspace-actions";
  const addRow = button(doc, "add-row", "Add row");
  addRow.addEventListener("click", () => handlers.onAddRow());
  const clear = button(doc, "clear-tab", "Clear tab");
  clear.addEventListener("click", () => {
    const name = active?.name ?? "this tab";
    if (handlers.confirm(`Remove all ${plural(model.rows.length, "row")} from "${name}"?`)) handlers.onClearTab();
  });
  footer.append(addRow, clear);
  element.append(footer);

  const focusRow = (rowIndex: number) => {
    element.querySelectorAll<HTMLTextAreaElement>('[name="notation"]')[rowIndex]?.focus();
  };

  return { element, outputs, startRename, focusRow };
}
