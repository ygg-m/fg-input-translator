// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import type { ViewNode } from "../core/view";
import { renderView } from "./render";

const assets = (id: string) => ({ Motion6: "/assets/Motion6.svg" })[id as "Motion6"];

const token = (overrides: Partial<ViewNode> = {}): ViewNode =>
  ({
    kind: "token",
    text: "6",
    start: 0,
    end: 1,
    definitionId: "dir.forward",
    name: "Forward",
    display: { mode: "image", asset: "Motion6", transform: { rotate: 45, flipX: true } },
    accessibleName: "Forward",
    unknown: false,
    ...overrides,
  }) as ViewNode;

describe("renderView", () => {
  it("renders an image Token as an img from the asset map with alt text and its transform", () => {
    const root = renderView([token()], document, assets);

    const img = root.querySelector("img")!;
    expect(img.getAttribute("src")).toBe("/assets/Motion6.svg");
    expect(img.getAttribute("alt")).toBe("Forward");
    expect(img.style.transform).toBe("rotate(45deg) scaleX(-1)");
  });

  it("renders label and text Tokens as plain text so markup stays inert", () => {
    const hostile = "<script>alert(1)</script>";
    const root = renderView(
      [
        token({ name: hostile, display: { mode: "label" } }),
        token({ name: "Fire", display: { mode: "text", text: "<b>🔥</b>" } }),
      ],
      document,
      assets,
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("b")).toBeNull();
    const [label, text] = [...root.querySelectorAll(".token")];
    expect(label!.textContent).toContain(hostile);
    expect(text!.textContent).toContain("<b>🔥</b>");
  });

  it("falls back to the name as a label when an asset cannot be resolved", () => {
    const root = renderView(
      [token({ display: { mode: "image", asset: "Missing" } })],
      document,
      assets,
    );

    expect(root.querySelector("img")).toBeNull();
    expect(root.querySelector(".token")!.textContent).toContain("Forward");
  });

  it("renders a group as a labelled container around its children, or its content when literal", () => {
    const group = (overrides: Record<string, unknown>): ViewNode =>
      ({
        kind: "group",
        text: "",
        start: 0,
        end: 1,
        definitionId: "mech.repeat",
        name: "Repeat",
        display: { mode: "label" },
        label: "Repeat x3",
        accessibleName: "Repeat x3",
        unknown: false,
        children: [],
        ...overrides,
      }) as ViewNode;

    const root = renderView(
      [
        group({ children: [token()] }),
        group({ name: "Comment", label: "Comment", content: "hello <i>236</i>" }),
      ],
      document,
      assets,
    );

    const [repeat, comment] = [...root.querySelectorAll(".group")];
    expect(repeat!.querySelector(".group-label")!.textContent).toBe("Repeat x3");
    expect(repeat!.querySelectorAll(".group-body .token")).toHaveLength(1);
    expect(comment!.querySelector(".group-content")!.textContent).toBe("hello <i>236</i>");
    expect(comment!.querySelector("i")).toBeNull();
  });

  it("gives each node a keyboard-focusable tooltip with its name, description and a safe link", () => {
    const root = renderView(
      [
        token({
          description: "<em>Down, then forward.</em>",
          more: { name: "Glossary", url: "https://glossary.infil.net/?t=Quarter%20Circle" },
        }),
      ],
      document,
      assets,
    );

    const element = root.querySelector(".token")!;
    const tooltip = element.querySelector(".tooltip")!;
    expect(element.getAttribute("tabindex")).toBe("0");
    expect(tooltip.getAttribute("role")).toBe("tooltip");
    expect(element.getAttribute("aria-describedby")).toBe(tooltip.id);
    expect(tooltip.querySelector(".tooltip-name")!.textContent).toBe("Forward");
    expect(tooltip.querySelector(".tooltip-description")!.textContent).toBe("<em>Down, then forward.</em>");
    expect(tooltip.querySelector("em")).toBeNull();

    const link = tooltip.querySelector("a")!;
    expect(link.getAttribute("href")).toBe("https://glossary.infil.net/?t=Quarter%20Circle");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.textContent).toBe("Glossary");
  });

  it("exposes definition id and span as data attributes and marks unknown Tokens", () => {
    const root = renderView(
      [
        token({ start: 2, end: 3 }),
        token({
          definitionId: "unknown",
          name: "xyz",
          text: "xyz",
          start: 3,
          end: 6,
          display: { mode: "label" },
          accessibleName: 'Unknown: "xyz"',
          unknown: true,
        }),
      ],
      document,
      assets,
    );

    const [known, unknown] = [...root.querySelectorAll<HTMLElement>(".token")];
    expect(known!.dataset.definitionId).toBe("dir.forward");
    expect(known!.dataset.start).toBe("2");
    expect(known!.dataset.end).toBe("3");
    expect(known!.dataset.unknown).toBeUndefined();
    expect(unknown!.dataset.unknown).toBe("true");
    expect(unknown!.classList.contains("unknown")).toBe(true);
    expect(unknown!.getAttribute("aria-label")).toBe('Unknown: "xyz"');
  });
});
