import { describe, expect, it } from "vitest";
import { parse } from "./parse";
import type { TokenDefinition } from "./types";

const forward: TokenDefinition = {
  id: "dir.forward",
  name: "Forward",
  aliases: ["6", "f"],
};

const hold: TokenDefinition = {
  id: "mech.hold",
  name: "Hold",
  aliases: [],
  group: { open: "[", close: "]" },
};

const quarterCircle: TokenDefinition = {
  id: "motion.qcf",
  name: "Quarter-Circle Forward",
  aliases: ["236"],
};

const punch: TokenDefinition = {
  id: "action.punch",
  name: "Punch",
  aliases: ["P"],
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

const bracketRepeat: TokenDefinition = {
  id: "mech.repeat",
  name: "Repeat",
  aliases: [],
  group: { open: "[", close: "]x", param: { name: "n", kind: "digits" } },
};

describe("parse groups", () => {
  it("wraps the notation between a group's delimiters as its children", () => {
    const nodes = parse("[6]", [forward, hold]);

    expect(nodes).toEqual([
      {
        text: "[6]",
        start: 0,
        end: 3,
        definitionId: "mech.hold",
        params: {},
        children: [{ text: "6", start: 1, end: 2, definitionId: "dir.forward" }],
      },
    ]);
  });

  it("reads a parameter following the closing delimiter into params", () => {
    const nodes = parse("{236P}x3", [quarterCircle, punch, repeat]);

    expect(nodes).toEqual([
      {
        text: "{236P}x3",
        start: 0,
        end: 8,
        definitionId: "mech.repeat",
        params: { n: "3" },
        children: [
          { text: "236", start: 1, end: 4, definitionId: "motion.qcf" },
          { text: "P", start: 4, end: 5, definitionId: "action.punch" },
        ],
      },
    ]);
  });

  it("pairs each closer with its own opener when delimiters repeat", () => {
    const nodes = parse("[[6]P]", [forward, punch, hold]);

    expect(nodes).toEqual([
      {
        text: "[[6]P]",
        start: 0,
        end: 6,
        definitionId: "mech.hold",
        params: {},
        children: [
          {
            text: "[6]",
            start: 1,
            end: 4,
            definitionId: "mech.hold",
            params: {},
            children: [{ text: "6", start: 2, end: 3, definitionId: "dir.forward" }],
          },
          { text: "P", start: 4, end: 5, definitionId: "action.punch" },
        ],
      },
    ]);
  });

  it("nests a group inside another group", () => {
    const nodes = parse("[{6}x2]", [forward, hold, repeat]);

    expect(nodes).toEqual([
      {
        text: "[{6}x2]",
        start: 0,
        end: 7,
        definitionId: "mech.hold",
        params: {},
        children: [
          {
            text: "{6}x2",
            start: 1,
            end: 6,
            definitionId: "mech.repeat",
            params: { n: "2" },
            children: [{ text: "6", start: 2, end: 3, definitionId: "dir.forward" }],
          },
        ],
      },
    ]);
  });

  it("keeps a literal group's content verbatim without parsing it", () => {
    const nodes = parse("``hello 236``", [quarterCircle, comment]);

    expect(nodes).toEqual([
      {
        text: "``hello 236``",
        start: 0,
        end: 13,
        definitionId: "mech.comment",
        params: {},
        children: [],
        content: "hello 236",
      },
    ]);
  });

  it("picks between groups sharing an opener by what follows the closer", () => {
    const definitions = [forward, hold, bracketRepeat];

    expect(parse("[6]x2", definitions)).toEqual([
      {
        text: "[6]x2",
        start: 0,
        end: 5,
        definitionId: "mech.repeat",
        params: { n: "2" },
        children: [{ text: "6", start: 1, end: 2, definitionId: "dir.forward" }],
      },
    ]);
    expect(parse("[6]", definitions)).toEqual([
      {
        text: "[6]",
        start: 0,
        end: 3,
        definitionId: "mech.hold",
        params: {},
        children: [{ text: "6", start: 1, end: 2, definitionId: "dir.forward" }],
      },
    ]);
  });

  it("treats an unclosed opener as unknown text and still parses the rest", () => {
    expect(parse("[6", [forward, hold])).toEqual([
      { text: "[", start: 0, end: 1, definitionId: "unknown" },
      { text: "6", start: 1, end: 2, definitionId: "dir.forward" },
    ]);
  });

  it("treats a closer without an opener as unknown text", () => {
    expect(parse("6]", [forward, hold])).toEqual([
      { text: "6", start: 0, end: 1, definitionId: "dir.forward" },
      { text: "]", start: 1, end: 2, definitionId: "unknown" },
    ]);
  });
});
