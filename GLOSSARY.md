# Fighting Game Input Translator

Converts fighting-game numpad notation into visuals (images, emojis, labels) that readers outside the FGC can understand.

## Language

**Notation**:
The raw text a user types, such as `236P`.
_Avoid_: Input, command string

**Token Definition**:
A rule stating that a given piece of Notation means something and how it is shown (name, type, aliases, image, label, description).
_Avoid_: Move, input object, element

**Token**:
One rendered instance of a Token Definition in the output; the user can reassign its definition and the render updates live.
_Avoid_: Element, input, node

**Pure Token**:
A Token that renders exactly as its built-in Token Definition says, with no user changes.
_Avoid_: Default token, original token

**Custom Token**:
A Token whose properties the user has changed; it carries a visible "custom" tag and can be saved for reuse.
_Avoid_: Edited token, modified token, override

**Custom Token Definition**:
A Custom Token that the user has saved so it applies to every matching Notation in that Game, shadowing the Pure definition.
_Avoid_: Saved override, user preset

**Custom Layer**:
The user's saved Custom Token Definitions for one Game, resolved on top of that Game without becoming a Game of their own.
_Avoid_: Custom Game, user preset

**Row**:
One line holding a single Notation and the Tokens it produces.
_Avoid_: Document, entry, line

**Tab**:
A named collection of Rows inside one Game, such as "Ryu Combos" under Street Fighter.
_Avoid_: Page, folder, set

**Group**:
A Token that contains other Tokens, such as a Hold, a Repeat or a Comment.
_Avoid_: Wrapper, combo wrapper

**Game**:
A scope that layers game-specific Token Definitions over the shared base, so the same Notation can mean different things per Game.
_Avoid_: Movelist, preset

**Custom Game**:
A Game defined by the user, holding their own specific moves and combos.
