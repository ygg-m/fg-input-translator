// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import type { ExportSelection } from "../core/export";
import { createExportDialog } from "./export-panel";
import type { ExportHandlers, ExportModel } from "./export-panel";

const model = (overrides: Partial<ExportModel> = {}): ExportModel => ({
  games: [
    {
      id: "street-fighter",
      name: "Street Fighter",
      tabs: [
        { id: "tab-1", name: "Ryu", rows: 2 },
        { id: "tab-2", name: "Ken", rows: 1 },
      ],
      definitions: [{ id: "custom.sf.lp", name: "Jab", aliases: ["lp"] }],
    },
    {
      id: "guilty-gear",
      name: "Guilty Gear",
      tabs: [{ id: "tab-1", name: "Sol", rows: 3 }],
      definitions: [],
    },
  ],
  selection: {
    tabs: [{ gameId: "street-fighter", tabId: "tab-1" }],
    definitions: [{ gameId: "street-fighter", id: "custom.sf.lp" }],
  },
  ...overrides,
});

const describeSelection = (s: ExportSelection) =>
  `tabs=${s.tabs.map((t) => `${t.gameId}/${t.tabId}`).join(",")};defs=${s.definitions.map((d) => d.id).join(",")}`;

const handlers = (): ExportHandlers => ({
  buildText: vi.fn((selection: ExportSelection) => describeSelection(selection)),
  onCopy: vi.fn(),
  onDownload: vi.fn(),
  onRequest: vi.fn(),
  onClose: vi.fn(),
});

const box = (dialog: HTMLElement, kind: "tab" | "definition", index: number) =>
  dialog.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][data-kind="${kind}"]`)[index]!;
const text = (dialog: HTMLElement) => dialog.querySelector<HTMLTextAreaElement>('[name="export"]')!;
const action = (dialog: HTMLElement, name: string) =>
  dialog.querySelector<HTMLButtonElement>(`[data-action="${name}"]`)!;

describe("createExportDialog", () => {
  it("lists every game's tabs and saved definitions, checked as selected, with the text for that selection", () => {
    const h = handlers();
    const dialog = createExportDialog(document, model(), h);

    expect(dialog.tagName).toBe("DIALOG");
    expect([...dialog.querySelectorAll("fieldset legend")].map((l) => l.textContent)).toEqual([
      "Street Fighter",
      "Guilty Gear",
    ]);
    expect([0, 1, 2].map((i) => box(dialog, "tab", i).checked)).toEqual([true, false, false]);
    expect(box(dialog, "definition", 0).checked).toBe(true);
    expect(dialog.querySelector("fieldset")!.textContent).toContain("Ryu");
    expect(dialog.querySelector("fieldset")!.textContent).toContain("Jab");
    expect(text(dialog).readOnly).toBe(true);
    expect(text(dialog).value).toBe("tabs=street-fighter/tab-1;defs=custom.sf.lp");
  });

  it("rebuilds the text whenever a checkbox changes", () => {
    const h = handlers();
    const dialog = createExportDialog(document, model(), h);

    const second = box(dialog, "tab", 1);
    second.checked = true;
    second.dispatchEvent(new Event("change", { bubbles: true }));
    const third = box(dialog, "tab", 2);
    third.checked = true;
    third.dispatchEvent(new Event("change", { bubbles: true }));
    const definition = box(dialog, "definition", 0);
    definition.checked = false;
    definition.dispatchEvent(new Event("change", { bubbles: true }));

    expect(text(dialog).value).toBe("tabs=street-fighter/tab-1,street-fighter/tab-2,guilty-gear/tab-1;defs=");
  });

  it("copies, downloads and requests with the current text, and closes", () => {
    const h = handlers();
    const dialog = createExportDialog(document, model(), h);

    action(dialog, "copy").click();
    action(dialog, "download").click();
    action(dialog, "request").click();
    action(dialog, "close").click();

    const expected = "tabs=street-fighter/tab-1;defs=custom.sf.lp";
    expect(h.onCopy).toHaveBeenCalledWith(expected);
    expect(h.onDownload).toHaveBeenCalledWith(expected);
    expect(h.onRequest).toHaveBeenCalledWith(expected);
    expect(h.onClose).toHaveBeenCalledTimes(1);
  });

  it("disables the actions while nothing is selected, and warns that a request is public", () => {
    const empty = createExportDialog(document, model({ selection: { tabs: [], definitions: [] } }), handlers());

    for (const name of ["copy", "download", "request"]) expect(action(empty, name).disabled).toBe(true);
    expect(empty.querySelector(".export-note")!.textContent).toMatch(/public/i);

    const some = createExportDialog(document, model(), handlers());
    for (const name of ["copy", "download", "request"]) expect(action(some, name).disabled).toBe(false);
  });

  it("keeps hostile names inert", () => {
    const hostile = '<img src=x onerror="alert(1)">';
    const dialog = createExportDialog(
      document,
      model({ games: [{ id: "g", name: hostile, tabs: [{ id: "t", name: hostile, rows: 0 }], definitions: [] }], selection: { tabs: [], definitions: [] } }),
      handlers(),
    );

    expect(dialog.querySelector("img")).toBeNull();
    expect(dialog.querySelector("legend")!.textContent).toBe(hostile);
  });
});
