import { describe, expect, it } from "vitest";
import { deleteDefinition, saveAsDefinition } from "./custom";
import type { TokenDefinition } from "./types";

const punch: TokenDefinition = {
  id: "sf.light-punch",
  name: "Light Punch",
  type: "action",
  aliases: ["lp", "LP"],
  display: { mode: "image", asset: "ActionLightPunch" },
  description: "A weak punch.",
};

describe("saveAsDefinition", () => {
  it("adds a saved definition for the Token's text to that Game's layer, derived from the Pure one", () => {
    const before = {};

    const after = saveAsDefinition(before, "street-fighter", punch, "l p", {
      display: { mode: "text", text: "👊" },
    });

    expect(before).toEqual({});
    expect(after).toEqual({
      "street-fighter": [
        {
          ...punch,
          id: "custom.street-fighter.lp",
          aliases: ["lp"],
          display: { mode: "text", text: "👊" },
          basedOn: "sf.light-punch",
          saved: true,
        },
      ],
    });
  });

  it("replaces the saved definition when the same text is saved again", () => {
    const once = saveAsDefinition({}, "street-fighter", punch, "lp", { name: "Jab" });
    const twice = saveAsDefinition(once, "street-fighter", punch, "lp", { label: "fast" });

    expect(twice["street-fighter"]).toHaveLength(1);
    expect(twice["street-fighter"]![0]).toMatchObject({ name: "Light Punch", label: "fast" });
  });

  it("keeps pointing at the Pure definition when the base is itself a custom one", () => {
    const first = saveAsDefinition({}, "street-fighter", punch, "lp", { name: "Jab" });
    const saved = first["street-fighter"]![0]!;

    const second = saveAsDefinition(first, "street-fighter", saved, "jab", { label: "x" });

    expect(second["street-fighter"]!.find((d) => d.id === "custom.street-fighter.jab")).toMatchObject({
      basedOn: "sf.light-punch",
    });
  });
});

describe("deleteDefinition", () => {
  it("removes a saved definition and drops the Game's layer once it is empty", () => {
    const saved = saveAsDefinition({}, "street-fighter", punch, "lp", { name: "Jab" });

    expect(deleteDefinition(saved, "street-fighter", "custom.street-fighter.lp")).toEqual({});
    expect(saved["street-fighter"]).toHaveLength(1);
  });
});
