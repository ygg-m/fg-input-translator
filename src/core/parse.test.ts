import { describe, expect, it } from "vitest";
import { parse } from "./parse";
import type { TokenDefinition } from "./types";

const forward: TokenDefinition = {
  id: "dir.forward",
  name: "Forward",
  aliases: ["6", "f"],
};

const quarterCircle: TokenDefinition = {
  id: "motion.qcf",
  name: "Quarter-Circle Forward",
  aliases: ["236", "qcf"],
};

const punch: TokenDefinition = {
  id: "action.punch",
  name: "Punch",
  aliases: ["P"],
};

describe("parse", () => {
  it("turns a single direction into one Token of that definition", () => {
    const tokens = parse("6", [forward]);

    expect(tokens).toEqual([
      { text: "6", start: 0, end: 1, definitionId: "dir.forward" },
    ]);
  });

  it("prefers the longest alias over shorter ones that match the same text", () => {
    const down: TokenDefinition = { id: "dir.down", name: "Down", aliases: ["2"] };
    const downForward: TokenDefinition = { id: "dir.df", name: "Down Forward", aliases: ["3"] };

    const tokens = parse("236", [down, downForward, forward, quarterCircle]);

    expect(tokens).toEqual([
      { text: "236", start: 0, end: 3, definitionId: "motion.qcf" },
    ]);
  });

  it("keeps unmatched text as a single unknown Token instead of dropping it", () => {
    const tokens = parse("6xyz6", [forward]);

    expect(tokens).toEqual([
      { text: "6", start: 0, end: 1, definitionId: "dir.forward" },
      { text: "xyz", start: 1, end: 4, definitionId: "unknown" },
      { text: "6", start: 4, end: 5, definitionId: "dir.forward" },
    ]);
  });

  it("matches aliases case-sensitively", () => {
    const back: TokenDefinition = { id: "dir.back", name: "Back", aliases: ["b"] };
    const buttonB: TokenDefinition = { id: "action.b", name: "B", aliases: ["B"] };

    expect(parse("bB", [back, buttonB])).toEqual([
      { text: "b", start: 0, end: 1, definitionId: "dir.back" },
      { text: "B", start: 1, end: 2, definitionId: "action.b" },
    ]);
    expect(parse("B", [back])).toEqual([
      { text: "B", start: 0, end: 1, definitionId: "unknown" },
    ]);
  });

  it("ignores spaces while spans keep pointing at the original text", () => {
    const tokens = parse("2 3 6 P", [quarterCircle, punch]);

    expect(tokens).toEqual([
      { text: "2 3 6", start: 0, end: 5, definitionId: "motion.qcf" },
      { text: "P", start: 6, end: 7, definitionId: "action.punch" },
    ]);
  });

  it("splits a motion followed by a button into two Tokens", () => {
    const tokens = parse("236P", [quarterCircle, punch]);

    expect(tokens).toEqual([
      { text: "236", start: 0, end: 3, definitionId: "motion.qcf" },
      { text: "P", start: 3, end: 4, definitionId: "action.punch" },
    ]);
  });

  it("matches an ignoreCase definition in any casing and keeps the original text", () => {
    const tsubame: TokenDefinition = {
      id: "g1.tsubame",
      name: "Tsubame",
      aliases: ["Tsubame"],
      ignoreCase: true,
    };

    expect(parse("tSUbame", [tsubame])).toEqual([
      { text: "tSUbame", start: 0, end: 7, definitionId: "g1.tsubame" },
    ]);
  });
});
