// Ported from the legacy React app's data files (see docs/legacy-port-notes.md).
import type { Game } from "../../core/games";

export const themsFightinHerds: Game = {
  "id": "thems-fightin-herds",
  "name": "Them's Fightin' Herds",
  "definitions": [
    {
      "id": "tfh.light-attack",
      "name": "Light Attack",
      "type": "action",
      "aliases": [
        "a"
      ],
      "display": {
        "mode": "image",
        "asset": "TFH_ActionA"
      }
    },
    {
      "id": "tfh.medium-attack",
      "name": "Medium Attack",
      "type": "action",
      "aliases": [
        "b"
      ],
      "display": {
        "mode": "image",
        "asset": "TFH_ActionB"
      }
    },
    {
      "id": "tfh.heavy-attack",
      "name": "Heavy Attack",
      "type": "action",
      "aliases": [
        "c"
      ],
      "display": {
        "mode": "image",
        "asset": "TFH_ActionC"
      }
    },
    {
      "id": "tfh.magic",
      "name": "Magic",
      "type": "action",
      "aliases": [
        "d"
      ],
      "display": {
        "mode": "image",
        "asset": "TFH_ActionD"
      }
    },
    {
      "id": "tfh.any-attack",
      "name": "Any Attack",
      "type": "action",
      "aliases": [
        "x"
      ],
      "display": {
        "mode": "image",
        "asset": "TFH_ActionAny"
      },
      "description": "Any attack button that isn't D (magic)."
    },
    {
      "id": "tfh.any-two-attack-buttons",
      "name": "Any Two Attack Buttons",
      "type": "action",
      "aliases": [
        "xx"
      ],
      "display": {
        "mode": "image",
        "asset": "TFH_ActionAnyTwo"
      },
      "description": "Any two attack buttons that aren't D (magic)."
    }
  ]
};
