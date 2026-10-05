import { migrateLegacy } from "./legacy-migration";
import type { MigrationReport } from "./legacy-migration";
import { deserialize, serialize } from "./storage-format";
import type { FormatError } from "./storage-format";
import { emptyWorkspace } from "./workspace";
import type { Workspace } from "./workspace";

export const STORAGE_KEY = "fgit:v1";
export const BACKUP_KEY = "fgit:v1:backup";

/** The part of localStorage the app uses, so tests can pass a fake. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type Notice =
  | { code: "migrated"; report: MigrationReport }
  | { code: "unreadable"; reason: FormatError["code"]; message: string; backedUp: boolean }
  | { code: "storage-unavailable" };

export type SaveResult = { ok: true } | { ok: false; error: string };

const describe = (error: unknown) =>
  error instanceof Error ? `${error.name}: ${error.message}` : String(error);

export function saveWorkspace(storage: StorageLike, workspace: Workspace): SaveResult {
  try {
    storage.setItem(STORAGE_KEY, serialize(workspace));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: describe(error) };
  }
}

const migrationHappened = (report: MigrationReport) =>
  report.sessionRow || report.importedCombos > 0 || report.skipped > 0 || report.listUnreadable;

/**
 * Read the workspace. Stored data that cannot be used is copied to a backup key
 * before anything replaces it; the legacy app's keys are read but never removed.
 */
export function loadWorkspace(
  storage: StorageLike,
  games: { id: string; name: string }[],
): { workspace: Workspace; notices: Notice[] } {
  try {
    const stored = storage.getItem(STORAGE_KEY);

    if (stored !== null) {
      const result = deserialize(stored);
      if (result.ok) return { workspace: result.workspace, notices: [] };

      let backedUp = true;
      try {
        storage.setItem(BACKUP_KEY, stored);
      } catch {
        backedUp = false;
      }
      const workspace = emptyWorkspace();
      // Only replace the unreadable data once a copy of it is safe.
      if (backedUp) saveWorkspace(storage, workspace);
      return {
        workspace,
        notices: [
          { code: "unreadable", reason: result.error.code, message: result.error.message, backedUp },
        ],
      };
    }

    const { workspace, report } = migrateLegacy(
      {
        rawInput: storage.getItem("rawInput"),
        gameName: storage.getItem("gameName"),
        outputList: storage.getItem("outputList"),
      },
      games,
    );
    if (!migrationHappened(report)) return { workspace, notices: [] };

    saveWorkspace(storage, workspace);
    return { workspace, notices: [{ code: "migrated", report }] };
  } catch {
    return { workspace: emptyWorkspace(), notices: [{ code: "storage-unavailable" }] };
  }
}
