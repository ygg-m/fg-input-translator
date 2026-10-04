// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { renderTabs } from "./tabs-view";
import type { TabsHandlers, TabsModel } from "./tabs-view";

const model = (overrides: Partial<TabsModel> = {}): TabsModel => ({
  tabs: [
    { id: "tab-1", name: "Ryu" },
    { id: "tab-2", name: "Ken" },
    { id: "tab-3", name: "Chun-Li" },
  ],
  activeTab: "tab-2",
  rows: [
    { notation: "236P", label: "Fireball" },
    { notation: "5K" },
    { notation: "623P", label: "DP" },
  ],
  ...overrides,
});

const handlers = (confirm = true): TabsHandlers => ({
  onSelectTab: vi.fn(),
  onAddTab: vi.fn(),
  onRenameTab: vi.fn(),
  onDeleteTab: vi.fn(),
  onMoveTab: vi.fn(),
  onNotationInput: vi.fn(),
  onLabelInput: vi.fn(),
  onAddRow: vi.fn(),
  onDuplicateRow: vi.fn(),
  onDeleteRow: vi.fn(),
  onMoveRow: vi.fn(),
  onClearTab: vi.fn(),
  confirm: vi.fn(() => confirm),
});

const action = (root: ParentNode, name: string, index = 0) =>
  root.querySelectorAll<HTMLButtonElement>(`[data-action="${name}"]`)[index]!;

describe("renderTabs", () => {
  it("lists the tabs with the active one selected, and reports selecting and adding", () => {
    const h = handlers();
    const { element } = renderTabs(document, model(), h);

    const tabs = [...element.querySelectorAll<HTMLElement>('[role="tab"]')];
    expect(tabs.map((t) => t.textContent)).toEqual(["Ryu", "Ken", "Chun-Li"]);
    expect(tabs.map((t) => t.getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
    expect(element.querySelector('[role="tablist"]')).not.toBeNull();

    tabs[2]!.click();
    expect(h.onSelectTab).toHaveBeenCalledWith("tab-3");

    action(element, "add-tab").click();
    expect(h.onAddTab).toHaveBeenCalledTimes(1);
  });

  it("shows each row's notation and label with an output area, and reports typing without rebuilding", () => {
    const h = handlers();
    const view = renderTabs(document, model(), h);

    const rows = [...view.element.querySelectorAll<HTMLElement>(".row")];
    const notation = (i: number) => rows[i]!.querySelector<HTMLTextAreaElement>('[name="notation"]')!;
    const label = (i: number) => rows[i]!.querySelector<HTMLInputElement>('[name="label"]')!;

    expect(rows.map((_, i) => notation(i).value)).toEqual(["236P", "5K", "623P"]);
    expect(rows.map((_, i) => label(i).value)).toEqual(["Fireball", "", "DP"]);
    expect(view.outputs).toHaveLength(3);
    view.outputs.forEach((output, i) => expect(rows[i]!.contains(output)).toBe(true));

    const before = notation(1);
    before.value = "5K 2K";
    before.dispatchEvent(new Event("input", { bubbles: true }));
    label(0).value = "Fireball!";
    label(0).dispatchEvent(new Event("input", { bubbles: true }));

    expect(h.onNotationInput).toHaveBeenCalledWith(1, "5K 2K");
    expect(h.onLabelInput).toHaveBeenCalledWith(0, "Fireball!");
    expect(view.element.querySelectorAll<HTMLTextAreaElement>('[name="notation"]')[1]).toBe(before);
  });

  describe("tab actions", () => {
    it("moves the active tab, disabled at the ends", () => {
      const h = handlers();
      const { element } = renderTabs(document, model(), h);

      action(element, "move-tab-left").click();
      action(element, "move-tab-right").click();
      expect(h.onMoveTab).toHaveBeenNthCalledWith(1, "tab-2", -1);
      expect(h.onMoveTab).toHaveBeenNthCalledWith(2, "tab-2", 1);

      const first = renderTabs(document, model({ activeTab: "tab-1" }), h).element;
      expect(action(first, "move-tab-left").disabled).toBe(true);
      expect(action(first, "move-tab-right").disabled).toBe(false);
      const last = renderTabs(document, model({ activeTab: "tab-3" }), h).element;
      expect(action(last, "move-tab-right").disabled).toBe(true);
    });

    it("asks before deleting the active tab and only deletes when confirmed", () => {
      const no = handlers(false);
      action(renderTabs(document, model(), no).element, "delete-tab").click();
      expect(no.confirm).toHaveBeenCalledWith(expect.stringContaining("Ken"));
      expect(no.confirm).toHaveBeenCalledWith(expect.stringContaining("3 rows"));
      expect(no.onDeleteTab).not.toHaveBeenCalled();

      const yes = handlers(true);
      action(renderTabs(document, model(), yes).element, "delete-tab").click();
      expect(yes.onDeleteTab).toHaveBeenCalledWith("tab-2");
    });
  });

  describe("renaming", () => {
    const start = (view: ReturnType<typeof renderTabs>) => {
      action(view.element, "rename-tab").click();
      return view.element.querySelector<HTMLInputElement>('[name="tabName"]')!;
    };
    const press = (input: HTMLInputElement, key: string) =>
      input.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

    it("swaps the active tab for a text box that Enter commits", () => {
      const h = handlers();
      const view = renderTabs(document, model(), h);
      const input = start(view);

      expect(input.value).toBe("Ken");
      expect(view.element.querySelector('[role="tab"][data-tab-id="tab-2"]')).toBeNull();

      input.value = "Ken BnBs";
      press(input, "Enter");
      expect(h.onRenameTab).toHaveBeenCalledWith("tab-2", "Ken BnBs");
    });

    it("restores the tab on Escape without renaming, and commits on blur only when changed", () => {
      const h = handlers();
      const view = renderTabs(document, model(), h);

      const escaped = start(view);
      escaped.value = "never";
      press(escaped, "Escape");
      expect(h.onRenameTab).not.toHaveBeenCalled();
      expect(view.element.querySelector('[role="tab"][data-tab-id="tab-2"]')!.textContent).toBe("Ken");

      const untouched = start(view);
      untouched.dispatchEvent(new Event("blur"));
      expect(h.onRenameTab).not.toHaveBeenCalled();

      const edited = start(view);
      edited.value = "Ken 2";
      edited.dispatchEvent(new Event("blur"));
      expect(h.onRenameTab).toHaveBeenCalledWith("tab-2", "Ken 2");
    });

    it("can be started from outside for a newly created tab", () => {
      const view = renderTabs(document, model(), handlers());
      document.body.append(view.element);

      view.startRename("tab-3");

      const input = view.element.querySelector<HTMLInputElement>('[name="tabName"]')!;
      expect(input.value).toBe("Chun-Li");
      expect(document.activeElement === input || input.matches(":focus")).toBe(true);
    });
  });

  describe("row controls", () => {
    it("moves, duplicates and adds rows, with the end buttons disabled", () => {
      const h = handlers();
      const { element } = renderTabs(document, model(), h);

      expect([action(element, "move-row-up", 0).disabled, action(element, "move-row-up", 1).disabled]).toEqual([true, false]);
      expect([action(element, "move-row-down", 2).disabled, action(element, "move-row-down", 1).disabled]).toEqual([true, false]);

      action(element, "move-row-up", 1).click();
      action(element, "move-row-down", 1).click();
      action(element, "duplicate-row", 2).click();
      action(element, "add-row").click();

      expect(h.onMoveRow).toHaveBeenNthCalledWith(1, 1, -1);
      expect(h.onMoveRow).toHaveBeenNthCalledWith(2, 1, 1);
      expect(h.onDuplicateRow).toHaveBeenCalledWith(2);
      expect(h.onAddRow).toHaveBeenCalledTimes(1);
    });

    it("asks before deleting a row or clearing the tab", () => {
      const no = handlers(false);
      const refused = renderTabs(document, model(), no).element;
      action(refused, "delete-row", 1).click();
      action(refused, "clear-tab").click();
      expect(no.confirm).toHaveBeenCalledTimes(2);
      expect(no.confirm).toHaveBeenLastCalledWith(expect.stringContaining("Ken"));
      expect(no.onDeleteRow).not.toHaveBeenCalled();
      expect(no.onClearTab).not.toHaveBeenCalled();

      const yes = handlers(true);
      const accepted = renderTabs(document, model(), yes).element;
      action(accepted, "delete-row", 1).click();
      action(accepted, "clear-tab").click();
      expect(yes.onDeleteRow).toHaveBeenCalledWith(1);
      expect(yes.onClearTab).toHaveBeenCalledTimes(1);
    });
  });

  it("keeps hostile names and notations inert and can focus a row's notation box", () => {
    const hostile = '<img src=x onerror="alert(1)">';
    const view = renderTabs(
      document,
      model({ tabs: [{ id: "tab-1", name: hostile }], activeTab: "tab-1", rows: [{ notation: hostile, label: hostile }] }),
      handlers(),
    );
    document.body.append(view.element);

    expect(view.element.querySelector("img")).toBeNull();
    expect(view.element.querySelector('[role="tab"]')!.textContent).toBe(hostile);
    expect(view.element.querySelector<HTMLTextAreaElement>('[name="notation"]')!.value).toBe(hostile);

    view.focusRow(0);
    expect(document.activeElement).toBe(view.element.querySelector('[name="notation"]'));
  });
});
