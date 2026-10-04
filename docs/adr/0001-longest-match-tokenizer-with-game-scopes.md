---
status: accepted
---

# Longest-match tokenizer over layered, game-scoped Token Definitions

The old engine concatenated every definition's regex into one alternation and split the Notation with it, so precedence depended on file order and short patterns leaked (`/2|d/` matches any "d"). We replace it with a tokenizer that matches Notation against a table of aliases, longest match first, with Token Definitions as plain serializable data resolved through layers (Custom Game, its parent, shared base). Per-definition regexes are gone, so Pure definitions, Custom Token Definitions, exports and share links all use one data shape, and the same Notation can mean different things per Game.

## Considered Options

- **Keep per-definition regexes**: rejected because regexes can't be serialized safely into shared links and imports, and untrusted patterns invite ReDoS.
- **Grammar or parser-combinator**: rejected as more machinery than alias sequences need, and harder for users to extend by editing a definition's properties.

## Consequences

- Matching is case-sensitive by default (`b` back vs `B` button). A definition can opt out with `ignoreCase: true`, because about 60 legacy definitions (`Tsubame`, `Kote Gaeshi`, ...) were case-insensitive and listing every casing is impractical.
- A duplicate alias within one layer is a validation error. Across layers, for identical alias text the more specific layer wins and the shadowed alias is removed; otherwise the longest match wins.
- Group Token Definitions (hold, repeat, comment, simultaneous) are expressed through delimiters and label templates, never by name in the renderer.
- Behavior of the old app is guarded by golden tests; intentional differences (e.g. the `Human Form` regex bug) are listed explicitly.
