import { describe, expect, it } from "vitest";
import type { Row } from "./row";
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
} from "./tabs";
import { emptyWorkspace } from "./workspace";
import type { Tab, Workspace } from "./workspace";

const row = (notation: string, label?: string): Row => ({
  notation,
  ...(label ? { label } : {}),
  customizations: [],
});

const tab = (id: string, name: string, ...rows: Row[]): Tab => ({ id, name, rows });

/** Street Fighter has tabs a and b (active b); Guilty Gear has one. */
const workspace = (): Workspace => ({
  ...emptyWorkspace(),
  games: {
    "street-fighter": {
      activeTab: "tab-2",
      tabs: [tab("tab-1", "Ryu", row("236P"), row("5K")), tab("tab-2", "Ken", row("623P"))],
    },
    "guilty-gear": { activeTab: "tab-1", tabs: [tab("tab-1", "Sol", row("5P"))] },
  },
});

describe("addTab", () => {
  it("appends a tab with a fresh id, selects it, and leaves other games alone", () => {
    const before = workspace();

    const { workspace: after, tabId } = addTab(before, "street-fighter", "Chun-Li");

    expect(tabId).toBe("tab-3");
    expect(after.games["street-fighter"]).toEqual({
      activeTab: "tab-3",
      tabs: [...before.games["street-fighter"]!.tabs, tab("tab-3", "Chun-Li")],
    });
    expect(after.games["guilty-gear"]).toBe(before.games["guilty-gear"]);
    expect(before).toEqual(workspace());
  });

  it("starts a game's first tab, and names a tab 'Untitled' by default", () => {
    const { workspace: after, tabId } = addTab(emptyWorkspace(), "persona");

    expect(tabId).toBe("tab-1");
    expect(after.games.persona).toEqual({ activeTab: "tab-1", tabs: [tab("tab-1", "Untitled")] });
  });
});

describe("renameTab and selectTab", () => {
  it("renames with a trimmed name and ignores an empty one", () => {
    const renamed = renameTab(workspace(), "street-fighter", "tab-1", "  Ryu BnBs  ");

    expect(renamed.games["street-fighter"]!.tabs[0]!.name).toBe("Ryu BnBs");
    const same = workspace();
    expect(renameTab(same, "street-fighter", "tab-1", "   ")).toBe(same);
  });

  it("selects an existing tab and ignores an unknown one", () => {
    const picked = selectTab(workspace(), "street-fighter", "tab-1");
    expect(picked.games["street-fighter"]!.activeTab).toBe("tab-1");

    const same = workspace();
    expect(selectTab(same, "street-fighter", "tab-9")).toBe(same);
    expect(selectTab(same, "unknown-game", "tab-1")).toBe(same);
  });
});

describe("deleteTab", () => {
  it("selects the tab that takes its place when the active tab goes", () => {
    const afterActive = deleteTab(workspace(), "street-fighter", "tab-2");
    expect(afterActive.games["street-fighter"]).toEqual({
      activeTab: "tab-1",
      tabs: [tab("tab-1", "Ryu", row("236P"), row("5K"))],
    });

    const three = addTab(addTab(workspace(), "guilty-gear", "B").workspace, "guilty-gear", "C").workspace;
    const middle = selectTab(three, "guilty-gear", "tab-2");
    expect(deleteTab(middle, "guilty-gear", "tab-2").games["guilty-gear"]!.activeTab).toBe("tab-3");
  });

  it("keeps the selection when another tab is deleted", () => {
    const after = deleteTab(workspace(), "street-fighter", "tab-1");

    expect(after.games["street-fighter"]!.activeTab).toBe("tab-2");
    expect(after.games["street-fighter"]!.tabs.map((t) => t.id)).toEqual(["tab-2"]);
  });

  it("leaves a fresh 'Scratch' tab when the last one is deleted", () => {
    const after = deleteTab(workspace(), "guilty-gear", "tab-1");

    expect(after.games["guilty-gear"]).toEqual({
      activeTab: "tab-1",
      tabs: [tab("tab-1", "Scratch")],
    });
    expect(after.games["street-fighter"]).toEqual(workspace().games["street-fighter"]);
  });

  it("ignores an unknown tab", () => {
    const same = workspace();
    expect(deleteTab(same, "street-fighter", "tab-9")).toBe(same);
  });
});

describe("moveTab and moveRow", () => {
  const order = (w: Workspace) => w.games["street-fighter"]!.tabs.map((t) => t.id);

  it("reorders tabs, clamping at the ends, and ignores unknown tabs", () => {
    const withThree = addTab(workspace(), "street-fighter", "Third").workspace;

    expect(order(moveTab(withThree, "street-fighter", "tab-3", 0))).toEqual(["tab-3", "tab-1", "tab-2"]);
    expect(order(moveTab(withThree, "street-fighter", "tab-1", 99))).toEqual(["tab-2", "tab-3", "tab-1"]);
    expect(order(moveTab(withThree, "street-fighter", "tab-2", -5))).toEqual(["tab-2", "tab-1", "tab-3"]);
    expect(moveTab(withThree, "street-fighter", "tab-9", 0)).toBe(withThree);
  });

  it("reorders rows within a tab the same way", () => {
    const rows = (w: Workspace) => w.games["street-fighter"]!.tabs[0]!.rows.map((r) => r.notation);
    const three = addRow(workspace(), "street-fighter", "tab-1", row("2K"));

    expect(rows(moveRow(three, "street-fighter", "tab-1", 2, 0))).toEqual(["2K", "236P", "5K"]);
    expect(rows(moveRow(three, "street-fighter", "tab-1", 0, 99))).toEqual(["5K", "2K", "236P"]);
    expect(moveRow(three, "street-fighter", "tab-1", 7, 0)).toBe(three);
  });
});

describe("row operations", () => {
  const rowsOf = (w: Workspace, tabId = "tab-1") =>
    w.games["street-fighter"]!.tabs.find((t) => t.id === tabId)!.rows;

  it("adds a blank row at the end, or the given row at an index", () => {
    expect(rowsOf(addRow(workspace(), "street-fighter", "tab-1"))).toEqual([
      row("236P"),
      row("5K"),
      row(""),
    ]);
    expect(rowsOf(addRow(workspace(), "street-fighter", "tab-1", row("2K"), 1)).map((r) => r.notation)).toEqual([
      "236P",
      "2K",
      "5K",
    ]);
  });

  it("updates, and deletes, only the targeted row", () => {
    const updated = updateRow(workspace(), "street-fighter", "tab-1", 1, row("5K 2K", "chain"));

    expect(rowsOf(updated)).toEqual([row("236P"), row("5K 2K", "chain")]);
    expect(rowsOf(updated, "tab-2")).toEqual([row("623P")]);
    expect(rowsOf(deleteRow(workspace(), "street-fighter", "tab-1", 0))).toEqual([row("5K")]);

    const same = workspace();
    expect(updateRow(same, "street-fighter", "tab-1", 9, row("x"))).toBe(same);
    expect(deleteRow(same, "street-fighter", "tab-1", 9)).toBe(same);
  });

  it("duplicates a row, customizations included, right after the original", () => {
    const custom: Row = {
      notation: "236P",
      label: "BnB",
      customizations: [{ anchor: { text: "236", occurrence: 0 }, basedOn: "m", changes: { name: "Mine" } }],
    };
    const base = updateRow(workspace(), "street-fighter", "tab-1", 0, custom);

    const copied = rowsOf(duplicateRow(base, "street-fighter", "tab-1", 0));

    expect(copied).toEqual([custom, custom, row("5K")]);
    expect(copied[1]).not.toBe(copied[0]);
    expect(copied[1]!.customizations[0]).not.toBe(copied[0]!.customizations[0]);
  });

  it("clears a tab's rows but keeps the tab", () => {
    const cleared = clearTab(workspace(), "street-fighter", "tab-1");

    expect(rowsOf(cleared)).toEqual([]);
    expect(cleared.games["street-fighter"]!.tabs.map((t) => t.name)).toEqual(["Ryu", "Ken"]);
  });
});
