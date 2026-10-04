// Ported from the legacy React app's data files (see docs/legacy-port-notes.md).
import type { Game } from "../../core/games";

export const kingOfFighters: Game = {
  "id": "king-of-fighters",
  "name": "The King of Fighters",
  "definitions": [
    {
      "id": "kof.throw",
      "name": "Throw",
      "type": "mech",
      "aliases": [
        "cl.6c",
        "cl.6d",
        "cl.4c",
        "cl.4d"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "A fast close-range move that cannot be blocked. Check a guide for the game to see the throw inputs available.",
      "more": {
        "name": "Glossary",
        "url": "https://glossary.infil.net/?t=Throw"
      }
    },
    {
      "id": "kof.max-mode",
      "name": "Max Mode",
      "aliases": [
        "bc",
        "BC"
      ],
      "display": {
        "mode": "label"
      },
      "description": "An install possible in many different King of Fighters titles that can lead to highly damaging combos.",
      "more": {
        "name": "Glossary",
        "url": "https://glossary.infil.net/?t=Max%20Mode"
      }
    },
    {
      "id": "kof.guard-cancel-blowback",
      "name": "Guard Cancel Blowback",
      "aliases": [
        "gccd",
        "GCCD"
      ],
      "display": {
        "mode": "label"
      },
      "description": "Press C + D while in blockstun. It cancels the blockstun by a blow that knocks down the opponent. The Guard Cancel CD has short frames of invincibility at startup, but has a recovery.",
      "more": {
        "name": "Dream Cancel",
        "url": "https://www.dreamcancel.com/wiki/The_King_of_Fighters_2002_UM/Defense#:~:text=Guard%20Cancel%20(GC)-,Guard%20Cancel%20CD%2C%20GCCD%20(aka%20GC%20Blowback%2C%20Guard%20Attack,startup%2C%20but%20has%20a%20recovery."
      }
    },
    {
      "id": "kof.guard-cancel-roll",
      "name": "Guard Cancel Roll",
      "aliases": [
        "gcab",
        "GCAB"
      ],
      "display": {
        "mode": "label"
      },
      "description": "By pressing only A + B or back + A + B back (to Guard Cancel Roll backwards), while in blockstun, it is possible to roll forward or backward. This roll is completely invincible and unthrowable, and has no frame of recovery.",
      "more": {
        "name": "Dream Cancel",
        "url": "https://www.dreamcancel.com/wiki/The_King_of_Fighters_2002_UM/Defense#:~:text=end%20of%20it.-,Guard%20Cancel%20AB%2C%20GCRoll%20(Break%20Roll/Guard%20Roll/Guard%20Cancel,while%20in%20blockstun%2C%20it%20is%20possible%20to%20roll%20forward%20or%20backward.,-This%20roll%20is"
      }
    },
    {
      "id": "kof.blowback",
      "name": "Blowback",
      "aliases": [
        "cd",
        "CD"
      ],
      "display": {
        "mode": "label"
      },
      "description": "A technique in the King of Fighters series that lets you take an action while blocking for 1 bar of super meter.",
      "more": {
        "name": "Glossary",
        "url": "https://glossary.infil.net/?t=Guard%20Cancel"
      }
    },
    {
      "id": "kof.desperation-move",
      "name": "Desperation Move",
      "aliases": [
        "dm",
        "DM"
      ],
      "display": {
        "mode": "label"
      },
      "description": "What most King of Fighters games call their supers. It costs 1 super meter level to use it.",
      "more": {
        "name": "Glossary",
        "url": "https://glossary.infil.net/?t=Desperation%20Move"
      }
    },
    {
      "id": "kof.super-desperation",
      "name": "Super Desperation",
      "aliases": [
        "sdm",
        "SDM"
      ],
      "display": {
        "mode": "label"
      },
      "description": "A more powerful Desperation Move, wich are the supers from King of Fighters. It costs 3 super meter levels to use it.",
      "more": {
        "name": "Glossary",
        "url": "https://glossary.infil.net/?t=Neo%20Max"
      }
    },
    {
      "id": "kof.max2-cl-max",
      "name": "MAX2 / Clímax",
      "aliases": [
        "hsdm",
        "clímax",
        "climax"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "The most powerful Desperation Move. Introduced in King of Fighters 2002. You need to be at least 30% health to cast it and it costs 3 super meter levels to use it.",
      "more": {
        "name": "SNK Wiki",
        "url": "https://snk.fandom.com/wiki/MAX2"
      }
    },
    {
      "id": "kof.super-cancel",
      "name": "Super Cancel",
      "aliases": [
        "sc"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      }
    },
    {
      "id": "kof.shatter-strike",
      "name": "Shatter Strike",
      "aliases": [
        "ss"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "When used on opponents, it will cause to crumple. When used on aerial opponents, they will be sent to the back wall, and will cause a wall bounce. Regardless of how it lands, it can lead to additional follow-ups or combos if successful.",
      "more": {
        "name": "SNK Wiki",
        "url": "https://snk.fandom.com/wiki/Shatter_Strike"
      }
    },
    {
      "id": "kof.roll",
      "name": "Roll",
      "aliases": [
        "ab",
        "AB"
      ],
      "display": {
        "mode": "label"
      },
      "description": "4AB or 6AB. Pressing AB in neutral defaults to a forward roll."
    },
    {
      "id": "kof.free-cancellable-in",
      "name": "Free Cancellable In...",
      "aliases": [
        "fci",
        "FCI"
      ],
      "display": {
        "mode": "label"
      }
    },
    {
      "id": "kof.free-cancellable-out-of",
      "name": "Free Cancellable Out of...",
      "aliases": [
        "fco",
        "FCO"
      ],
      "display": {
        "mode": "label"
      }
    },
    {
      "id": "kof.on-the-ground",
      "name": "On the Ground",
      "aliases": [
        "otg"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "A move that may hit a knocked down opponent."
    },
    {
      "id": "kof.hiper-hop",
      "name": "Hyper Hop",
      "aliases": [
        "hh."
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "bb"
    },
    {
      "id": "kof.hop",
      "name": "Hop",
      "aliases": [
        "h."
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "aa"
    },
    {
      "id": "kof.light-punch",
      "name": "Light Punch",
      "type": "action",
      "aliases": [
        "A"
      ],
      "display": {
        "mode": "image",
        "asset": "SNK_ActionAPunch"
      }
    },
    {
      "id": "kof.light-kick",
      "name": "Light Kick",
      "type": "action",
      "aliases": [
        "B"
      ],
      "display": {
        "mode": "image",
        "asset": "SNK_ActionBKick"
      }
    },
    {
      "id": "kof.heavy-punch",
      "name": "Heavy Punch",
      "type": "action",
      "aliases": [
        "C"
      ],
      "display": {
        "mode": "image",
        "asset": "SNK_ActionCPunch"
      }
    },
    {
      "id": "kof.heavy-kick",
      "name": "Heavy Kick",
      "type": "action",
      "aliases": [
        "D"
      ],
      "display": {
        "mode": "image",
        "asset": "SNK_ActionDKick"
      }
    },
    {
      "id": "kof.any-kick",
      "name": "Any Kick",
      "type": "action",
      "aliases": [
        "K"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionAnyKick"
      }
    },
    {
      "id": "kof.any-punch",
      "name": "Any Punch",
      "type": "action",
      "aliases": [
        "P"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionAnyPunch"
      }
    }
  ]
};
