import type { CustomLayers } from "./games";
import type { Row } from "./row";

export const DEFAULT_GAME = "guilty-gear";

export interface Tab {
  id: string;
  name: string;
  rows: Row[];
}

export interface GameWorkspace {
  activeTab: string;
  tabs: Tab[];
}

/** A Game the user made. Its saved definitions live in `customLayers` under its id, its Tabs in `games`. */
export interface CustomGame {
  id: string;
  name: string;
  /** The Game it is based on, built-in or custom; absent means only the shared base. */
  extends?: string;
}

/** Everything the app remembers: what is persisted, shared and exported is built from this. */
export interface Workspace {
  version: 1;
  selectedGame: string;
  customGames: CustomGame[];
  customLayers: CustomLayers;
  games: Record<string, GameWorkspace>;
}

export function emptyWorkspace(): Workspace {
  return { version: 1, selectedGame: DEFAULT_GAME, customGames: [], customLayers: {}, games: {} };
}
