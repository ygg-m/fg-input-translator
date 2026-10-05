// Ported from the legacy React app's data files (see docs/legacy-port-notes.md).
import type { Game } from "../../core/games";

export const blazblue: Game = {
  "id": "blazblue",
  "name": "Blazblue",
  "definitions": [
    {
      "id": "bb.rapid-cancel",
      "name": "Rapid Cancel",
      "aliases": [
        "RC"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "ABC when an attack lands. Rapid Cancels cancels your attack and returns you to a neutral state. This can be used to extend combos, create offensive situations, or reduce the risk of other situations.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Controls#:~:text=Rapid%20Cancel%20COSTS,of%20other%20situations."
      }
    },
    {
      "id": "bb.overdrive-cancel",
      "name": "Overdrive Cancel",
      "aliases": [
        "ODc",
        "cOD",
        "OD Cancel"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "You can cancel into Overdrive almost anytime you can cancel into a special move. While this is indeed very powerful, cancelling into Overdrive cuts your Overdrive time by half, so use your time wisely!",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Offense#Overdrive_Cancel"
      }
    },
    {
      "id": "bb.overdrive",
      "name": "Overdrive",
      "aliases": [
        "OD"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "ABCD while standing or airborne. Overdrive requires a full Burst Gauge to activate. Once activated, Overdrive places the character in a temporarily powered up state, which varies by character.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Offense#Overdrive"
      }
    },
    {
      "id": "bb.exceed-accel",
      "name": "Exceed Accel",
      "aliases": [
        "EA"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "5ABCD during Overdrive. It's a cinematic super that has a handful of unique properties.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Offense#Exceed_Accel"
      }
    },
    {
      "id": "bb.weak-tipper",
      "name": "Weak / Tipper",
      "aliases": [
        "!"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "For Azrael: The move before must consume a weakpoint. For Mai Natsume: Move must be made during her command dash (236). "
    },
    {
      "id": "bb.heat-up-lv0",
      "name": "Heat Up Lv0",
      "aliases": [
        "H0"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "By holding down the D button, Bullet creates a growing orange circle around her. Bullet notation. If the opponent is inside this circle, release the D button to launch Bullet at the opponent. Bullet gains a Heat Up level any time she lands hits with her Drive. At Heat Level 1 (H1) she has an orange silhouette, at Heat Level 2 (H2) she has a red silhouette. Bullet starts every round with Heat Level 0 (H0).",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Bullet#:~:text=By%20holding%20down%20the%20D%20button%2C%20Bullet%20creates%20a%20growing%20orange%20circle%20around%20her.%20If%20the%20opponent%20is%20inside%20this%20circle%2C%20release%20the%20D%20button%20to%20launch%20Bullet%20at%20the%20opponent.%20If%20the%20opponent%20is%20outside%20the%20ring%2C%20releasing%20D%20will%20cause%20her%20to%20leave%20the%20stance."
      }
    },
    {
      "id": "bb.heat-up-lv1",
      "name": "Heat Up Lv1",
      "aliases": [
        "H1"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "By holding down the D button, Bullet creates a growing orange circle around her. Bullet notation. If the opponent is inside this circle, release the D button to launch Bullet at the opponent. Bullet gains a Heat Up level any time she lands hits with her Drive. At Heat Level 1 (H1) she has an orange silhouette, at Heat Level 2 (H2) she has a red silhouette. Bullet starts every round with Heat Level 0 (H0).",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Bullet#:~:text=By%20holding%20down%20the%20D%20button%2C%20Bullet%20creates%20a%20growing%20orange%20circle%20around%20her.%20If%20the%20opponent%20is%20inside%20this%20circle%2C%20release%20the%20D%20button%20to%20launch%20Bullet%20at%20the%20opponent.%20If%20the%20opponent%20is%20outside%20the%20ring%2C%20releasing%20D%20will%20cause%20her%20to%20leave%20the%20stance."
      }
    },
    {
      "id": "bb.heat-up-lv2",
      "name": "Heat Up Lv2",
      "aliases": [
        "H2"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "By holding down the D button, Bullet creates a growing orange circle around her. Bullet notation. If the opponent is inside this circle, release the D button to launch Bullet at the opponent. Bullet gains a Heat Up level any time she lands hits with her Drive. At Heat Level 1 (H1) she has an orange silhouette, at Heat Level 2 (H2) she has a red silhouette. Bullet starts every round with Heat Level 0 (H0).",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Bullet#:~:text=By%20holding%20down%20the%20D%20button%2C%20Bullet%20creates%20a%20growing%20orange%20circle%20around%20her.%20If%20the%20opponent%20is%20inside%20this%20circle%2C%20release%20the%20D%20button%20to%20launch%20Bullet%20at%20the%20opponent.%20If%20the%20opponent%20is%20outside%20the%20ring%2C%20releasing%20D%20will%20cause%20her%20to%20leave%20the%20stance."
      }
    },
    {
      "id": "bb.backfire",
      "name": "Backfire",
      "aliases": [
        "bf"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "When using Lance Quiche (214C) enhanced, also produces a backfire behind Minerva that juggles and drags opponents behind Celica. Celica A. Mercury notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Celica_A._Mercury#Lance_Quiche"
      }
    },
    {
      "id": "bb.mantenbou",
      "name": "Mantenbou",
      "aliases": [
        "m"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Refers to an attack while holding the Mantenbou. Litchi Faye Ling notation. Mantenbou is a mode changing mechanic that allows her to switch between fighting with Mantenbou, her staff, and placing it on the ground to fight empty-handed. Litchi has access to different attacks when she is switching between these two modes.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#:~:text=Drive%3A%20Mantenbou,with%20Mantenbou%20equipped."
      }
    },
    {
      "id": "bb.enhanced",
      "name": "Enhanced",
      "aliases": [
        "En"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Enhanced version of a special must be used."
    },
    {
      "id": "bb.empty-handed",
      "name": "Empty Handed",
      "aliases": [
        "e"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Refers to an attack while empty handed. Litchi Faye Ling notation. Mantenbou is a mode changing mechanic that allows her to switch between fighting with Mantenbou, her staff, and placing it on the ground to fight empty-handed. Litchi has access to different attacks when she is switching between these two modes.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#:~:text=Drive%3A%20Mantenbou,with%20Mantenbou%20equipped."
      }
    },
    {
      "id": "bb.staff-1",
      "name": "Staff 1",
      "aliases": [
        "Staff1"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "The first hit of the staff launch. Litchi Faye Ling notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Staff_Launch"
      }
    },
    {
      "id": "bb.staff-2",
      "name": "Staff 2",
      "aliases": [
        "Staff2"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "The second hit of the staff launch. Litchi Faye Ling notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Staff_Launch"
      }
    },
    {
      "id": "bb.tsubame-gaeshi",
      "name": "Tsubame Gaeshi",
      "aliases": [
        "Tsubame",
        "DP"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Tsubame Gaeshi (623Dm). Litchi Faye Ling notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Tsubame_Gaeshi"
      }
    },
    {
      "id": "bb.itsuu-a",
      "name": "Itsuu A",
      "aliases": [
        "ItsuuA"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "41236A to cancel stance. Litchi Faye Ling notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Straight_Through_(Itsuu)"
      }
    },
    {
      "id": "bb.itsuu-b",
      "name": "Itsuu B",
      "aliases": [
        "ItsuuB"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "41236B to cancel stance. Litchi Faye Ling notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Straight_Through_(Itsuu)"
      }
    },
    {
      "id": "bb.itsuu-c",
      "name": "Itsuu C",
      "aliases": [
        "ItsuuC"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "41236C to cancel stance. Litchi Faye Ling notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Straight_Through_(Itsuu)"
      }
    },
    {
      "id": "bb.itsuu-d",
      "name": "Itsuu D",
      "aliases": [
        "ItsuuD"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "41236D to cancel stance. Litchi Faye Ling notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Straight_Through_(Itsuu)"
      }
    },
    {
      "id": "bb.ikkitsuukan",
      "name": "Ikkitsuukan",
      "aliases": [
        "Ikkitsuukan"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "41236A/B/C/D to cancel stance. Litchi Faye Ling notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Straight_Through_(Itsuu)"
      }
    },
    {
      "id": "bb.4-kote",
      "name": "4 Kote",
      "aliases": [
        "4Kote"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Kote Gaeshi 421D. Litchi Faye Ling notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Kote_Gaeshi"
      }
    },
    {
      "id": "bb.6-kote",
      "name": "6 Kote",
      "aliases": [
        "6Kote"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Kote Gaeshi 623D. Litchi Faye Ling notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Kote_Gaeshi"
      }
    },
    {
      "id": "bb.kote-gaeshi",
      "name": "Kote Gaeshi",
      "aliases": [
        "Kote Gaeshi"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Kote Gaeshi 623D. Litchi Faye Ling notation.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Kote_Gaeshi"
      }
    },
    {
      "id": "bb.overdrive-2",
      "name": "Overdrive",
      "aliases": [
        "Daisharin(Overdrive)"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "ABCD while standing or airborne. Overdrive requires a full Burst Gauge to activate. Once activated, Overdrive places the character in a temporarily powered up state, which varies by character.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Offense#Overdrive"
      }
    },
    {
      "id": "bb.whiff",
      "name": "Whiff",
      "aliases": [
        "x"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Whiff (not hit) the move before."
    },
    {
      "id": "bb.banishing-fang-bash",
      "name": "Banishing Fang: Bash",
      "aliases": [
        "236BBB"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Long notation: 236B~236B~236B. Notation used to shorten the Rekka from Naoto Kurogane that ends with 236B.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Naoto_Kurogane#Banishing_Fang:_Bash"
      }
    },
    {
      "id": "bb.banishing-fang-raid",
      "name": "Banishing Fang: Raid",
      "aliases": [
        "236BBC"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Long notation: 236B~236B~236C. Notation used to shorten the Rekka from Naoto Kurogane that ends with 236C.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Naoto_Kurogane#Banishing_Fang:_Raid"
      }
    },
    {
      "id": "bb.drive-attack",
      "name": "Drive Attack",
      "aliases": [
        "d."
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Noel Vermillion's Drives function in two different ways. Upon pressing the D button, Noel uses a Drive attack that is basically just a normal attack. Afterwards however, Noel's normal moves are effectively replaced with a different set of normal moves until she returns to neutral again.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/BBCF/Noel_Vermillion#:~:text=Drive%3A%20Chain%20Revolver,to%20neutral%20again."
      }
    },
    {
      "id": "bb.a",
      "name": "A",
      "type": "action",
      "aliases": [
        "A"
      ],
      "display": {
        "mode": "image",
        "asset": "Blazblue_ActionA"
      }
    },
    {
      "id": "bb.b",
      "name": "B",
      "type": "action",
      "aliases": [
        "B"
      ],
      "display": {
        "mode": "image",
        "asset": "Blazblue_ActionB"
      }
    },
    {
      "id": "bb.c",
      "name": "C",
      "type": "action",
      "aliases": [
        "C"
      ],
      "display": {
        "mode": "image",
        "asset": "Blazblue_ActionC"
      }
    },
    {
      "id": "bb.d",
      "name": "D",
      "type": "action",
      "aliases": [
        "D"
      ],
      "display": {
        "mode": "image",
        "asset": "Blazblue_ActionD"
      }
    }
  ]
};
