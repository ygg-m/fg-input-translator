import { describe, expect, it } from "vitest";
import type { GameRegistry } from "./games";
import { buildReference } from "./reference";
import type { TokenDefinition } from "./types";

const forward: TokenDefinition = { id: "dir.forward", name: "Forward", aliases: ["6", "f"] };
const punch: TokenDefinition = { id: "g1.punch", name: "Punch", aliases: ["P"] };

const hold: TokenDefinition = {
  id: "mech.hold",
  name: "Hold",
  aliases: [],
  group: { open: "[", close: "]" },
};
const repeat: TokenDefinition = {
  id: "mech.repeat",
  name: "Repeat",
  aliases: [],
  group: { open: "{", close: "}x", param: { name: "n", kind: "digits" } },
};
const comment: TokenDefinition = {
  id: "mech.comment",
  name: "Comment",
  aliases: [],
  group: { open: "``", close: "``", literal: true },
};
const simultaneous: TokenDefinition = {
  id: "mech.simultaneous",
  name: "Simultaneous",
  aliases: [],
  group: { separator: "+" },
};

const registry: GameRegistry = {
  base: [forward, hold, repeat, comment, simultaneous],
  games: [
    { id: "g1", name: "Game One", definitions: [punch] },
    { id: "g2", name: "Game Two", definitions: [] },
  ],
};

describe("buildReference", () => {
  it("lists the shared inputs first and then each game that has its own, in order", () => {
    expect(buildReference(registry)).toEqual([
      {
        title: "Shared by every game",
        entries: [
          { aliases: ["6", "f"], name: "Forward" },
          { aliases: ["[…]"], name: "Hold" },
          { aliases: ["{…}xN"], name: "Repeat" },
          { aliases: ["``…``"], name: "Comment" },
          { aliases: ["a+b"], name: "Simultaneous" },
        ],
      },
      { title: "Game One", entries: [{ aliases: ["P"], name: "Punch" }] },
    ]);
  });

  it("leaves out a section with nothing to show", () => {
    expect(buildReference({ base: [], games: [{ id: "g", name: "G", definitions: [] }] })).toEqual([]);
  });
});
