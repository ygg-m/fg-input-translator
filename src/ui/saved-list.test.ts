// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import type { TokenDefinition } from "../core/types";
import { renderSavedList } from "./saved-list";

const saved = (id: string, name: string, aliases: string[]): TokenDefinition => ({
  id,
  name,
  aliases,
  basedOn: "sf.light-punch",
  saved: true,
});

describe("renderSavedList", () => {
  it("lists each saved definition with its aliases and lets the user delete it", () => {
    const onDelete = vi.fn();
    const list = renderSavedList(
      document,
      [saved("custom.sf.lp", "<b>Jab</b>", ["lp", "jab"]), saved("custom.sf.mp", "Mid", ["mp"])],
      onDelete,
    );

    const items = [...list.querySelectorAll("li")];
    expect(items).toHaveLength(2);
    expect(items[0]!.querySelector(".saved-name")!.textContent).toBe("<b>Jab</b>");
    expect(items[0]!.querySelector("b")).toBeNull();
    expect(items[0]!.querySelector(".saved-aliases")!.textContent).toBe("lp, jab");

    items[1]!.querySelector<HTMLButtonElement>('[data-action="delete"]')!.click();
    expect(onDelete).toHaveBeenCalledWith("custom.sf.mp");
  });

  it("says so when nothing is saved", () => {
    const list = renderSavedList(document, [], vi.fn());

    expect(list.querySelectorAll("li")).toHaveLength(0);
    expect(list.textContent).toContain("No saved definitions");
  });
});
