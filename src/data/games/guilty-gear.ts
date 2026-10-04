// Ported from the legacy React app's data files (see docs/legacy-port-notes.md).
import type { Game } from "../../core/games";

export const guiltyGear: Game = {
  "id": "guilty-gear",
  "name": "Guilty Gear",
  "definitions": [
    {
      "id": "gg.jump-install",
      "name": "Jump Install",
      "type": "mech",
      "aliases": [
        "ji.",
        "ji"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/GGACR/Movement#Jump_Install"
      }
    },
    {
      "id": "gg.force-roman-cancel",
      "name": "Force Roman Cancel",
      "type": "mech-icon",
      "aliases": [
        "frc"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "image",
        "asset": "MechForceRomanCancel"
      },
      "description": "3 Attack Buttons, Except for D, During Valid FRC Window",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/GGACR/Mechanics#Force_Roman_Cancel"
      }
    },
    {
      "id": "gg.red-roman-cancel",
      "name": "Red Roman Cancel",
      "type": "mech-icon",
      "aliases": [
        "rrc"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "image",
        "asset": "MechRomanCancel"
      },
      "description": "3 Attack Buttons, Except for D, while the opponent is in hitstun or blockstun.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/GGXRD-R2/Controls#:~:text=Red%20when%20Roman%20Canceling%20while%20the%20opponent%20is%20in%20hitstun%20or%20blockstun.%20Costs%2050%25%20Tension.."
      }
    },
    {
      "id": "gg.yellow-roman-cancel",
      "name": "Yellow Roman Cancel",
      "type": "mech-icon",
      "aliases": [
        "yrc"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "image",
        "asset": "MechYellowRomanCancel"
      },
      "description": "3 Attack Buttons, Except for D, while the opponent is in neither hitstun nor blockstun. Occurs during start-up and early active frames.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/GGXRD-R2/Controls#:~:text=Yellow%20when%20Roman%20Canceling%20while%20the%20opponent%20is%20in%20neither%20hitstun%20nor%20blockstun.%20Occurs%20during%20start%2Dup%20and%20early%20active%20frames.%20Can%20also%20be%20performed%20in%20neutral%20or%20during%20movement%20options.%20Costs%2025%25%20Tension."
      }
    },
    {
      "id": "gg.purple-roman-cancel",
      "name": "Purple Roman Cancel",
      "type": "mech-icon",
      "aliases": [
        "prc"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "image",
        "asset": "MechPurpleRomanCancel"
      },
      "description": "3 Attack Buttons, while the opponent is in neither hitstun nor blockstun. Occurs during late active and recovery frames.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/GGXRD-R2/Controls#:~:text=Purple%20when%20Roman%20Canceling%20while%20the%20opponent%20is%20in%20neither%20hitstun%20nor%20blockstun.%20Occurs%20during%20late%20active%20and%20recovery%20frames.%20Costs%2050%25%20Tension.%0A(Some%20actions%2C%20such%20as%20specials%20with%20full%20invincibility%20on%20start%2Dup%20cannot%20be%20Yellow%20or%20Purple%20Roman%20Canceled.)"
      }
    },
    {
      "id": "gg.blue-roman-cancel",
      "name": "Blue Roman Cancel",
      "type": "mech-icon",
      "aliases": [
        "brc"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "image",
        "asset": "MechBlueRomanCancel"
      },
      "description": "3 Attack Buttons, Except for D, during neutral or basic movement.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/GGST/Controls#:~:text=Blue%20during%20neutral%20or%20basic%20movement.%20Has%20the%20longest%20slowdown%20period%2C%20allowing%20you%20to%20respond%20to%20neutral%20situations%20or%20enable%20links%20not%20normally%20possible.%20Slowdown%20caused%20by%20the%20shockwave%20still%20continues%20even%20if%20the%20opponent%20gets%20hit."
      }
    },
    {
      "id": "gg.roman-cancel",
      "name": "Roman Cancel",
      "type": "mech-icon",
      "aliases": [
        "rc"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "image",
        "asset": "MechRomanCancel"
      },
      "description": "3 Attack Buttons, Except for D, After an Attack Connects",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/GGACR/Mechanics#Roman_Cancel"
      }
    },
    {
      "id": "gg.wall-splat",
      "name": "Wall Splat",
      "type": "mech-icon",
      "aliases": [
        "WS"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "image",
        "asset": "MechRomanCancel"
      },
      "description": "3 Attack Buttons, Except for D, After an Attack Connects",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/GGACR/Mechanics#Roman_Cancel"
      }
    },
    {
      "id": "gg.punch",
      "name": "Punch",
      "type": "action",
      "aliases": [
        "P"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionPunch"
      }
    },
    {
      "id": "gg.kick",
      "name": "Kick",
      "type": "action",
      "aliases": [
        "K"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionKick"
      }
    },
    {
      "id": "gg.slash",
      "name": "Slash",
      "type": "action",
      "aliases": [
        "S"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionSlash"
      }
    },
    {
      "id": "gg.heavy-slash",
      "name": "Heavy Slash",
      "type": "action",
      "aliases": [
        "H"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionHeavySlash"
      }
    },
    {
      "id": "gg.dust",
      "name": "Dust",
      "type": "action",
      "aliases": [
        "D"
      ],
      "display": {
        "mode": "image",
        "asset": "ActionDust"
      }
    }
  ]
};
