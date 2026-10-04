# Legacy port notes

The data under `src/data/` was converted from the legacy React app (`legacy/data/`) by a throwaway script that is not kept in the repo. This file records what the conversion decided, and how the new engine deliberately differs from the old one. The golden files in `src/data/golden/` are the executable form of it.

## What was ported

- **Base layer** (`src/data/base.ts`): the old `techPatterns`, `followUp`, `specialInputs` and `moveInputs`, 60 definitions, as one layer.
- **Games** (`src/data/games/*.ts`): Guilty Gear, Street Fighter, King of Fighters, Blazblue, Persona, Them's Fightin' Herds, 96 definitions in total. Commented-out character-specific blocks were not ported.
- **Wrapper mechanics** (`src/data/groups.ts`, written by hand): Comment, Hold, Repeat (`[…]xN` and `{…}xN`), Wolf Form, Human Form, Float, Whiffed Move, and the new Simultaneous (`+`).
- **Assets**: every SVG the old app used is in `src/assets/inputs/`; a definition refers to one by file name without extension.

## How definitions were converted

- **Ids** are `<scope>.<slug of the legacy name>` (`base.`, `gg.`, `sf.`, `kof.`, `bb.`, `persona.`, `tfh.`). The slug uses the *original* name, so ids stay traceable to the old data even where the visible name was corrected (`Foward` is shown as `Forward`, `Hiper` as `Hyper`; ids keep `foward`, `hiper`). Ids are stable and are what shared links and custom tokens will refer to.
- **Aliases come from the regex**, not the `input` list, because the regex is what the old app actually matched (`Dash` also matched `dash`, `Jump` also matched `jump`). Case-insensitive regexes (`/i`) became `ignoreCase: true`.
- **Transforms**: the CSS strings became `{ rotate, flipX }`. One legacy value wrote the flip first (`scaleX(-1) rotate(-180deg)`); it was converted to the equivalent canonical order.
- **Whitespace in aliases** is normalized away when a Game is resolved (`OD Cancel` is stored as `ODCancel`) because notation is matched with whitespace removed.

## Definitions whose regex was not a plain list of literals

| Definition | Legacy regex | Ported aliases |
| --- | --- | --- |
| Throw (base) | `/throw\|cl.6c\|cl.6d\|cl.4c\|cl.4d/` | `throw`, `cl.6c`, `cl.6d`, `cl.4c`, `cl.4d` (the dot is literal) |
| Throw (KOF) | `/cl.6c\|…/i` | same four, dot literal |
| High Jump Cancel | `/[^s]hjc\.\|sjc\.\|[^s]hjc\|sjc/` | `hjc.`, `hjc`, `sjc.`, `sjc` |
| Cancel | `/(?<!-.)->\|~\|>>/g` | `->`, `~`, `>>` |
| Drive Attack (Blazblue) | `/d./i` | `d.` (the dot is literal) |
| Any Attack (TFH) | `/(?<!x)x(?!x)/` | `x` |

Persona's `BBurst` was claimed by two definitions (Defensive Burst (Blue) and One More Burst (Red)). It stays on the first, matching the old first-match order.

## Wrapper syntax not ported yet

These need syntax the core does not have: **Optional** `(X)` and **During Last Move** `move(move)` (they depend on the preceding character), **Single / Multiple Hits** `X(N)` (a postfix on the previous token), **Release** `]X[`, **Regular Eddie** `-X-` and **Vice Eddie** `#X#`. The old unnamed `[move]` group ("or" statement) was folded into Hold, which now accepts any sequence instead of a single character.

## Golden files

`src/data/golden/<game>.json` hold, per game, flat notations (every alias of every definition visible in the game, upper- and lower-case variants of `ignoreCase` aliases, and generated motion + button combos and chains) together with what the legacy tokenizer produced for them, as ported ids. The legacy results came from re-running the old splitting and matching code in Node with one deliberate fix: `lastIndex` is reset before each regex test, which the old code needed but did not do.

- `matching` (1,225 notations): the new engine must still produce exactly the legacy result.
- `differences` (102 notations): reviewed deviations; the test pins what the new engine produces now, so a change to any of them is visible.

Wrapper syntax (`[]`, `{}`, `()`, backticks) and `+` are not part of the golden set; groups are covered by the unit tests in `src/core/`.

## Known differences from the legacy app

Legacy results below are what the old app produced; in every case the new result is the intended reading of the notation.

| Reason | Count | What the old app did | Example |
| --- | --- | --- | --- |
| `legacy-case-insensitive-broken` | 62 | The combined regex kept only the `g` flag, so an `/i` definition only matched when typed exactly as in the source; other casings fell through to an unanchored per-definition test and produced fragments. | `staff1` became Forward, Forward, Down Back; now Staff 1 |
| `legacy-unanchored-match` | 20 | After the combined regex found a piece, the piece was re-tested against every definition's regex *anywhere inside it*, in file order, so a short pattern earlier in the list claimed the whole piece. | `hcf` in Them's Fightin' Herds became Heavy Attack (`/c/`); `Tsubame` in Blazblue became Mantenbou (`/m/`); now Half Circle Forward and Tsubame Gaeshi |
| `legacy-hjc-at-start` | 12 | `/[^s]hjc/` needs a character before it, so `hjc` at the start of the notation failed. | `hjc` became an unknown `h` plus Jump Cancel; now High Jump Cancel |
| `layer-precedence` | 6 | Base definitions came before game definitions in the match order. A game definition now wins over a base one with the same alias, so only the id differs. | `WS` is `gg.wall-splat`, not `base.wall-splat`; `cl.6c` in KOF is `kof.throw` |
| `whitespace-alias` | 1 | An alias containing a space could never match because whitespace is stripped first. | `OD Cancel` became four fragments; now Overdrive Cancel |
| `longest-match` | 1 | The first matching alternative won, not the longest. | `ABC` in Persona became All out Attack (`AB`) plus C; now One More Cancel |

Also different by design, not in the golden set: `+` no longer disappears (`P+K` is now a Simultaneous group), and `ignoreCase` aliases also claim casings the old app rejected, so `236bbb` in Blazblue is now Banishing Fang Bash instead of Quarter Circle Forward followed by three Backs.
