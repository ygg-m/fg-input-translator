import type { Row, TokenChanges } from "./row";
import type { Display, GroupSyntax, MoreLink, TokenDefinition } from "./types";
import type { CustomGame, GameWorkspace, Tab, Workspace } from "./workspace";

export interface FormatError {
  code: "invalid-json" | "invalid-shape" | "newer-version";
  message: string;
  path?: string;
}

export type DeserializeResult = { ok: true; workspace: Workspace } | { ok: false; error: FormatError };

// JSON drops undefined, but a customization uses an explicit undefined to mean
// "cleared"; on disk that is stored as null.
const mapChanges = (workspace: Workspace, convert: (changes: TokenChanges) => TokenChanges): Workspace => ({
  ...workspace,
  games: Object.fromEntries(
    Object.entries(workspace.games).map(([gameId, game]) => [
      gameId,
      {
        ...game,
        tabs: game.tabs.map((tab) => ({
          ...tab,
          rows: tab.rows.map((row) => ({
            ...row,
            customizations: row.customizations.map((c) => ({ ...c, changes: convert(c.changes) })),
          })),
        })),
      },
    ]),
  ),
});

export const undefinedToNull = (changes: TokenChanges) =>
  Object.fromEntries(
    Object.entries(changes).map(([key, value]) => [key, value === undefined ? null : value]),
  ) as TokenChanges;

export const nullToUndefined = (changes: TokenChanges) =>
  Object.fromEntries(
    Object.entries(changes).map(([key, value]) => [key, value === null ? undefined : value]),
  ) as TokenChanges;

export function serialize(workspace: Workspace): string {
  return JSON.stringify(mapChanges(workspace, undefinedToNull));
}

// ---- validation -------------------------------------------------------------
// Stored, shared and imported data is untrusted: the first problem found is
// reported with the path to it, and nothing is applied.

export class Invalid extends Error {
  constructor(
    readonly path: string,
    message: string,
  ) {
    super(message);
  }
}

export const join = (path: string, key: string) => (path === "" ? key : `${path}.${key}`);
export const at = (path: string, index: number) => `${path}[${index}]`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const record = (value: unknown, path: string): Record<string, unknown> => {
  if (!isRecord(value)) throw new Invalid(path, "must be an object");
  return value;
};
export const list = (value: unknown, path: string): unknown[] => {
  if (!Array.isArray(value)) throw new Invalid(path, "must be a list");
  return value;
};
export const string = (value: unknown, path: string): string => {
  if (typeof value !== "string") throw new Invalid(path, "must be text");
  return value;
};
const optional = <T>(value: unknown, path: string, check: (v: unknown, p: string) => T): T | undefined =>
  value === undefined ? undefined : check(value, path);

function checkLink(value: unknown, path: string): MoreLink {
  const link = record(value, path);
  const name = string(link.name, join(path, "name"));
  const url = string(link.url, join(path, "url"));
  try {
    if (new URL(url).protocol !== "https:") throw new Error("not https");
  } catch {
    throw new Invalid(join(path, "url"), "must be a full https:// address");
  }
  return { name, url };
}

function checkDisplay(value: unknown, path: string): Display {
  const display = record(value, path);
  const mode = display.mode;
  if (mode === "label") return { mode };
  if (mode === "text") return { mode, text: string(display.text, join(path, "text")) };
  if (mode === "image") {
    const asset = string(display.asset, join(path, "asset"));
    const raw = optional(display.transform, join(path, "transform"), record);
    if (raw === undefined) return { mode, asset };
    const transformPath = join(path, "transform");
    const transform: { rotate?: number; flipX?: boolean } = {};
    if (raw.rotate !== undefined) {
      if (typeof raw.rotate !== "number") throw new Invalid(join(transformPath, "rotate"), "must be a number");
      transform.rotate = raw.rotate;
    }
    if (raw.flipX !== undefined) {
      if (typeof raw.flipX !== "boolean") throw new Invalid(join(transformPath, "flipX"), "must be true or false");
      transform.flipX = raw.flipX;
    }
    return { mode, asset, transform };
  }
  throw new Invalid(join(path, "mode"), "must be image, text or label");
}

function checkGroup(value: unknown, path: string): GroupSyntax {
  const group = record(value, path);
  if ("separator" in group) return { separator: string(group.separator, join(path, "separator")) };
  const syntax: GroupSyntax = {
    open: string(group.open, join(path, "open")),
    close: string(group.close, join(path, "close")),
  };
  if (group.literal !== undefined) {
    if (typeof group.literal !== "boolean") throw new Invalid(join(path, "literal"), "must be true or false");
    syntax.literal = group.literal;
  }
  if (group.param !== undefined) {
    const param = record(group.param, join(path, "param"));
    if (param.kind !== "digits") throw new Invalid(join(path, "param.kind"), "must be digits");
    syntax.param = { name: string(param.name, join(path, "param.name")), kind: "digits" };
  }
  return syntax;
}

function checkBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") throw new Invalid(path, "must be true or false");
  return value;
}

export function checkDefinition(value: unknown, path: string): TokenDefinition {
  const raw = record(value, path);
  const definition: TokenDefinition = {
    id: string(raw.id, join(path, "id")),
    name: string(raw.name, join(path, "name")),
    aliases: list(raw.aliases, join(path, "aliases")).map((a, i) => string(a, at(join(path, "aliases"), i))),
  };
  const set = <K extends keyof TokenDefinition>(key: K, check: (v: unknown, p: string) => TokenDefinition[K]) => {
    const checked = optional(raw[key], join(path, key), check);
    if (checked !== undefined) definition[key] = checked;
  };
  set("type", string);
  set("display", checkDisplay);
  set("label", string);
  set("description", string);
  set("more", checkLink);
  set("basedOn", string);
  set("saved", checkBoolean);
  set("ignoreCase", checkBoolean);
  set("group", checkGroup);
  return definition;
}

function checkChanges(value: unknown, path: string): TokenChanges {
  const raw = record(value, path);
  const changes: Record<string, unknown> = {};
  const set = (key: string, check: (v: unknown, p: string) => unknown) => {
    const field = raw[key];
    if (field === undefined) return;
    changes[key] = field === null ? null : check(field, join(path, key));
  };
  set("name", string);
  set("display", checkDisplay);
  set("label", string);
  set("description", string);
  set("more", checkLink);
  return changes as TokenChanges;
}

export function checkRow(value: unknown, path: string) {
  const raw = record(value, path);
  const row: { notation: string; label?: string; customizations: Workspace["games"][string]["tabs"][number]["rows"][number]["customizations"] } = {
    notation: string(raw.notation, join(path, "notation")),
    customizations: [],
  };
  const label = optional(raw.label, join(path, "label"), string);
  if (label !== undefined) row.label = label;

  const customizationsPath = join(path, "customizations");
  row.customizations = list(raw.customizations, customizationsPath).map((item, i) => {
    const cPath = at(customizationsPath, i);
    const c = record(item, cPath);
    const anchor = record(c.anchor, join(cPath, "anchor"));
    const occurrence = anchor.occurrence;
    if (typeof occurrence !== "number" || !Number.isInteger(occurrence) || occurrence < 0) {
      throw new Invalid(join(cPath, "anchor.occurrence"), "must be a whole number, 0 or more");
    }
    return {
      anchor: { text: string(anchor.text, join(cPath, "anchor.text")), occurrence },
      basedOn: string(c.basedOn, join(cPath, "basedOn")),
      changes: checkChanges(c.changes, join(cPath, "changes")),
    };
  });
  return row;
}

function checkGame(value: unknown, path: string): GameWorkspace {
  const raw = record(value, path);
  const activeTab = string(raw.activeTab, join(path, "activeTab"));
  const tabsPath = join(path, "tabs");
  const seen = new Set<string>();

  const tabs: Tab[] = list(raw.tabs, tabsPath).map((item, i) => {
    const tabPath = at(tabsPath, i);
    const tab = record(item, tabPath);
    const id = string(tab.id, join(tabPath, "id"));
    if (seen.has(id)) throw new Invalid(join(tabPath, "id"), "must be unique within the game");
    seen.add(id);
    const rowsPath = join(tabPath, "rows");
    return {
      id,
      name: string(tab.name, join(tabPath, "name")),
      rows: list(tab.rows, rowsPath).map((r, j) => checkRow(r, at(rowsPath, j))),
    };
  });

  if (tabs.length > 0 && !seen.has(activeTab)) {
    throw new Invalid(join(path, "activeTab"), "must be the id of one of the tabs");
  }
  return { activeTab, tabs };
}

/** The user's games: a name, an optional parent, and an id that no other custom game uses. */
export function checkCustomGames(value: unknown, path: string): CustomGame[] {
  const seen = new Set<string>();
  return list(value, path).map((item, i) => {
    const gamePath = at(path, i);
    const raw = record(item, gamePath);
    const id = string(raw.id, join(gamePath, "id"));
    if (seen.has(id)) throw new Invalid(join(gamePath, "id"), "must be unique");
    seen.add(id);
    const parent = raw.extends === undefined ? undefined : string(raw.extends, join(gamePath, "extends"));
    return {
      id,
      name: string(raw.name, join(gamePath, "name")),
      ...(parent !== undefined ? { extends: parent } : {}),
    };
  });
}

function checkWorkspace(value: unknown): Workspace {
  const raw = record(value, "workspace");
  if (raw.version !== 1) throw new Invalid("version", "must be 1");

  // Data saved before custom games existed has no such list.
  const customGames = raw.customGames === undefined ? [] : checkCustomGames(raw.customGames, "customGames");

  const customLayers = Object.fromEntries(
    Object.entries(record(raw.customLayers, "customLayers")).map(([gameId, layer]) => {
      const layerPath = join("customLayers", gameId);
      return [gameId, list(layer, layerPath).map((d, i) => checkDefinition(d, at(layerPath, i)))];
    }),
  );
  const games = Object.fromEntries(
    Object.entries(record(raw.games, "games")).map(([gameId, game]) => [
      gameId,
      checkGame(game, join("games", gameId)),
    ]),
  );

  return {
    version: 1,
    selectedGame: string(raw.selectedGame, "selectedGame"),
    customGames,
    customLayers,
    games,
  };
}

export function deserialize(text: string): DeserializeResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: { code: "invalid-json", message: "The saved data is not valid JSON." } };
  }

  if (isRecord(parsed) && typeof parsed.version === "number" && parsed.version > 1) {
    return {
      ok: false,
      error: { code: "newer-version", message: "This data was made by a newer version of the app." },
    };
  }

  try {
    return { ok: true, workspace: mapChanges(checkWorkspace(parsed), nullToUndefined) };
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

/** A Row ready for JSON: a cleared field (explicit undefined) is written as null. */
export const encodeRow = (row: Row): Row => ({
  ...row,
  customizations: row.customizations.map((c) => ({ ...c, changes: undefinedToNull(c.changes) })),
});

/** The reverse of encodeRow, for a Row that has been validated. */
export const decodeRow = (row: Row): Row => ({
  ...row,
  customizations: row.customizations.map((c) => ({ ...c, changes: nullToUndefined(c.changes) })),
});
