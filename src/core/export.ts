import type { GameRegistry } from "./games";
import type { Row } from "./row";
import { usedDefinitions } from "./share";
import {
  Invalid,
  at,
  checkDefinition,
  checkRow,
  decodeRow,
  encodeRow,
  join,
  list,
  record,
  string,
} from "./storage-format";
import type { TokenDefinition } from "./types";
import type { Workspace } from "./workspace";

export const EXPORT_FORMAT = "fg-input-translator";

/** What an export file holds: some tabs, and the saved definitions chosen to go with them. */
export interface ExportEnvelope {
  format: typeof EXPORT_FORMAT;
  version: 1;
  tabs: { gameId: string; tab: { name: string; rows: Row[] } }[];
  definitions: Record<string, TokenDefinition[]>;
}

export interface ExportSelection {
  tabs: { gameId: string; tabId: string }[];
  definitions: { gameId: string; id: string }[];
}

export function buildExport(workspace: Workspace, selection: ExportSelection): ExportEnvelope {
  const tabs: ExportEnvelope["tabs"] = [];
  for (const { gameId, tabId } of selection.tabs) {
    const tab = workspace.games[gameId]?.tabs.find((t) => t.id === tabId);
    if (tab) tabs.push({ gameId, tab: { name: tab.name, rows: tab.rows } });
  }

  const definitions: ExportEnvelope["definitions"] = {};
  for (const { gameId, id } of selection.definitions) {
    const definition = workspace.customLayers[gameId]?.find((d) => d.id === id);
    if (definition) (definitions[gameId] ??= []).push(definition);
  }

  return { format: EXPORT_FORMAT, version: 1, tabs, definitions };
}

export interface ExportError {
  code: "invalid-json" | "invalid-shape" | "newer-version" | "not-an-export" | "too-large";
  message: string;
  path?: string;
}

export type ParseExportResult = { ok: true; envelope: ExportEnvelope } | { ok: false; error: ExportError };

const MAX_EXPORT_CHARS = 5_000_000;

/** Readable JSON, 2-space indented, so it is easy to paste into a chat or an issue. */
export function serializeExport(envelope: ExportEnvelope): string {
  return JSON.stringify(
    {
      format: envelope.format,
      version: envelope.version,
      tabs: envelope.tabs.map(({ gameId, tab }) => ({
        gameId,
        tab: { name: tab.name, rows: tab.rows.map(encodeRow) },
      })),
      definitions: envelope.definitions,
    },
    null,
    2,
  );
}

const FENCE = "```";

// An export pasted from a chat or an issue may sit inside a fenced code block.
function firstFencedBlock(text: string): string | undefined {
  const open = text.indexOf(FENCE);
  if (open === -1) return undefined;
  const bodyStart = text.indexOf("\n", open);
  if (bodyStart === -1) return undefined;
  const close = text.indexOf(FENCE, bodyStart);
  return close === -1 ? undefined : text.slice(bodyStart + 1, close);
}

function checkEnvelope(raw: Record<string, unknown>): ExportEnvelope {
  if (raw.version !== 1) throw new Invalid("version", "must be 1");

  const tabs = list(raw.tabs, "tabs").map((item, i) => {
    const path = at("tabs", i);
    const entry = record(item, path);
    const tab = record(entry.tab, join(path, "tab"));
    const rowsPath = join(path, "tab.rows");
    return {
      gameId: string(entry.gameId, join(path, "gameId")),
      tab: {
        name: string(tab.name, join(path, "tab.name")),
        rows: list(tab.rows, rowsPath).map((r, j) => decodeRow(checkRow(r, at(rowsPath, j)))),
      },
    };
  });

  const definitions = Object.fromEntries(
    Object.entries(record(raw.definitions, "definitions")).map(([gameId, layer]) => {
      const layerPath = join("definitions", gameId);
      return [gameId, list(layer, layerPath).map((d, i) => checkDefinition(d, at(layerPath, i)))];
    }),
  );

  return { format: EXPORT_FORMAT, version: 1, tabs, definitions };
}

export function parseExport(text: string): ParseExportResult {
  if (text.length > MAX_EXPORT_CHARS) {
    return { ok: false, error: { code: "too-large", message: "This text is too large to be an export." } };
  }

  let parsed: unknown;
  const attempt = (source: string) => {
    try {
      parsed = JSON.parse(source.trim());
      return true;
    } catch {
      return false;
    }
  };
  if (!attempt(text)) {
    const fenced = firstFencedBlock(text);
    if (fenced === undefined || !attempt(fenced)) {
      return { ok: false, error: { code: "invalid-json", message: "This text is not valid JSON." } };
    }
  }

  const notAnExport: ParseExportResult = {
    ok: false,
    error: { code: "not-an-export", message: "This is not an export from this app." },
  };
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return notAnExport;
  const raw = parsed as Record<string, unknown>;
  if (raw.format !== EXPORT_FORMAT) return notAnExport;

  if (typeof raw.version === "number" && raw.version > 1) {
    return {
      ok: false,
      error: { code: "newer-version", message: "This export was made by a newer version of the app." },
    };
  }

  try {
    return { ok: true, envelope: checkEnvelope(raw) };
  } catch (error) {
    if (error instanceof Invalid) {
      return {
        ok: false,
        error: { code: "invalid-shape", path: error.path, message: `${error.path} ${error.message}` },
      };
    }
    throw error;
  }
}

/** What the export dialog starts with: the game's tabs and the saved definitions their rows use. */
export function defaultSelection(
  workspace: Workspace,
  registry: GameRegistry,
  gameId: string,
): ExportSelection {
  const tabs = workspace.games[gameId]?.tabs ?? [];
  const used = usedDefinitions(
    tabs.flatMap((tab) => tab.rows),
    gameId,
    registry,
    workspace.customLayers,
  );
  return {
    tabs: tabs.map((tab) => ({ gameId, tabId: tab.id })),
    definitions: used.map((definition) => ({ gameId, id: definition.id })),
  };
}
