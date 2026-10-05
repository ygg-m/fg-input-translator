import { describe, expect, it } from "vitest";
import { deserialize, serialize } from "./storage-format";
import type { Workspace } from "./workspace";

const workspace = (): Workspace => ({
  version: 1,
  selectedGame: "street-fighter",
  customLayers: {
    "street-fighter": [
      {
        id: "custom.street-fighter.lp",
        name: "Jab",
        aliases: ["lp"],
        display: { mode: "text", text: "👊" },
        more: { name: "Wiki", url: "https://example.com/jab" },
        basedOn: "sf.light-punch",
        saved: true,
      },
    ],
  },
  games: {
    "street-fighter": {
      activeTab: "tab-1",
      tabs: [
        {
          id: "tab-1",
          name: "Ryu Combos",
          rows: [
            {
              notation: "236P > 623K",
              label: "BnB",
              customizations: [
                {
                  anchor: { text: "236", occurrence: 0 },
                  basedOn: "base.quarter-circle-foward",
                  changes: { name: "Fireball motion", display: { mode: "label" } },
                },
              ],
            },
          ],
        },
      ],
    },
  },
});

describe("serialize and deserialize", () => {
  it("round-trips a workspace", () => {
    expect(deserialize(serialize(workspace()))).toEqual({ ok: true, workspace: workspace() });
  });

  it("keeps a cleared field distinct from an untouched one", () => {
    const ws = workspace();
    ws.games["street-fighter"]!.tabs[0]!.rows[0]!.customizations[0]!.changes = {
      label: undefined,
      description: undefined,
    };

    expect(deserialize(serialize(ws))).toStrictEqual({ ok: true, workspace: ws });
  });

  describe("validation", () => {
    const failure = (mutate: (raw: any) => unknown) => {
      const raw = JSON.parse(serialize(workspace()));
      const result = deserialize(JSON.stringify(mutate(raw) ?? raw));
      if (result.ok) throw new Error("expected a failure");
      return result.error;
    };
    const tab = (raw: any) => raw.games["street-fighter"].tabs[0];
    const row = (raw: any) => tab(raw).rows[0];
    const saved = (raw: any) => raw.customLayers["street-fighter"][0];
    const prefix = "games.street-fighter.tabs[0]";

    it("reports unreadable text and newer versions as such", () => {
      expect(deserialize("{nope")).toMatchObject({ ok: false, error: { code: "invalid-json" } });
      expect(failure((raw) => ({ ...raw, version: 2 }))).toMatchObject({ code: "newer-version" });
    });

    it.each([
      ["not an object", () => [], "workspace"],
      ["selectedGame", (r: any) => void (r.selectedGame = 3), "selectedGame"],
      ["games", (r: any) => void (r.games = []), "games"],
      ["tabs", (r: any) => void (r.games["street-fighter"].tabs = {}), "games.street-fighter.tabs"],
      ["notation", (r: any) => void (row(r).notation = 7), `${prefix}.rows[0].notation`],
      ["row label", (r: any) => void (row(r).label = 7), `${prefix}.rows[0].label`],
      ["active tab", (r: any) => void (r.games["street-fighter"].activeTab = "gone"), "games.street-fighter.activeTab"],
      [
        "duplicate tab ids",
        (r: any) => void r.games["street-fighter"].tabs.push({ ...tab(r) }),
        "games.street-fighter.tabs[1].id",
      ],
      [
        "occurrence",
        (r: any) => void (row(r).customizations[0].anchor.occurrence = -1),
        `${prefix}.rows[0].customizations[0].anchor.occurrence`,
      ],
      [
        "alias type",
        (r: any) => void (saved(r).aliases = [1]),
        "customLayers.street-fighter[0].aliases[0]",
      ],
    ])("rejects a bad shape: %s", (_name, mutate, path) => {
      expect(failure(mutate as (raw: any) => unknown)).toEqual({
        code: "invalid-shape",
        path,
        message: expect.any(String),
      });
    });

    it("rejects links that are not https, wherever they appear", () => {
      const inLayer = failure((r) => void (saved(r).more.url = "javascript:alert(1)"));
      const inCustomization = failure(
        (r) => void (row(r).customizations[0].changes.more = { name: "x", url: "http://insecure.example/" }),
      );

      expect(inLayer).toMatchObject({ code: "invalid-shape", path: "customLayers.street-fighter[0].more.url" });
      expect(inLayer.message).toMatch(/https/);
      expect(inCustomization).toMatchObject({
        code: "invalid-shape",
        path: `${prefix}.rows[0].customizations[0].changes.more.url`,
      });
    });

    it("rejects a display that cannot be rendered", () => {
      const bad = (display: unknown) => failure((r) => void (saved(r).display = display));

      expect(bad({ mode: "weird" }).path).toBe("customLayers.street-fighter[0].display.mode");
      expect(bad({ mode: "image" }).path).toBe("customLayers.street-fighter[0].display.asset");
      expect(bad({ mode: "text", text: 4 }).path).toBe("customLayers.street-fighter[0].display.text");
      expect(bad({ mode: "image", asset: "A", transform: { rotate: "90" } }).path).toBe(
        "customLayers.street-fighter[0].display.transform.rotate",
      );
    });
  });
});
