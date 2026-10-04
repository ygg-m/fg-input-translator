// Ported from the legacy React app's data files (see docs/legacy-port-notes.md).
import type { TokenDefinition } from "../core/types";

export const baseDefinitions: TokenDefinition[] = [
  {
    "id": "base.gatlings",
    "name": "Gatlings",
    "type": "mech",
    "aliases": [
      "gatlings"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Sequence of inputs that chain into one another easily. Check a guide to your character or game to see some examples.",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Starter"
    }
  },
  {
    "id": "base.starter",
    "name": "Starter",
    "type": "mech",
    "aliases": [
      "starter"
    ],
    "display": {
      "mode": "label"
    },
    "description": "The first hit or combo before going to the main combo. Check a guide for your character to see some examples.",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Starter"
    }
  },
  {
    "id": "base.corner",
    "name": "Corner",
    "type": "mech",
    "aliases": [
      "corner"
    ],
    "display": {
      "mode": "label"
    },
    "description": "The far left and far right edges of the screen in a 2D fighting game. Combos with this notation usually means you should ",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Corner"
    }
  },
  {
    "id": "base.land",
    "name": "Land",
    "type": "mech",
    "aliases": [
      "▷",
      "land"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Player must land at that point in the sequence."
  },
  {
    "id": "base.wall-splat",
    "name": "Wall Splat",
    "type": "mech-icon",
    "aliases": [
      "WS"
    ],
    "ignoreCase": true,
    "display": {
      "mode": "label"
    },
    "description": "Attacking someone into a wall; if you use the right move, they will splat against the wall and crumble in front of it, open to more hits.",
    "more": {
      "name": "Dustloop",
      "url": "https://glossary.infil.net/?t=Wall%20Splat"
    }
  },
  {
    "id": "base.instant-air-special",
    "name": "Instant Air Special",
    "aliases": [
      "IAS"
    ],
    "ignoreCase": true,
    "display": {
      "mode": "label"
    },
    "description": "Conceptually includes Tiger KneePerforming a special as soon as possible after becoming airborne. Usually, but not always, involves an input trick.",
    "more": {
      "name": "Dustloop",
      "url": "https://www.dustloop.com/w/Glossary#Instant_Air_Special:~:text=IAS%20noun%20%2C%20verb,j.236S%20input."
    }
  },
  {
    "id": "base.tiger-knee",
    "name": "Tiger Knee",
    "type": "mech",
    "aliases": [
      "tk"
    ],
    "display": {
      "mode": "label"
    },
    "description": "A method to perform a special move in the air as fast as possible after you leave the ground. For example, in a 236P motion you would make 2369P.",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Tiger%20Knee"
    }
  },
  {
    "id": "base.delay",
    "name": "Delay",
    "type": "mech",
    "aliases": [
      "dl.",
      "dl",
      "delayed",
      "delay",
      "slightdelay"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Delay the following move."
  },
  {
    "id": "base.whiff",
    "name": "Whiff",
    "type": "mech",
    "aliases": [
      "whiff",
      "(whiff)"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Whiff (not hit) the following move."
  },
  {
    "id": "base.or",
    "name": "or",
    "type": "mech",
    "aliases": [
      "/",
      "or"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Execute the left or right command."
  },
  {
    "id": "base.dash",
    "name": "Dash",
    "type": "mech-icon",
    "aliases": [
      "66",
      "dash"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion66"
    }
  },
  {
    "id": "base.back-dash",
    "name": "Back Dash",
    "type": "mech-icon",
    "aliases": [
      "44"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion66",
      "transform": {
        "flipX": true
      }
    }
  },
  {
    "id": "base.homing-jump",
    "name": "Homing Jump",
    "type": "mech",
    "aliases": [
      "homingjump"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Dust attacks will launch the target in the air. Homing Jump is when you jump right after the attack connects."
  },
  {
    "id": "base.double-jump",
    "name": "Double Jump",
    "type": "mech-icon",
    "aliases": [
      "88",
      "dj."
    ],
    "display": {
      "mode": "image",
      "asset": "Motion66",
      "transform": {
        "rotate": -90
      }
    }
  },
  {
    "id": "base.ground",
    "name": "Ground",
    "type": "mech",
    "aliases": [
      "ground"
    ],
    "display": {
      "mode": "label"
    },
    "description": "The command should be executed while on the ground."
  },
  {
    "id": "base.air-throw",
    "name": "Air Throw",
    "type": "mech",
    "aliases": [
      "airthrow"
    ],
    "display": {
      "mode": "label"
    },
    "description": "A throw that can be input in the air, and only works against airborne opponents. Check a guide for the game or character to see the throw inputs available.",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Air%20Throw"
    }
  },
  {
    "id": "base.throw",
    "name": "Throw",
    "type": "mech",
    "aliases": [
      "throw",
      "cl.6c",
      "cl.6d",
      "cl.4c",
      "cl.4d"
    ],
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
    "id": "base.high-jump-cancel",
    "name": "High Jump Cancel",
    "type": "mech",
    "aliases": [
      "hjc.",
      "hjc",
      "sjc.",
      "sjc"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Any Downward Direction then any Upward Direction while on the ground",
    "more": {
      "name": "Dustloop",
      "url": "https://www.dustloop.com/w/GGACR/Mechanics#High_Jump"
    }
  },
  {
    "id": "base.short-jump-cancel",
    "name": "Short Jump Cancel",
    "type": "mech",
    "aliases": [
      "shjc.",
      "shjc"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Canceling a move with a short jump.",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Jump%20Cancel"
    }
  },
  {
    "id": "base.double-jump-cancel",
    "name": "Double Jump Cancel",
    "type": "mech-icon",
    "aliases": [
      "djc.",
      "djc"
    ],
    "display": {
      "mode": "label"
    }
  },
  {
    "id": "base.jump-cancel",
    "name": "Jump Cancel",
    "type": "mech",
    "aliases": [
      "jc.",
      "jc"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Canceling a move with a jump.",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Jump%20Cancel"
    }
  },
  {
    "id": "base.crouch",
    "name": "Crouch",
    "type": "mech",
    "aliases": [
      "cr."
    ],
    "display": {
      "mode": "label"
    },
    "description": "Player must be crouching.",
    "more": {
      "name": "Dustloop",
      "url": "https://www.dustloop.com/w/GGACR/A.B.A"
    }
  },
  {
    "id": "base.close",
    "name": "Close",
    "type": "mech",
    "aliases": [
      "c.",
      "cl."
    ],
    "display": {
      "mode": "label"
    },
    "description": "Player must be close to the target."
  },
  {
    "id": "base.standing-far",
    "name": "Standing Far",
    "type": "mech",
    "aliases": [
      "st."
    ],
    "display": {
      "mode": "label"
    },
    "description": "Player must be standing and far from target."
  },
  {
    "id": "base.far",
    "name": "Far",
    "type": "mech",
    "aliases": [
      "f."
    ],
    "display": {
      "mode": "label"
    },
    "description": "Player must be far from the target."
  },
  {
    "id": "base.super-jump",
    "name": "Super Jump",
    "type": "mech",
    "aliases": [
      "hj.",
      "sj.",
      "sj"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Any Downward Direction > Any Upward Direction while on the ground",
    "more": {
      "name": "Dustloop",
      "url": "https://www.dustloop.com/w/GGACR/Mechanics#High_Jump"
    }
  },
  {
    "id": "base.jump",
    "name": "Jump",
    "type": "mech",
    "aliases": [
      "j.",
      "jump"
    ],
    "display": {
      "mode": "label"
    }
  },
  {
    "id": "base.air-dash-cancel",
    "name": "Air Dash Cancel",
    "type": "mech",
    "aliases": [
      "adc"
    ],
    "display": {
      "mode": "label"
    }
  },
  {
    "id": "base.dash-cancel",
    "name": "Dash Cancel",
    "type": "mech",
    "aliases": [
      "dc"
    ],
    "display": {
      "mode": "label"
    }
  },
  {
    "id": "base.counter-hit",
    "name": "Counter Hit",
    "type": "mech",
    "aliases": [
      "ch"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Hitting someone while they are in the startup of an attack. ",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Counter%20Hit"
    }
  },
  {
    "id": "base.anti-air",
    "name": "Anti Air",
    "type": "mech",
    "aliases": [
      "aa",
      "anti-air",
      "antiair"
    ],
    "display": {
      "mode": "label"
    },
    "description": "Hitting someone who is jumping at you while you are on the ground.",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Anti-Air"
    }
  },
  {
    "id": "base.instant-air-dash",
    "name": "Instant Air Dash",
    "type": "mech-icon",
    "aliases": [
      "IAD"
    ],
    "ignoreCase": true,
    "display": {
      "mode": "image",
      "asset": "MechIAD"
    },
    "more": {
      "name": "Dustloop",
      "url": "https://www.dustloop.com/w/GGACR/Movement#Air_Movement"
    }
  },
  {
    "id": "base.cancel",
    "name": "Cancel",
    "type": "follow-up",
    "aliases": [
      "->",
      "~",
      ">>"
    ],
    "display": {
      "mode": "image",
      "asset": "ArrowCancel"
    },
    "description": "Bypass the remaining time or frames in an action by proceeding directly into another action."
  },
  {
    "id": "base.normal-followup",
    "name": "Normal Followup",
    "type": "follow-up",
    "aliases": [
      ">",
      "＞",
      "→"
    ],
    "display": {
      "mode": "image",
      "asset": "ArrowNext"
    },
    "description": "Proceed from the previous move to the following move."
  },
  {
    "id": "base.link",
    "name": "Link",
    "type": "follow-up",
    "aliases": [
      ","
    ],
    "display": {
      "mode": "image",
      "asset": "ArrowLink"
    },
    "description": "To perform a second action after the first action completely finishes its animation."
  },
  {
    "id": "base.pretzel",
    "name": "Pretzel",
    "type": "special",
    "aliases": [
      "1632143"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion1632143"
    },
    "description": "Down-back, followed by half circle back, followed by down-forward.",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Pretzel%20Motion"
    }
  },
  {
    "id": "base.reverse-pretzel",
    "name": "Reverse Pretzel",
    "type": "special",
    "aliases": [
      "3412361"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion1632143",
      "transform": {
        "flipX": true
      }
    },
    "description": "Down-foward, followed by half circle foward, followed by down-back.",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Pretzel%20Motion"
    }
  },
  {
    "id": "base.360-full-circle-foward",
    "name": "360 / Full Circle Forward",
    "type": "special",
    "aliases": [
      "41236987",
      "4268"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion41236987"
    },
    "description": "Most games have a shortcut for this input; usually a 270-degree input will do.",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=360"
    }
  },
  {
    "id": "base.reverse-360-full-circle-back",
    "name": "Reverse 360 / Full Circle Back",
    "type": "special",
    "aliases": [
      "63214789",
      "6248"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion41236987",
      "transform": {
        "flipX": true
      }
    },
    "description": "Most games have a shortcut for this input; usually a 270-degree input will do.",
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=360"
    }
  },
  {
    "id": "base.half-circle-foward",
    "name": "Half Circle Forward",
    "type": "special",
    "aliases": [
      "41236",
      "426",
      "hcf"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion41236"
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Half%20Circle"
    }
  },
  {
    "id": "base.half-circle-back",
    "name": "Half Circle Back",
    "type": "special",
    "aliases": [
      "63214",
      "624",
      "hcb"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion41236",
      "transform": {
        "flipX": true
      }
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Half%20Circle"
    }
  },
  {
    "id": "base.quarter-circle-foward",
    "name": "Quarter Circle Forward",
    "type": "special",
    "aliases": [
      "236",
      "qcf"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion236"
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Quarter%20Circle"
    }
  },
  {
    "id": "base.quarter-circle-back",
    "name": "Quarter Circle Back",
    "type": "special",
    "aliases": [
      "214",
      "qcb"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion236",
      "transform": {
        "flipX": true
      }
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Quarter%20Circle"
    }
  },
  {
    "id": "base.quarter-circle-up",
    "name": "Quarter Circle Up",
    "type": "special",
    "aliases": [
      "698"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion236",
      "transform": {
        "rotate": -90
      }
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Quarter%20Circle"
    }
  },
  {
    "id": "base.quarter-circle-up-back",
    "name": "Quarter Circle Up Back",
    "type": "special",
    "aliases": [
      "478"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion236",
      "transform": {
        "rotate": 90,
        "flipX": true
      }
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Quarter%20Circle"
    }
  },
  {
    "id": "base.quarter-circle-down",
    "name": "Quarter Circle Down",
    "type": "special",
    "aliases": [
      "632"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion236",
      "transform": {
        "rotate": -90,
        "flipX": true
      }
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Quarter%20Circle"
    }
  },
  {
    "id": "base.quarter-circle-down-back",
    "name": "Quarter Circle Down Back",
    "type": "special",
    "aliases": [
      "412"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion236",
      "transform": {
        "rotate": 90
      }
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Quarter%20Circle"
    }
  },
  {
    "id": "base.quarter-circle-up-foward",
    "name": "Quarter Circle Up Forward",
    "type": "special",
    "aliases": [
      "896"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion236",
      "transform": {
        "rotate": 180,
        "flipX": true
      }
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Quarter%20Circle"
    }
  },
  {
    "id": "base.quarter-circle-up-back-2",
    "name": "Quarter Circle Up Back",
    "type": "special",
    "aliases": [
      "874"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion236",
      "transform": {
        "rotate": -180
      }
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=Quarter%20Circle"
    }
  },
  {
    "id": "base.dp-motion-dragon-punch",
    "name": "DP Motion / Dragon Punch",
    "type": "special",
    "aliases": [
      "623"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion623"
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=DP%20Motion"
    }
  },
  {
    "id": "base.reverse-dp-motion-reverse-dragon-punch",
    "name": "Reverse DP Motion / Reverse Dragon Punch",
    "type": "special",
    "aliases": [
      "421"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion623",
      "transform": {
        "flipX": true
      }
    },
    "more": {
      "name": "Glossary",
      "url": "https://glossary.infil.net/?t=DP%20Motion"
    }
  },
  {
    "id": "base.down-back",
    "name": "Down Back",
    "type": "movement",
    "aliases": [
      "1",
      "db"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion6",
      "transform": {
        "rotate": -45,
        "flipX": true
      }
    }
  },
  {
    "id": "base.down-foward",
    "name": "Down Forward",
    "type": "movement",
    "aliases": [
      "3",
      "df"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion6",
      "transform": {
        "rotate": 45
      }
    }
  },
  {
    "id": "base.up-back",
    "name": "Up Back",
    "type": "movement",
    "aliases": [
      "7",
      "ub"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion6",
      "transform": {
        "rotate": 45,
        "flipX": true
      }
    }
  },
  {
    "id": "base.up-foward",
    "name": "Up Forward",
    "type": "movement",
    "aliases": [
      "9",
      "uf"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion6",
      "transform": {
        "rotate": -45
      }
    }
  },
  {
    "id": "base.down",
    "name": "Down",
    "type": "movement",
    "aliases": [
      "2",
      "d"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion6",
      "transform": {
        "rotate": 90
      }
    }
  },
  {
    "id": "base.back",
    "name": "Back",
    "type": "movement",
    "aliases": [
      "4",
      "b"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion6",
      "transform": {
        "flipX": true
      }
    }
  },
  {
    "id": "base.stand",
    "name": "Stand",
    "type": "movement",
    "aliases": [
      "5"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion5"
    },
    "description": "Neutral Stance."
  },
  {
    "id": "base.foward",
    "name": "Forward",
    "type": "movement",
    "aliases": [
      "6",
      "f"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion6"
    }
  },
  {
    "id": "base.up",
    "name": "Up",
    "type": "movement",
    "aliases": [
      "8",
      "u"
    ],
    "display": {
      "mode": "image",
      "asset": "Motion6",
      "transform": {
        "rotate": -90
      }
    }
  }
];
