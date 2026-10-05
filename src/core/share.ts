import { resolveGame } from "./games";
import type { CustomLayers, GameRegistry } from "./games";
import { flatten, resolveRow } from "./row";
import type { Row } from "./row";
import { deserialize, serialize } from "./storage-format";
import type { FormatError } from "./storage-format";
import type { TokenDefinition } from "./types";
import { DEFAULT_GAME } from "./workspace";
import type { Workspace } from "./workspace";

/** One Tab as it travels in a link, with the saved definitions its Rows use. */
export interface SharedTab {
  gameId: string;
  tab: { name: string; rows: Row[] };
  definitions: TokenDefinition[];
}

export type ShareError = {
  code: FormatError["code"] | "invalid-link";
  message: string;
  path?: string;
};

export type ShareResult =
  | { kind: "none" }
  | {
      kind: "row";
      gameId: string;
      notation: string;
      /** The link named a game this version does not have, so the default game was used. */
      warning?: { code: "unknown-game"; name: string };
    }
  | ({ kind: "tab" } & SharedTab)
  | { kind: "error"; error: ShareError };

// Decompressed payloads are capped: a few bytes of link can otherwise expand enormously.
const MAX_LINK_CHARS = 200_000;
const MAX_PAYLOAD_BYTES = 2_000_000;

export function encodeRowLink(gameId: string, notation: string): string {
  return `#/${gameId}/${encodeURIComponent(notation)}`;
}

// ---- compressed tab links ---------------------------------------------------------
const toBase64Url = (bytes: Uint8Array) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  let text = btoa(binary).split("+").join("-").split("/").join("_");
  while (text.endsWith("=")) text = text.slice(0, -1);
  return text;
};

const fromBase64Url = (text: string): Uint8Array => {
  let base64 = text.split("-").join("+").split("_").join("/");
  while (base64.length % 4 !== 0) base64 += "=";
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

async function compress(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new CompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Inflate with a size cap; undefined when the data is invalid or too large. */
async function inflate(bytes: Uint8Array): Promise<Uint8Array | undefined> {
  try {
    const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > MAX_PAYLOAD_BYTES) {
        await reader.cancel();
        return undefined;
      }
      chunks.push(value);
    }
    const all = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      all.set(chunk, offset);
      offset += chunk.length;
    }
    return all;
  } catch {
    return undefined;
  }
}

// A shared tab travels as a one-tab workspace, so it is checked by the same validator
// as saved data: https-only links, shape errors with paths, version checks.
const toWorkspace = (shared: SharedTab): Workspace => ({
  version: 1,
  selectedGame: shared.gameId,
  customLayers: shared.definitions.length > 0 ? { [shared.gameId]: shared.definitions } : {},
  games: {
    [shared.gameId]: {
      activeTab: "tab-1",
      tabs: [{ id: "tab-1", name: shared.tab.name, rows: shared.tab.rows }],
    },
  },
});

export async function encodeTabLink(shared: SharedTab): Promise<{ hash: string; length: number }> {
  const bytes = new TextEncoder().encode(serialize(toWorkspace(shared)));
  const hash = `#/s/${toBase64Url(await compress(bytes))}`;
  return { hash, length: hash.length };
}

const damaged = (message: string): ShareResult => ({
  kind: "error",
  error: { code: "invalid-link", message },
});

async function decodeTab(payload: string): Promise<ShareResult> {
  if (payload.length > MAX_LINK_CHARS) return damaged("This link is too long to be a valid shared tab.");
  if (!/^[A-Za-z0-9_-]+$/.test(payload)) return damaged("This link is damaged (unexpected characters).");

  let compressed: Uint8Array;
  try {
    compressed = fromBase64Url(payload);
  } catch {
    return damaged("This link is damaged (it could not be read).");
  }
  const bytes = await inflate(compressed);
  if (!bytes) return damaged("This link is damaged (it could not be unpacked, or is too large).");

  const result = deserialize(new TextDecoder().decode(bytes));
  if (!result.ok) return { kind: "error", error: result.error };

  const { games, customLayers } = result.workspace;
  const gameIds = Object.keys(games);
  const game = gameIds.length === 1 ? games[gameIds[0]!] : undefined;
  if (!game || game.tabs.length !== 1) {
    return { kind: "error", error: { code: "invalid-shape", path: "games", message: "games must contain exactly one game with one tab" } };
  }
  const gameId = gameIds[0]!;
  const { name, rows } = game.tabs[0]!;
  return { kind: "tab", gameId, tab: { name, rows }, definitions: customLayers[gameId] ?? [] };
}

// ---- reading any link ---------------------------------------------------------------
// Hand-made links may contain a lone "%"; keep such text as typed instead of failing.
const safeDecode = (text: string) => {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
};

export async function decodeShare(
  hash: string,
  games: { id: string; name: string }[],
): Promise<ShareResult> {
  const segments = hash.replace(/^#/, "").split("/").filter((_, i) => i > 0);
  if (segments.length === 0 || segments[0] === "") return { kind: "none" };

  if (segments[0] === "s" && segments.length === 2) return decodeTab(segments[1]!);

  const [first, ...rest] = segments.map(safeDecode) as [string, ...string[]];
  // New links carry the game id; links from the previous version carry its display name.
  const game = games.find((g) => g.id === first) ?? games.find((g) => g.name === first);
  const notation = rest.join("/");

  if (game) return { kind: "row", gameId: game.id, notation };
  return {
    kind: "row",
    gameId: DEFAULT_GAME,
    notation,
    warning: { code: "unknown-game", name: first },
  };
}

/** A link for one Row: readable when it is just a notation, a compressed one-row tab when it carries more. */
export async function encodeRowShare(
  gameId: string,
  row: Row,
  definitions: TokenDefinition[],
): Promise<{ hash: string; length: number }> {
  if (row.customizations.length === 0 && definitions.length === 0) {
    const hash = encodeRowLink(gameId, row.notation);
    return { hash, length: hash.length };
  }
  return encodeTabLink({ gameId, tab: { name: "Shared row", rows: [row] }, definitions });
}

/** The saved definitions (in order) that these Rows actually use, directly or as a customization's base. */
export function usedDefinitions(
  rows: Row[],
  gameId: string,
  registry: GameRegistry,
  customLayers: CustomLayers,
): TokenDefinition[] {
  const layer = customLayers[gameId] ?? [];
  const game = layer.length > 0 ? resolveGame(gameId, registry, customLayers) : undefined;
  if (!game?.ok) return [];

  const saved = new Set(layer.map((d) => d.id));
  const used = new Set<string>();
  for (const row of rows) {
    const resolved = resolveRow(row, game.definitions);
    const byId = new Map(resolved.definitions.map((d) => [d.id, d]));
    for (const node of flatten(resolved.nodes)) {
      for (let d = byId.get(node.definitionId); d; d = d.basedOn ? byId.get(d.basedOn) : undefined) {
        if (saved.has(d.id)) used.add(d.id);
      }
    }
  }
  return layer.filter((d) => used.has(d.id));
}
