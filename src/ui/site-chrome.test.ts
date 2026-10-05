// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { createAboutDialog, createReferenceDialog, renderFooter, renderHeader } from "./site-chrome";
import type { HeaderModel } from "./site-chrome";

const icon = '<svg viewBox="0 0 1 1"><path fill="currentColor" d="M0 0h1v1H0z"/></svg>';

const header = (overrides: Partial<HeaderModel> = {}): HeaderModel => ({
  version: "0.7.0",
  logo: icon,
  glossaryUrl: "https://glossary.infil.net/?t=Numpad%20Notation",
  links: [
    { label: "GitHub", url: "https://github.com/ygg-m/fg-input-translator", icon, group: "community" },
    { label: "Discord", url: "https://discord.gg/ZapfK82Fjk", icon, group: "community" },
    { label: "Ko-fi", url: "https://ko-fi.com/yggm_", icon, group: "support" },
  ],
  ...overrides,
});

const handlers = () => ({ onAbout: vi.fn(), onReference: vi.fn() });
const click = (root: ParentNode, action: string) =>
  root.querySelector<HTMLButtonElement>(`[data-action="${action}"]`)!.click();

describe("renderHeader", () => {
  it("shows the title, version, tagline with the glossary link, and the logo", () => {
    const el = renderHeader(document, header(), handlers());

    expect(el.querySelector("h1")!.textContent).toBe("Fight Game Input Translator");
    expect(el.querySelector(".version")!.textContent).toBe("alpha v0.7.0");
    expect(el.querySelector(".logo svg")).not.toBeNull();

    const glossary = el.querySelector<HTMLAnchorElement>(".tagline a")!;
    expect(glossary.href).toBe("https://glossary.infil.net/?t=Numpad%20Notation");
    expect(glossary.rel).toBe("noopener noreferrer");
  });

  it("links to the community and support pages with an accessible name and an inline icon", () => {
    const el = renderHeader(document, header(), handlers());

    const links = [...el.querySelectorAll<HTMLAnchorElement>(".site-links a")];
    expect(links.map((a) => a.getAttribute("aria-label"))).toEqual(["GitHub", "Discord", "Ko-fi"]);
    expect(links.map((a) => a.href)).toEqual([
      "https://github.com/ygg-m/fg-input-translator",
      "https://discord.gg/ZapfK82Fjk",
      "https://ko-fi.com/yggm_",
    ]);
    for (const link of links) {
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.querySelector("svg")).not.toBeNull();
    }
  });

  it("leaves out a link that is not https", () => {
    const el = renderHeader(
      document,
      header({ links: [{ label: "Bad", url: "javascript:alert(1)", icon, group: "community" }] }),
      handlers(),
    );

    expect(el.querySelectorAll(".site-links a")).toHaveLength(0);
  });

  it("opens the About and All Inputs dialogs through its buttons", () => {
    const h = handlers();
    const el = renderHeader(document, header(), h);

    click(el, "about");
    click(el, "reference");

    expect(h.onAbout).toHaveBeenCalledTimes(1);
    expect(h.onReference).toHaveBeenCalledTimes(1);
  });
});

describe("renderFooter", () => {
  it("credits the author with a link", () => {
    const el = renderFooter(document, { author: "Ygor Goulart", url: "https://linktr.ee/yggm" });

    expect(el.textContent).toContain("Made by");
    const link = el.querySelector<HTMLAnchorElement>("a")!;
    expect(link.textContent).toBe("Ygor Goulart");
    expect(link.href).toBe("https://linktr.ee/yggm");
    expect(link.rel).toBe("noopener noreferrer");
  });
});

describe("createAboutDialog", () => {
  it("shows the paragraphs with their links, and closes", () => {
    const onClose = vi.fn();
    const dialog = createAboutDialog(
      document,
      {
        title: "What is this?",
        paragraphs: [
          ["Plain text."],
          ["Read the ", { text: "glossary", href: "https://glossary.infil.net/" }, " for more."],
        ],
      },
      onClose,
    );

    expect(dialog.tagName).toBe("DIALOG");
    expect(dialog.querySelector("h2")!.textContent).toBe("What is this?");
    const paragraphs = [...dialog.querySelectorAll("p")];
    expect(paragraphs.map((p) => p.textContent)).toEqual(["Plain text.", "Read the glossary for more."]);
    const link = paragraphs[1]!.querySelector<HTMLAnchorElement>("a")!;
    expect(link.href).toBe("https://glossary.infil.net/");
    expect(link.rel).toBe("noopener noreferrer");

    click(dialog, "close");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps hostile text inert and shows an unsafe link as plain text", () => {
    const hostile = '<img src=x onerror="alert(1)">';
    const dialog = createAboutDialog(
      document,
      { title: hostile, paragraphs: [[hostile, { text: "click", href: "javascript:alert(1)" }]] },
      vi.fn(),
    );

    expect(dialog.querySelector("img")).toBeNull();
    expect(dialog.querySelector("a")).toBeNull();
    expect(dialog.querySelector("p")!.textContent).toBe(hostile + "click");
  });
});

describe("createReferenceDialog", () => {
  it("lists each section's inputs as 'aliases → name', as inert text", () => {
    const hostile = '<img src=x onerror="alert(1)">';
    const onClose = vi.fn();
    const dialog = createReferenceDialog(
      document,
      [
        { title: "Shared by every game", entries: [{ aliases: ["6", "f"], name: "Forward" }] },
        { title: "Game One", entries: [{ aliases: ["P"], name: hostile }] },
      ],
      onClose,
    );

    expect([...dialog.querySelectorAll("h3")].map((h) => h.textContent)).toEqual(["Shared by every game", "Game One"]);
    const items = [...dialog.querySelectorAll("li")].map((li) => li.textContent);
    expect(items).toEqual(["6 or f → Forward", `P → ${hostile}`]);
    expect(dialog.querySelector("img")).toBeNull();

    click(dialog, "close");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
