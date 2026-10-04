import { describe, expect, it } from "vitest";
import { parse } from "./parse";
import { toView } from "./view";
import type { TokenDefinition } from "./types";

const forward: TokenDefinition = {
  id: "dir.forward",
  name: "Forward",
  aliases: ["6"],
  display: { mode: "image", asset: "Motion6" },
};

describe("toView", () => {
  it("keeps a Token's display and names it after its definition", () => {
    const definitions = [forward];

    expect(toView(parse("6", definitions), definitions)).toEqual([
      {
        kind: "token",
        text: "6",
        start: 0,
        end: 1,
        definitionId: "dir.forward",
        name: "Forward",
        display: { mode: "image", asset: "Motion6" },
        accessibleName: "Forward",
        unknown: false,
      },
    ]);
  });

  it("shows an unknown node's raw text as a label and marks it unknown", () => {
    const definitions = [forward];

    expect(toView(parse("6xyz", definitions), definitions)[1]).toEqual({
      kind: "token",
      text: "xyz",
      start: 1,
      end: 4,
      definitionId: "unknown",
      name: "xyz",
      display: { mode: "label" },
      accessibleName: 'Unknown: "xyz"',
      unknown: true,
    });
  });

  it("falls back to a label of the name when a definition has no display", () => {
    const plain: TokenDefinition = { id: "mech.starter", name: "Starter", aliases: ["starter"] };

    expect(toView(parse("starter", [plain]), [plain])[0]).toMatchObject({
      display: { mode: "label" },
      name: "Starter",
      unknown: false,
    });
  });

  it("passes label and description through and only keeps https links", () => {
    const safe: TokenDefinition = {
      id: "a.safe",
      name: "Safe",
      aliases: ["a"],
      label: "Caption",
      description: "<b>not html</b>",
      more: { name: "Glossary", url: "https://glossary.infil.net/?t=Starter" },
    };
    const unsafe: TokenDefinition = {
      id: "a.unsafe",
      name: "Unsafe",
      aliases: ["b"],
      more: { name: "Click", url: "javascript:alert(1)" },
    };
    const definitions = [safe, unsafe];
    const [first, second] = toView(parse("ab", definitions), definitions);

    expect(first).toMatchObject({
      label: "Caption",
      description: "<b>not html</b>",
      more: { name: "Glossary", url: "https://glossary.infil.net/?t=Starter" },
    });
    expect(second).not.toHaveProperty("more");
  });

  it("treats a node whose definition is no longer known as unknown instead of throwing", () => {
    const nodes = parse("6", [forward]);

    expect(toView(nodes, [])[0]).toMatchObject({
      definitionId: "dir.forward",
      unknown: true,
      display: { mode: "label" },
    });
  });

  it("fills a group's label template from its params and defaults to the name", () => {
    const punch: TokenDefinition = { id: "action.punch", name: "Punch", aliases: ["P"] };
    const repeat: TokenDefinition = {
      id: "mech.repeat",
      name: "Repeat",
      aliases: [],
      label: "Repeat x{n}",
      group: { open: "{", close: "}x", param: { name: "n", kind: "digits" } },
    };
    const hold: TokenDefinition = {
      id: "mech.hold",
      name: "Hold",
      aliases: [],
      group: { open: "[", close: "]" },
    };
    const definitions = [punch, repeat, hold];

    expect(toView(parse("{P}x3", definitions), definitions)[0]).toMatchObject({
      kind: "group",
      label: "Repeat x3",
      name: "Repeat",
      accessibleName: "Repeat x3",
      children: [{ kind: "token", name: "Punch" }],
    });
    expect(toView(parse("[P]", definitions), definitions)[0]).toMatchObject({
      kind: "group",
      label: "Hold",
    });
  });

  it("carries a literal group's content and has no children for it", () => {
    const comment: TokenDefinition = {
      id: "mech.comment",
      name: "Comment",
      aliases: [],
      group: { open: "``", close: "``", literal: true },
    };

    expect(toView(parse("``hello 236``", [comment]), [comment])[0]).toMatchObject({
      kind: "group",
      label: "Comment",
      content: "hello 236",
      children: [],
    });
  });

  it("converts nested groups recursively", () => {
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
      label: "Repeat x{n}",
      group: { open: "{", close: "}x", param: { name: "n", kind: "digits" } },
    };
    const definitions = [forward, hold, repeat];

    expect(toView(parse("[{6}x2]", definitions), definitions)[0]).toMatchObject({
      kind: "group",
      label: "Hold",
      children: [{ kind: "group", label: "Repeat x2", children: [{ kind: "token", name: "Forward" }] }],
    });
  });
});
