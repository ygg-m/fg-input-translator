// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { createGamesDialog, fillGamePicker } from "./games-panel";
import type { GamesHandlers, GamesModel } from "./games-panel";

describe("fillGamePicker", () => {
  const builtIn = [
    { id: "guilty-gear", name: "Guilty Gear" },
    { id: "street-fighter", name: "Street Fighter" },
  ];

  it("lists the built-in games, then the user's own under a 'Your games' group, with one selected", () => {
    const select = document.createElement("select");

    fillGamePicker(document, select, {
      builtIn,
      custom: [{ id: "custom-ryu", name: "Ryu training" }],
      selected: "custom-ryu",
    });

    const groups = [...select.querySelectorAll("optgroup")];
    expect(groups.map((g) => g.label)).toEqual(["Your games"]);
    expect([...select.options].map((o) => o.textContent)).toEqual(["Guilty Gear", "Street Fighter", "Ryu training"]);
    expect(groups[0]!.querySelectorAll("option")).toHaveLength(1);
    expect(select.value).toBe("custom-ryu");
  });

  it("adds no group when there are no custom games, and replaces what was there before", () => {
    const select = document.createElement("select");
    fillGamePicker(document, select, { builtIn, custom: [{ id: "c", name: "C" }], selected: "guilty-gear" });

    fillGamePicker(document, select, { builtIn, custom: [], selected: "street-fighter" });

    expect(select.querySelectorAll("optgroup")).toHaveLength(0);
    expect(select.options).toHaveLength(2);
    expect(select.value).toBe("street-fighter");
  });

  it("keeps hostile names inert", () => {
    const hostile = '<img src=x onerror="alert(1)">';
    const select = document.createElement("select");

    fillGamePicker(document, select, { builtIn, custom: [{ id: "c", name: hostile }], selected: "guilty-gear" });

    expect(select.querySelector("img")).toBeNull();
    expect([...select.options].at(-1)!.textContent).toBe(hostile);
  });
});

const model = (overrides: Partial<GamesModel> = {}): GamesModel => ({
  games: [
    {
      id: "custom-a",
      name: "Ryu training",
      parent: "street-fighter",
      parentChoices: [
        { id: "street-fighter", name: "Street Fighter" },
        { id: "guilty-gear", name: "Guilty Gear" },
      ],
      blockedBy: [],
    },
    {
      id: "custom-b",
      name: "Base",
      parentChoices: [{ id: "street-fighter", name: "Street Fighter" }],
      blockedBy: ["Ryu advanced", "Ken"],
    },
  ],
  newParentChoices: [
    { id: "street-fighter", name: "Street Fighter" },
    { id: "custom-a", name: "Ryu training" },
  ],
  ...overrides,
});

const handlers = (confirm = true): GamesHandlers => ({
  onCreate: vi.fn(() => undefined),
  onRename: vi.fn(() => undefined),
  onSetParent: vi.fn(() => undefined),
  onDelete: vi.fn(() => undefined),
  confirm: vi.fn(() => confirm),
  onClose: vi.fn(),
});

const setup = (m = model(), h = handlers()) => {
  const view = createGamesDialog(document, m, h);
  return { ...view, h };
};
const rowOf = (dialog: HTMLElement, id: string) => dialog.querySelector<HTMLElement>(`[data-game-id="${id}"]`)!;
const action = (root: ParentNode, name: string) => root.querySelector<HTMLButtonElement>(`[data-action="${name}"]`)!;
const message = (dialog: HTMLElement) => dialog.querySelector(".games-message")!.textContent;

describe("createGamesDialog", () => {
  it("lists each custom game with its name and what it is based on", () => {
    const { dialog } = setup();

    expect(dialog.tagName).toBe("DIALOG");
    const a = rowOf(dialog, "custom-a");
    expect(a.querySelector<HTMLInputElement>('[name="name"]')!.value).toBe("Ryu training");
    expect(a.querySelector<HTMLSelectElement>('[name="parent"]')!.value).toBe("street-fighter");
    expect([...a.querySelectorAll<HTMLOptionElement>('[name="parent"] option')].map((o) => o.textContent)).toEqual([
      "Nothing (shared inputs only)",
      "Street Fighter",
      "Guilty Gear",
    ]);
    expect(rowOf(dialog, "custom-b").querySelector<HTMLSelectElement>('[name="parent"]')!.value).toBe("");
  });

  it("creates a game from a trimmed name and a chosen base, and asks for a name first", () => {
    const { dialog, h } = setup();
    const name = dialog.querySelector<HTMLInputElement>('[name="newName"]')!;
    const parent = dialog.querySelector<HTMLSelectElement>('[name="newParent"]')!;

    action(dialog, "create").click();
    expect(h.onCreate).not.toHaveBeenCalled();
    expect(message(dialog)).toMatch(/name/i);

    name.value = "  My Game ";
    parent.value = "custom-a";
    action(dialog, "create").click();
    expect(h.onCreate).toHaveBeenCalledWith("My Game", "custom-a");

    parent.value = "";
    action(dialog, "create").click();
    expect(h.onCreate).toHaveBeenLastCalledWith("My Game", undefined);
  });

  it("shows what a handler reports back, such as a refusal", () => {
    const h = handlers();
    h.onCreate = vi.fn(() => "That name is taken.");
    const { dialog } = setup(model(), h);
    dialog.querySelector<HTMLInputElement>('[name="newName"]')!.value = "X";

    action(dialog, "create").click();

    expect(message(dialog)).toBe("That name is taken.");
  });

  it("renames a game and changes or clears what it is based on", () => {
    const { dialog, h } = setup();
    const a = rowOf(dialog, "custom-a");

    a.querySelector<HTMLInputElement>('[name="name"]')!.value = "Ryu drills";
    action(a, "rename").click();
    expect(h.onRename).toHaveBeenCalledWith("custom-a", "Ryu drills");

    const parent = a.querySelector<HTMLSelectElement>('[name="parent"]')!;
    parent.value = "guilty-gear";
    parent.dispatchEvent(new Event("change", { bubbles: true }));
    expect(h.onSetParent).toHaveBeenLastCalledWith("custom-a", "guilty-gear");

    parent.value = "";
    parent.dispatchEvent(new Event("change", { bubbles: true }));
    expect(h.onSetParent).toHaveBeenLastCalledWith("custom-a", undefined);
  });

  it("asks before deleting and only deletes when confirmed", () => {
    const refused = setup(model(), handlers(false));
    action(rowOf(refused.dialog, "custom-a"), "delete").click();
    expect(refused.h.confirm).toHaveBeenCalledWith(expect.stringContaining("Ryu training"));
    expect(refused.h.onDelete).not.toHaveBeenCalled();

    const accepted = setup();
    action(rowOf(accepted.dialog, "custom-a"), "delete").click();
    expect(accepted.h.onDelete).toHaveBeenCalledWith("custom-a");
  });

  it("disables delete for a game others are based on, and names them", () => {
    const { dialog } = setup();
    const b = rowOf(dialog, "custom-b");

    expect(action(b, "delete").disabled).toBe(true);
    expect(b.textContent).toContain("Ryu advanced");
    expect(b.textContent).toContain("Ken");
    expect(action(rowOf(dialog, "custom-a"), "delete").disabled).toBe(false);
  });

  it("redraws with a new model and message, and clears the new-game form", () => {
    const { dialog, update } = setup();
    dialog.querySelector<HTMLInputElement>('[name="newName"]')!.value = "Typed";

    update(model({ games: [] }), 'Created "Typed".');

    expect(dialog.querySelectorAll("[data-game-id]")).toHaveLength(0);
    expect(message(dialog)).toBe('Created "Typed".');
    expect(dialog.querySelector<HTMLInputElement>('[name="newName"]')!.value).toBe("");
  });

  it("closes, and keeps hostile names inert", () => {
    const hostile = '<img src=x onerror="alert(1)">';
    const { dialog, h } = setup(
      model({ games: [{ id: "h", name: hostile, parentChoices: [], blockedBy: [hostile] }], newParentChoices: [{ id: "x", name: hostile }] }),
    );

    expect(dialog.querySelector("img")).toBeNull();
    expect(rowOf(dialog, "h").querySelector<HTMLInputElement>('[name="name"]')!.value).toBe(hostile);

    action(dialog, "close").click();
    expect(h.onClose).toHaveBeenCalledTimes(1);
  });
});
