import { describe, expect, it } from "vitest";
import type { GameRegistry } from "./games";
import { decodeShare, encodeRowLink, encodeRowShare, encodeTabLink, usedDefinitions } from "./share";
import type { SharedTab } from "./share";
import type { TokenDefinition } from "./types";

const games = [
  { id: "guilty-gear", name: "Guilty Gear" },
  { id: "street-fighter", name: "Street Fighter" },
  { id: "thems-fightin-herds", name: "Them's Fightin' Herds" },
];

describe("readable row links", () => {
  it.each([
    "236P > 623K",
    "a/b",
    "#hash",
    "what?",
    "100%",
    "``comment``",
    "it's",
    "日本語 🔥",
    "[{236P}x2] 5K+P",
  ])("round-trips %s", async (notation) => {
    const hash = encodeRowLink("street-fighter", notation);

    expect(hash.startsWith("#/street-fighter/")).toBe(true);
    expect(hash.slice("#/street-fighter/".length)).not.toMatch(/[/#?]/);
    expect(await decodeShare(hash, games)).toEqual({
      kind: "row",
      gameId: "street-fighter",
      notation,
    });
  });
});

describe("links from the previous version", () => {
  const row = (hash: string) => decodeShare(hash, games);

  it.each([
    ["encoded name and notation", "#/Guilty%20Gear/236P%20%3E%20623K", "guilty-gear", "236P > 623K"],
    ["spaces-only encoding", "#/Street%20Fighter/236P%20>%20623K", "street-fighter", "236P > 623K"],
    ["apostrophes in the name", "#/Them%27s%20Fightin%27%20Herds/5A", "thems-fightin-herds", "5A"],
    ["backticks", "#/Guilty%20Gear/%60%60note%60%60", "guilty-gear", "``note``"],
    ["slashes in the notation", "#/Guilty%20Gear/a/b", "guilty-gear", "a/b"],
    ["a stray percent sign", "#/Guilty%20Gear/100%", "guilty-gear", "100%"],
    ["game id instead of name", "#/street-fighter/5K", "street-fighter", "5K"],
  ])("opens %s", async (_name, hash, gameId, notation) => {
    expect(await row(hash)).toEqual({ kind: "row", gameId, notation });
  });

  it("opens an unknown game in the default game and says which name was not found", async () => {
    expect(await row("#/Removed%20Game/236P")).toEqual({
      kind: "row",
      gameId: "guilty-gear",
      notation: "236P",
      warning: { code: "unknown-game", name: "Removed Game" },
    });
  });

  it("selects only the game when there is no notation, and ignores an empty hash", async () => {
    expect(await row("#/Street%20Fighter")).toEqual({ kind: "row", gameId: "street-fighter", notation: "" });
    for (const empty of ["", "#", "#/"]) expect(await row(empty)).toEqual({ kind: "none" });
  });
});

const sharedTab = (): SharedTab => ({
  gameId: "street-fighter",
  tab: {
    name: "Ryu 日本 combos",
    rows: [
      {
        notation: "236P > 623K",
        label: "BnB 🔥",
        customizations: [
          {
            anchor: { text: "236", occurrence: 0 },
            basedOn: "base.quarter-circle-foward",
            changes: { name: "Fireball", label: undefined, display: { mode: "text", text: "🌀" } },
          },
        ],
      },
      { notation: "5K", customizations: [] },
    ],
  },
  definitions: [
    {
      id: "custom.street-fighter.lp",
      name: "Jab",
      aliases: ["lp"],
      basedOn: "sf.light-punch",
      saved: true,
      more: { name: "Wiki", url: "https://example.com/jab" },
    },
  ],
});

describe("tab links", () => {
  it("round-trips a tab with its customizations and saved definitions in a url-safe payload", async () => {
    const { hash, length } = await encodeTabLink(sharedTab());

    expect(hash).toMatch(/^#\/s\/[A-Za-z0-9_-]+$/);
    expect(length).toBe(hash.length);
    expect(await decodeShare(hash, games)).toStrictEqual({ kind: "tab", ...sharedTab() });
  });
});

describe("damaged or hostile tab links", () => {
  // Build a link payload from any text, the way the app does.
  const pack = async (text: string) => {
    const stream = new Blob([new TextEncoder().encode(text)]).stream().pipeThrough(new CompressionStream("deflate-raw"));
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).split("+").join("-").split("/").join("_").split("=").join("");
  };
  const workspaceJson = async () => {
    const { hash } = await encodeTabLink(sharedTab());
    const bytes = Uint8Array.from(atob(hash.slice(4).split("-").join("+").split("_").join("/").padEnd(Math.ceil(hash.slice(4).length / 4) * 4, "=")), (c) => c.charCodeAt(0));
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return JSON.parse(new TextDecoder().decode(await new Response(stream).arrayBuffer()));
  };
  const open = async (payload: string) => decodeShare("#/s/" + payload, games);
  const failure = async (payload: string) => {
    const result = await open(payload);
    if (result.kind !== "error") throw new Error("expected an error, got " + result.kind);
    return result.error;
  };

  it("reports characters that cannot be part of a link, and data that is not compressed", async () => {
    expect(await failure("not valid!!")).toMatchObject({ code: "invalid-link" });
    expect(await failure("AAECAwQFBgcICQ")).toMatchObject({ code: "invalid-link" });
  });

  it("reports compressed text that is not JSON", async () => {
    expect(await failure(await pack("{nope"))).toMatchObject({ code: "invalid-json" });
  });

  it("reports a bad shape with the path, an insecure link, and a newer version", async () => {
    const base = await workspaceJson();

    const badShape = structuredClone(base);
    badShape.selectedGame = 5;
    expect(await failure(await pack(JSON.stringify(badShape)))).toMatchObject({
      code: "invalid-shape",
      path: "selectedGame",
    });

    const insecure = structuredClone(base);
    insecure.customLayers["street-fighter"][0].more.url = "http://insecure.example/";
    expect(await failure(await pack(JSON.stringify(insecure)))).toMatchObject({
      code: "invalid-shape",
      path: "customLayers.street-fighter[0].more.url",
    });

    expect(await failure(await pack(JSON.stringify({ ...base, version: 3 })))).toMatchObject({
      code: "newer-version",
    });
  });

  it("requires exactly one tab of one game", async () => {
    const two = await workspaceJson();
    two.games["street-fighter"].tabs.push({ ...two.games["street-fighter"].tabs[0], id: "tab-2" });
    expect(await failure(await pack(JSON.stringify(two)))).toMatchObject({ code: "invalid-shape", path: "games" });

    const none = await workspaceJson();
    none.games = {};
    expect(await failure(await pack(JSON.stringify(none)))).toMatchObject({ code: "invalid-shape", path: "games" });
  });

  it("refuses payloads that unpack to something enormous or links that are huge", async () => {
    expect(await failure(await pack("a".repeat(3_000_000)))).toMatchObject({ code: "invalid-link" });
    expect(await failure("A".repeat(250_000))).toMatchObject({ code: "invalid-link" });
  });
});

describe("encodeRowShare", () => {
  it("uses the readable link for a plain row and a compressed tab when there is more to carry", async () => {
    const plain = await encodeRowShare("street-fighter", { notation: "236P", customizations: [] }, []);
    expect(plain.hash).toBe(encodeRowLink("street-fighter", "236P"));

    const custom = {
      notation: "236P",
      customizations: [{ anchor: { text: "236", occurrence: 0 }, basedOn: "m", changes: { name: "Mine" } }],
    };
    const withCustomization = await encodeRowShare("street-fighter", custom, []);
    expect(withCustomization.hash.startsWith("#/s/")).toBe(true);
    expect(await decodeShare(withCustomization.hash, games)).toMatchObject({
      kind: "tab",
      gameId: "street-fighter",
      tab: { rows: [custom] },
    });

    const jab: TokenDefinition = { id: "custom.g.P", name: "Jab", aliases: ["P"], basedOn: "base.punch", saved: true };
    const withDefinition = await encodeRowShare("street-fighter", { notation: "P", customizations: [] }, [jab]);
    expect(withDefinition.hash.startsWith("#/s/")).toBe(true);
  });
});

describe("usedDefinitions", () => {
  const punch: TokenDefinition = { id: "base.punch", name: "Punch", aliases: ["P"] };
  const kick: TokenDefinition = { id: "base.kick", name: "Kick", aliases: ["K"] };
  const registry: GameRegistry = {
    base: [punch, kick],
    games: [{ id: "g1", name: "G1", definitions: [] }],
  };
  const jab: TokenDefinition = { id: "custom.g1.P", name: "Jab", aliases: ["P"], basedOn: "base.punch", saved: true };
  const roundhouse: TokenDefinition = { id: "custom.g1.K", name: "Roundhouse", aliases: ["K"], basedOn: "base.kick", saved: true };
  const layers = { g1: [jab, roundhouse] };
  const rows = (...notations: string[]) => notations.map((notation) => ({ notation, customizations: [] }));

  it("returns only the saved definitions the rows actually resolve to", () => {
    expect(usedDefinitions(rows("P P"), "g1", registry, layers)).toEqual([jab]);
    expect(usedDefinitions(rows("P", "K"), "g1", registry, layers)).toEqual([jab, roundhouse]);
    expect(usedDefinitions(rows("2"), "g1", registry, layers)).toEqual([]);
    expect(usedDefinitions(rows("P"), "g1", registry, {})).toEqual([]);
  });

  it("still includes a saved definition that a row customization builds on", () => {
    const customized = [
      {
        notation: "P",
        customizations: [{ anchor: { text: "P", occurrence: 0 }, basedOn: "custom.g1.P", changes: { label: "x" } }],
      },
    ];

    expect(usedDefinitions(customized, "g1", registry, layers)).toEqual([jab]);
  });
});
