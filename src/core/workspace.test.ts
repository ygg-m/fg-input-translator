import { describe, expect, it } from "vitest";
import type { Row } from "./row";
import { emptyWorkspace, getActiveRow, setActiveRow } from "./workspace";
import type { Workspace } from "./workspace";

const row = (notation: string): Row => ({ notation, customizations: [] });

describe("getActiveRow", () => {
  it("is a blank row for a game that has none yet", () => {
    expect(getActiveRow(emptyWorkspace(), "street-fighter")).toEqual(row(""));
  });

  it("is the first row of the game's active tab", () => {
    const workspace: Workspace = {
      ...emptyWorkspace(),
      games: {
        "street-fighter": {
          activeTab: "tab-2",
          tabs: [
            { id: "tab-1", name: "Other", rows: [row("1")] },
            { id: "tab-2", name: "Ryu", rows: [row("236P"), row("5K")] },
          ],
        },
      },
    };

    expect(getActiveRow(workspace, "street-fighter")).toEqual(row("236P"));
  });
});

describe("setActiveRow", () => {
  it("creates a 'Scratch' tab for the first row of a game, without touching the input", () => {
    const before = emptyWorkspace();

    const after = setActiveRow(before, "street-fighter", row("236P"));

    expect(before.games).toEqual({});
    expect(after.games["street-fighter"]).toEqual({
      activeTab: "tab-1",
      tabs: [{ id: "tab-1", name: "Scratch", rows: [row("236P")] }],
    });
  });

  it("replaces only the first row of the active tab", () => {
    const workspace: Workspace = {
      ...emptyWorkspace(),
      games: {
        "street-fighter": {
          activeTab: "tab-2",
          tabs: [
            { id: "tab-1", name: "Other", rows: [row("1")] },
            { id: "tab-2", name: "Ryu", rows: [row("236P"), row("5K")] },
          ],
        },
      },
    };

    const after = setActiveRow(workspace, "street-fighter", row("623K"));

    expect(after.games["street-fighter"]!.tabs).toEqual([
      { id: "tab-1", name: "Other", rows: [row("1")] },
      { id: "tab-2", name: "Ryu", rows: [row("623K"), row("5K")] },
    ]);
  });
});
