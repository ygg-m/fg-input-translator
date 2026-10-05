import type { GameRegistry } from "../core/games";
import { baseDefinitions } from "./base";
import { groupDefinitions } from "./groups";
import { guiltyGear } from "./games/guilty-gear";
import { streetFighter } from "./games/street-fighter";
import { kingOfFighters } from "./games/king-of-fighters";
import { blazblue } from "./games/blazblue";
import { persona } from "./games/persona";
import { themsFightinHerds } from "./games/thems-fightin-herds";

export const registry: GameRegistry = {
  base: [...baseDefinitions, ...groupDefinitions],
  games: [guiltyGear, streetFighter, kingOfFighters, blazblue, persona, themsFightinHerds],
};
