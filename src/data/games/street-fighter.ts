// Ported from the legacy React app's data files (see docs/legacy-port-notes.md).
import type { Game } from "../../core/games";

export const streetFighter: Game = {
  "id": "street-fighter",
  "name": "Street Fighter",
  "definitions": [
    {
      "id": "sf.light-punch",
      "name": "Light Punch",
      "type": "action",
      "aliases": [
        "lp",
        "LP"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionLightPunch"
      }
    },
    {
      "id": "sf.medium-punch",
      "name": "Medium Punch",
      "type": "action",
      "aliases": [
        "mp",
        "MP"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionMediumPunch"
      }
    },
    {
      "id": "sf.heavy-punch",
      "name": "Heavy Punch",
      "type": "action",
      "aliases": [
        "hp",
        "HP"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionHeavyPunch"
      }
    },
    {
      "id": "sf.any-punch",
      "name": "Any Punch",
      "type": "action",
      "aliases": [
        "p",
        "P"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionAnyPunch"
      }
    },
    {
      "id": "sf.light-kick",
      "name": "Light Kick",
      "type": "action",
      "aliases": [
        "lk",
        "LK"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionLightKick"
      }
    },
    {
      "id": "sf.medium-kick",
      "name": "Medium Kick",
      "type": "action",
      "aliases": [
        "mk",
        "MK"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionMediumKick"
      }
    },
    {
      "id": "sf.heavy-kick",
      "name": "Heavy Kick",
      "type": "action",
      "aliases": [
        "hk",
        "HK"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionHeavyKick"
      }
    },
    {
      "id": "sf.any-kick",
      "name": "Any Kick",
      "type": "action",
      "aliases": [
        "k",
        "K"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionAnyKick"
      }
    }
  ]
};
