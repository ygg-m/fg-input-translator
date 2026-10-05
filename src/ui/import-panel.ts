import { definitionKey } from "../core/export-import";
import type { ImportPlan } from "../core/export-import";

export type ImportCheck = { ok: false; message: string } | { ok: true; plan: ImportPlan };

export interface ImportHandlers {
  /** Read the pasted text without changing anything, and say what importing it would do. */
  check: (text: string) => ImportCheck;
  /** `replace` holds the keys of the clashing definitions the user chose to take from the file. */
  onImport: (text: string, replace: string[]) => void;
  onClose: () => void;
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

function textElement(doc: Document, tag: string, className: string, text: string) {
  const element = doc.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function button(doc: Document, action: string, text: string) {
  const element = doc.createElement("button");
  element.type = "button";
  element.dataset.action = action;
  element.textContent = text;
  return element;
}

// Everything from the file goes in as text, so a hostile export can never inject markup.
export function createImportDialog(doc: Document, handlers: ImportHandlers): HTMLDialogElement {
  const dialog = doc.createElement("dialog");
  dialog.className = "import-dialog";
  dialog.append(textElement(doc, "h2", "", "Import"));

  const text = doc.createElement("textarea");
  text.name = "text";
  text.rows = 10;
  text.placeholder = "Paste an export here";
  text.setAttribute("aria-label", "Export text to import");

  const file = doc.createElement("input");
  file.type = "file";
  file.name = "file";
  file.accept = ".json,application/json";
  file.setAttribute("aria-label", "Or choose a .json file");

  const result = doc.createElement("div");
  result.className = "import-result";
  result.setAttribute("role", "status");

  const actions = doc.createElement("div");
  actions.className = "import-actions";
  const importButton = button(doc, "import", "Import");
  importButton.disabled = true;
  const close = button(doc, "close", "Close");
  actions.append(importButton, close);

  dialog.append(text, file, result, actions);

  const refresh = () => {
    result.replaceChildren();
    importButton.disabled = true;
    if (text.value.trim() === "") return;

    const checked = handlers.check(text.value);
    if (!checked.ok) {
      result.append(textElement(doc, "p", "import-error", checked.message));
      return;
    }

    const { plan } = checked;
    if (plan.blocked) {
      result.append(textElement(doc, "p", "import-error", plan.blocked));
      return;
    }
    const fresh = plan.definitions.filter((d) => d.status === "new").length;
    result.append(
      textElement(
        doc,
        "p",
        "import-summary",
        `Will add ${plural(plan.tabs.length, "tab")} and ${plural(fresh, "new saved definition")}.`,
      ),
    );
    for (const game of plan.games) {
      const label = game.status === "new" ? "New game" : "Game you already have";
      result.append(textElement(doc, "p", "import-game", `${label}: ${game.name}`));
    }
    if (plan.skippedGames.length > 0) {
      result.append(
        textElement(doc, "p", "import-skipped", `Left out (game not available here): ${plan.skippedGames.join(", ")}.`),
      );
    }

    for (const { gameId, definition, status } of plan.definitions) {
      if (status !== "conflict") continue;
      const row = doc.createElement("label");
      row.className = "import-conflict";
      row.append(doc.createTextNode(`You already save text like "${definition.aliases.join(", ")}" — ${definition.name}: `));
      const choice = doc.createElement("select");
      choice.dataset.conflictKey = definitionKey(gameId, definition);
      for (const [value, label] of [
        ["keep", "Keep mine"],
        ["replace", "Use theirs"],
      ] as const) {
        const option = doc.createElement("option");
        option.value = value;
        option.textContent = label;
        choice.append(option);
      }
      row.append(choice);
      result.append(row);
    }
    importButton.disabled = false;
  };

  text.addEventListener("input", refresh);
  file.addEventListener("change", () => {
    const chosen = file.files?.[0];
    if (!chosen) return;
    chosen.text().then(
      (content) => {
        text.value = content;
        refresh();
      },
      () => {
        result.replaceChildren(textElement(doc, "p", "import-error", "Could not read that file."));
        importButton.disabled = true;
      },
    );
  });

  importButton.addEventListener("click", () => {
    const replace = [...dialog.querySelectorAll<HTMLSelectElement>("select[data-conflict-key]")]
      .filter((choice) => choice.value === "replace")
      .map((choice) => choice.dataset.conflictKey!);
    handlers.onImport(text.value, replace);
  });
  close.addEventListener("click", () => handlers.onClose());

  return dialog;
}
