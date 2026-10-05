// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import type { ImportPlan } from "../core/export-import";
import { createImportDialog } from "./import-panel";
import type { ImportCheck, ImportHandlers } from "./import-panel";

const jab = { id: "custom.sf.lp", name: "Their Jab", aliases: ["lp"], saved: true as const, basedOn: "base.x" };
const mid = { id: "custom.sf.mp", name: "Their Mid", aliases: ["mp"], saved: true as const, basedOn: "base.x" };

const plan = (overrides: Partial<ImportPlan> = {}): ImportPlan => ({
  tabs: [
    { gameId: "street-fighter", name: "Ryu", rows: 2, finalName: "Ryu" },
    { gameId: "street-fighter", name: "Ken", rows: 1, finalName: "Ken (2)" },
  ],
  definitions: [
    { gameId: "street-fighter", definition: jab, status: "conflict" },
    { gameId: "street-fighter", definition: mid, status: "new" },
  ],
  skippedGames: [],
  ...overrides,
});

const setup = (check: (text: string) => ImportCheck) => {
  const handlers: ImportHandlers = { check: vi.fn(check), onImport: vi.fn(), onClose: vi.fn() };
  const dialog = createImportDialog(document, handlers);
  return { handlers, dialog };
};

const paste = (dialog: HTMLElement, value: string) => {
  const field = dialog.querySelector<HTMLTextAreaElement>('[name="text"]')!;
  field.value = value;
  field.dispatchEvent(new Event("input", { bubbles: true }));
};
const importButton = (dialog: HTMLElement) => dialog.querySelector<HTMLButtonElement>('[data-action="import"]')!;
const result = (dialog: HTMLElement) => dialog.querySelector<HTMLElement>(".import-result")!;

describe("createImportDialog", () => {
  it("starts empty with Import disabled, and does not complain about empty text", () => {
    const { dialog, handlers } = setup(() => ({ ok: false, message: "never shown" }));

    expect(dialog.tagName).toBe("DIALOG");
    expect(importButton(dialog).disabled).toBe(true);
    expect(result(dialog).textContent).toBe("");

    paste(dialog, "   ");
    expect(handlers.check).not.toHaveBeenCalled();
    expect(result(dialog).textContent).toBe("");
  });

  it("shows why text cannot be imported and keeps Import disabled", () => {
    const { dialog } = setup(() => ({ ok: false, message: "tabs[0].gameId must be text" }));

    paste(dialog, "{bad");

    expect(result(dialog).textContent).toContain("tabs[0].gameId must be text");
    expect(importButton(dialog).disabled).toBe(true);
  });

  it("previews valid text, listing skipped games and a keep-or-replace choice per clash", () => {
    const { dialog } = setup(() => ({ ok: true, plan: plan({ skippedGames: ["vanished-game"] }) }));

    paste(dialog, "{good}");

    const text = result(dialog).textContent!;
    expect(text).toContain("2 tabs");
    expect(text).toContain("1 new saved definition");
    expect(text).toContain("vanished-game");
    expect(importButton(dialog).disabled).toBe(false);

    const choices = dialog.querySelectorAll<HTMLSelectElement>("select[data-conflict-key]");
    expect(choices).toHaveLength(1);
    expect(choices[0]!.dataset.conflictKey).toBe("street-fighter:custom.sf.lp");
    expect(choices[0]!.value).toBe("keep");
    expect(result(dialog).textContent).toContain("Their Jab");
  });

  it("imports with the clashes the user chose to replace, and closes", () => {
    const { dialog, handlers } = setup(() => ({ ok: true, plan: plan() }));
    paste(dialog, "{good}");

    importButton(dialog).click();
    expect(handlers.onImport).toHaveBeenLastCalledWith("{good}", []);

    const choice = dialog.querySelector<HTMLSelectElement>("select[data-conflict-key]")!;
    choice.value = "replace";
    choice.dispatchEvent(new Event("change", { bubbles: true }));
    importButton(dialog).click();
    expect(handlers.onImport).toHaveBeenLastCalledWith("{good}", ["street-fighter:custom.sf.lp"]);

    dialog.querySelector<HTMLButtonElement>('[data-action="close"]')!.click();
    expect(handlers.onClose).toHaveBeenCalledTimes(1);
  });

  it("loads a chosen .json file into the text box and checks it", async () => {
    const { dialog, handlers } = setup(() => ({ ok: true, plan: plan({ definitions: [] }) }));
    const picker = dialog.querySelector<HTMLInputElement>('[name="file"]')!;

    const file = new File(["{from a file}"], "export.json", { type: "application/json" });
    Object.defineProperty(picker, "files", { value: [file], configurable: true });
    picker.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(dialog.querySelector<HTMLTextAreaElement>('[name="text"]')!.value).toBe("{from a file}");
    expect(handlers.check).toHaveBeenCalledWith("{from a file}");
    expect(importButton(dialog).disabled).toBe(false);
  });

  it("keeps hostile names inert", () => {
    const hostile = '<img src=x onerror="alert(1)">';
    const { dialog } = setup(() => ({
      ok: true,
      plan: plan({
        definitions: [{ gameId: "g", definition: { ...jab, name: hostile }, status: "conflict" }],
        skippedGames: [hostile],
      }),
    }));

    paste(dialog, "{good}");

    expect(dialog.querySelector("img")).toBeNull();
    expect(result(dialog).textContent).toContain(hostile);
  });
});
