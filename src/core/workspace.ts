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

/** Everything the app remembers: what is persisted, shared and exported is built from this. */
export interface Workspace {
  version: 1;
  selectedGame: string;
  customLayers: CustomLayers;
  games: Record<string, GameWorkspace>;
}

export function emptyWorkspace(): Workspace {
  return { version: 1, selectedGame: DEFAULT_GAME, customLayers: {}, games: {} };
}
