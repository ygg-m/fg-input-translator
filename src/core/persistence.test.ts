import { describe, expect, it } from "vitest";
import { BACKUP_KEY, STORAGE_KEY, loadWorkspace, saveWorkspace } from "./persistence";
import type { StorageLike } from "./persistence";
import { deserialize, serialize } from "./storage-format";
import { emptyWorkspace } from "./workspace";

const games = [
  { id: "guilty-gear", name: "Guilty Gear" },
  { id: "street-fighter", name: "Street Fighter" },
];

const memoryStorage = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial));
  const storage: StorageLike = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
  return { storage, data };
};

const failing = (failOn: "read" | "write"): StorageLike => ({
  getItem: () => {
    if (failOn === "read") throw new DOMException("denied", "SecurityError");
    return null;
  },
  setItem: () => {
    if (failOn === "write") throw new DOMException("full", "QuotaExceededError");
  },
  removeItem: () => {},
});

describe("loadWorkspace", () => {
  it("starts empty, without notices or writes, when nothing is stored", () => {
    const { storage, data } = memoryStorage();

    expect(loadWorkspace(storage, games)).toEqual({ workspace: emptyWorkspace(), notices: [] });
    expect(data.size).toBe(0);
  });

  it("loads what was saved", () => {
    const { storage } = memoryStorage();
    const workspace = { ...emptyWorkspace(), selectedGame: "street-fighter" };
    saveWorkspace(storage, workspace);

    expect(loadWorkspace(storage, games)).toEqual({ workspace, notices: [] });
  });

  it("migrates the legacy keys once, saves the result and leaves the old keys alone", () => {
    const legacy = { rawInput: "236P", gameName: "Street Fighter", showTooltip: "true" };
    const { storage, data } = memoryStorage(legacy);

    const { workspace, notices } = loadWorkspace(storage, games);

    expect(workspace.selectedGame).toBe("street-fighter");
    expect(notices).toEqual([
      {
        code: "migrated",
        report: { sessionRow: true, importedCombos: 0, skipped: 0, listUnreadable: false },
      },
    ]);
    expect(deserialize(data.get(STORAGE_KEY)!)).toEqual({ ok: true, workspace });
    expect(data.get("rawInput")).toBe("236P");
    expect(data.get("gameName")).toBe("Street Fighter");

    expect(loadWorkspace(storage, games).notices).toEqual([]);
  });

  it("backs up unreadable or newer data, starts fresh and says so", () => {
    for (const [stored, code] of [
      ["{broken", "invalid-json"],
      [JSON.stringify({ version: 9 }), "newer-version"],
      [JSON.stringify({ version: 1, selectedGame: 5 }), "invalid-shape"],
    ] as const) {
      const { storage, data } = memoryStorage({ [STORAGE_KEY]: stored });

      const { workspace, notices } = loadWorkspace(storage, games);

      expect(workspace).toEqual(emptyWorkspace());
      expect(notices).toEqual([
        { code: "unreadable", reason: code, message: expect.any(String), backedUp: true },
      ]);
      expect(data.get(BACKUP_KEY)).toBe(stored);
      expect(data.get(STORAGE_KEY)).toBe(serialize(emptyWorkspace()));
    }
  });

  it("carries on in memory when storage cannot be read", () => {
    expect(loadWorkspace(failing("read"), games)).toEqual({
      workspace: emptyWorkspace(),
      notices: [{ code: "storage-unavailable" }],
    });
  });
});

describe("saveWorkspace", () => {
  it("reports a failed write instead of throwing", () => {
    expect(saveWorkspace(failing("write"), emptyWorkspace())).toEqual({
      ok: false,
      error: expect.stringContaining("QuotaExceededError"),
    });
    expect(saveWorkspace(memoryStorage().storage, emptyWorkspace())).toEqual({ ok: true });
  });
});
