// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { renderShareBanner } from "./share-banner";

const click = (root: ParentNode, action: string) =>
  root.querySelector<HTMLButtonElement>(`[data-action="${action}"]`)!.click();

describe("renderShareBanner", () => {
  it("names the shared tab as unsaved and offers Save and Dismiss", () => {
    const handlers = { onSave: vi.fn(), onDismiss: vi.fn() };
    const banner = renderShareBanner(document, { tabName: "Ryu combos", skipped: 0 }, handlers);

    expect(banner.getAttribute("role")).toBe("status");
    expect(banner.textContent).toContain("Ryu combos");
    expect(banner.textContent).toMatch(/not saved/i);
    expect(banner.querySelector(".share-banner-skipped")).toBeNull();

    click(banner, "save");
    click(banner, "dismiss");
    expect(handlers.onSave).toHaveBeenCalledTimes(1);
    expect(handlers.onDismiss).toHaveBeenCalledTimes(1);
  });

  it("says when some shared definitions would not be added", () => {
    const handlers = { onSave: vi.fn(), onDismiss: vi.fn() };

    const one = renderShareBanner(document, { tabName: "T", skipped: 1 }, handlers);
    const many = renderShareBanner(document, { tabName: "T", skipped: 3 }, handlers);

    expect(one.querySelector(".share-banner-skipped")!.textContent).toContain("1 shared definition ");
    expect(many.querySelector(".share-banner-skipped")!.textContent).toContain("3 shared definitions ");
    expect(many.querySelector(".share-banner-skipped")!.textContent).toMatch(/already/);
  });

  it("keeps a hostile tab name inert", () => {
    const hostile = '<img src=x onerror="alert(1)">';
    const banner = renderShareBanner(document, { tabName: hostile, skipped: 0 }, { onSave: vi.fn(), onDismiss: vi.fn() });

    expect(banner.querySelector("img")).toBeNull();
    expect(banner.textContent).toContain(hostile);
  });
});
