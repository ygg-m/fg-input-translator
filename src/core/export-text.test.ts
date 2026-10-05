import { describe, expect, it } from "vitest";
import { parseExport, serializeExport } from "./export";
import type { ExportEnvelope } from "./export";

const envelope = (): ExportEnvelope => ({
  format: "fg-input-translator",
  version: 1,
  tabs: [
    {
      gameId: "street-fighter",
      tab: {
        name: "Ryu 日本 🔥",
        rows: [
          {
            notation: "236P > 623K",
            label: "BnB",
            customizations: [
              {
                anchor: { text: "236", occurrence: 0 },
                basedOn: "base.quarter-circle-foward",
                changes: { name: "Fireball", label: undefined, display: { mode: "text", text: "🌀" } },
              },
            ],
          },
        ],
      },
    },
  ],
  definitions: {
    "street-fighter": [
      {
        id: "custom.street-fighter.lp",
        name: "Jab",
        aliases: ["lp"],
        basedOn: "sf.light-punch",
        saved: true,
        more: { name: "Wiki", url: "https://example.com/jab" },
      },
    ],
  },
});

const failure = (text: string) => {
  const result = parseExport(text);
  if (result.ok) throw new Error("expected a failure");
  return result.error;
};

describe("serializeExport and parseExport", () => {
  it("writes readable JSON that parses back to the same envelope, cleared fields included", () => {
    const text = serializeExport(envelope());

    expect(text.startsWith('{\n  "format": "fg-input-translator"')).toBe(true);
    expect(parseExport(text)).toStrictEqual({ ok: true, envelope: envelope() });
  });

  it("accepts the export wrapped in a fenced code block, even inside surrounding text", () => {
    const text = serializeExport(envelope());
    const fence = "`".repeat(3);

    expect(parseExport(`${fence}json\n${text}\n${fence}`)).toStrictEqual({ ok: true, envelope: envelope() });
    expect(
      parseExport(`Please add this move!\n\n${fence}json\n${text}\n${fence}\n\nThanks`),
    ).toStrictEqual({ ok: true, envelope: envelope() });
  });

  it("says what is wrong with text that is not an export", () => {
    expect(failure("{nope")).toMatchObject({ code: "invalid-json" });
    for (const text of ["{}", "[]", '"text"', '{"version":1,"selectedGame":"x","customLayers":{},"games":{}}']) {
      expect(failure(text)).toMatchObject({ code: "not-an-export" });
    }
    expect(failure(JSON.stringify({ ...envelope(), format: "something-else" }))).toMatchObject({
      code: "not-an-export",
    });
  });

  it("refuses a newer version", () => {
    expect(failure(JSON.stringify({ ...envelope(), version: 2 }))).toMatchObject({ code: "newer-version" });
  });

  it.each([
    ["tabs", (e: any) => void (e.tabs = {}), "tabs"],
    ["game id", (e: any) => void (e.tabs[0].gameId = 5), "tabs[0].gameId"],
    ["tab name", (e: any) => void (e.tabs[0].tab.name = 5), "tabs[0].tab.name"],
    ["notation", (e: any) => void (e.tabs[0].tab.rows[0].notation = 5), "tabs[0].tab.rows[0].notation"],
    [
      "occurrence",
      (e: any) => void (e.tabs[0].tab.rows[0].customizations[0].anchor.occurrence = -1),
      "tabs[0].tab.rows[0].customizations[0].anchor.occurrence",
    ],
    ["definitions", (e: any) => void (e.definitions = []), "definitions"],
    ["definition list", (e: any) => void (e.definitions["street-fighter"] = {}), "definitions.street-fighter"],
    ["alias", (e: any) => void (e.definitions["street-fighter"][0].aliases = [1]), "definitions.street-fighter[0].aliases[0]"],
    [
      "insecure link",
      (e: any) => void (e.definitions["street-fighter"][0].more.url = "http://insecure.example/"),
      "definitions.street-fighter[0].more.url",
    ],
  ])("rejects a bad shape: %s", (_name, mutate, path) => {
    const raw = JSON.parse(serializeExport(envelope()));
    mutate(raw);

    expect(failure(JSON.stringify(raw))).toEqual({ code: "invalid-shape", path, message: expect.any(String) });
  });

  it("refuses text that is far too large to be a hand-shared configuration", () => {
    expect(failure("a".repeat(5_000_001))).toMatchObject({ code: "too-large" });
  });
});
