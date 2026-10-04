// Ported from the legacy React app's data files (see docs/legacy-port-notes.md).
import type { Game } from "../../core/games";

export const persona: Game = {
  "id": "persona",
  "name": "Persona",
  "definitions": [
    {
      "id": "persona.fatal-counter",
      "name": "Fatal Counter",
      "aliases": [
        "FC"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Some attacks will cause the Fatal Counter property. The words 'FATAL COUNTER' will appear on the side of the screen and the announcer will say 'FATAL!'' when a Fatal Counter happens.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/P4AU/Attack_Attributes#:~:text=Some%20attacks%20will%20cause%20the%20Fatal%20Counter%20property.%20The%20words%20%22FATAL%20COUNTER%22%20will%20appear%20on%20the%20side%20of%20the%20screen%20and%20the%20announcer%20will%20say%20%22FATAL!%22%20when%20a%20Fatal%20Counter%20happens."
      }
    },
    {
      "id": "persona.sweep",
      "name": "Sweep",
      "aliases": [
        "2AB",
        "sweep"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Crouching attack that knocks down the opponent.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/P4AU/Controls#:~:text=Crouching%20attack%20that%20knocks%20down%20the%20opponent."
      }
    },
    {
      "id": "persona.all-out-attack",
      "name": "All out Attack",
      "aliases": [
        "AB",
        "AoA"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Attack that must be blocked high and automatically guards against most attacks.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/P4AU/Controls#:~:text=All%2DOut%20Attack,Throws%20and%20Supers"
      }
    },
    {
      "id": "persona.one-more-cancel",
      "name": "One More Cancel",
      "aliases": [
        "ABC",
        "OMC"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Cancel almost any attack into neutral state for 50SP. Staple tool used in combos, pressure resets, and making unsafe attacks safe.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/P4AU/Controls#:~:text=One%20More%20Cancel,unsafe%20attacks%20safe."
      }
    },
    {
      "id": "persona.burst-shadow-frenzy",
      "name": "Burst / Shadow Frenzy",
      "aliases": [
        "ACD",
        "Burst"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Normal Characters: Very strong tool that costs the entire Burst Gauge. Shadow Characters: Costs 100SP and lets characters freely cancel most attacks into each other as well as have infinite SP for a litmited time.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/P4AU/Controls#:~:text=Very%20strong%20tool%20that%20costs%20the%20entire%20Burst%20Gauge.%20Bursts%20do%20different%20things%20depending%20on%20the%20context%20and%20are%20distinguished%20by%20different%20colors."
      }
    },
    {
      "id": "persona.max-burst-gold",
      "name": "MAX Burst (Gold)",
      "aliases": [
        "GBurst"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Bursting while at neutral will give the player max SP and refill their Persona Cards on hit.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/P4AU/Controls#:~:text=MAX%20Burst%20(gold,Cards%20on%20hit"
      }
    },
    {
      "id": "persona.defensive-burst-blue",
      "name": "Defensive Burst (Blue)",
      "aliases": [
        "BBurst"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Bursting while blocking or getting hit will blow the opponent away, ending their offensive pressure and gives players a chance to come back!",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/P4AU/Controls#:~:text=Bursting%20while%20blocking%20or%20getting%20hit%20will%20blow%20the%20opponent%20away%2C%20ending%20their%20offensive%20pressure%20and%20gives%20players%20a%20chance%20to%20come%20back!"
      }
    },
    {
      "id": "persona.one-more-burst-red",
      "name": "One More Burst (Red)",
      "aliases": [],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Bursting while attacking will cancel the attack and blow the opponent high into the air, allowing players to extend their combos.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/P4AU/Controls#:~:text=Bursting%20while%20attacking%20will%20cancel%20the%20attack%20and%20blow%20the%20opponent%20high%20into%20the%20air%2C%20allowing%20players%20to%20extend%20their%20combos."
      }
    },
    {
      "id": "persona.furious-action",
      "name": "Furious Action",
      "aliases": [
        "BD",
        "FA"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Attack that is fully invincible and is used to stop an overly offensive opponent.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/P4AU/Controls#:~:text=Attack%20that%20is,dodge%20%2B%20counter%20attack."
      }
    },
    {
      "id": "persona.hop",
      "name": "Hop",
      "aliases": [
        "2AC",
        "h."
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Short hop that has a few interesting properties.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/P4AU/Controls#:~:text=Short%20hop%20that,Victory%20Cry%20combos"
      }
    },
    {
      "id": "persona.evasive-action",
      "name": "Evasive Action",
      "aliases": [
        "AC"
      ],
      "ignoreCase": true,
      "display": {
        "mode": "label"
      },
      "description": "Dodge move that can avoid most attacks, as well as move through the opponent.",
      "more": {
        "name": "Dustloop",
        "url": "https://www.dustloop.com/w/P4AU/Controls#:~:text=Dodge%20move%20that,available%20when%20paralyzed!"
      }
    },
    {
      "id": "persona.a",
      "name": "A",
      "type": "action",
      "aliases": [
        "A"
      ],
      "display": {
        "mode": "image",
        "asset": "Persona_ActionA"
      }
    },
    {
      "id": "persona.b",
      "name": "B",
      "type": "action",
      "aliases": [
        "B"
      ],
      "display": {
        "mode": "image",
        "asset": "Persona_ActionB"
      }
    },
    {
      "id": "persona.c",
      "name": "C",
      "type": "action",
      "aliases": [
        "C"
      ],
      "display": {
        "mode": "image",
        "asset": "Persona_ActionC"
      }
    },
    {
      "id": "persona.d",
      "name": "D",
      "type": "action",
      "aliases": [
        "D"
      ],
      "display": {
        "mode": "image",
        "asset": "Persona_ActionD"
      }
    }
  ]
};
