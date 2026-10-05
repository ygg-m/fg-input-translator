import type { ReferenceSection } from "../core/reference";

export interface SiteLink {
  label: string;
  url: string;
  /** Inline SVG markup from a bundled asset (it uses currentColor, so the page can tint it). */
  icon: string;
  group: "community" | "support";
}

export interface HeaderModel {
  version: string;
  /** Inline SVG markup of the logo. */
  logo: string;
  glossaryUrl: string;
  links: SiteLink[];
}

export interface HeaderHandlers {
  onAbout: () => void;
  onReference: () => void;
}

/** A run of text, or text that is a link. */
export type TextPart = string | { text: string; href: string };

const isHttps = (url: string) => {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
};

function textElement(doc: Document, tag: string, className: string, text: string) {
  const element = doc.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function link(doc: Document, href: string, text: string) {
  const anchor = doc.createElement("a");
  anchor.href = href;
  anchor.rel = "noopener noreferrer";
  anchor.textContent = text;
  return anchor;
}

// Only the app's own bundled assets are ever passed in here, never user or link data.
function inlineSvg(doc: Document, markup: string): Element | null {
  const template = doc.createElement("template");
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
}

function button(doc: Document, action: string, text: string) {
  const element = doc.createElement("button");
  element.type = "button";
  element.dataset.action = action;
  element.textContent = text;
  return element;
}

export function renderHeader(doc: Document, model: HeaderModel, handlers: HeaderHandlers): HTMLElement {
  const header = doc.createElement("header");
  header.className = "site-header";

  const links = doc.createElement("div");
  links.className = "site-links";
  for (const group of ["community", "support"] as const) {
    for (const item of model.links.filter((l) => l.group === group)) {
      if (!isHttps(item.url)) continue;
      const anchor = link(doc, item.url, "");
      anchor.setAttribute("aria-label", item.label);
      const svg = inlineSvg(doc, item.icon);
      if (svg) anchor.append(svg);
      links.append(anchor);
    }
  }

  const logo = doc.createElement("div");
  logo.className = "logo";
  const logoSvg = inlineSvg(doc, model.logo);
  if (logoSvg) logo.append(logoSvg);
  logo.append(textElement(doc, "span", "version", `alpha v${model.version}`));

  const tagline = doc.createElement("p");
  tagline.className = "tagline";
  tagline.append(doc.createTextNode("Translate "));
  tagline.append(link(doc, model.glossaryUrl, "numpad notations"));
  tagline.append(doc.createTextNode(" into visual inputs!"));

  const about = button(doc, "about", "About");
  about.addEventListener("click", () => handlers.onAbout());
  const reference = button(doc, "reference", "All Inputs");
  reference.addEventListener("click", () => handlers.onReference());
  const buttons = doc.createElement("div");
  buttons.className = "site-buttons";
  buttons.append(about, reference);

  header.append(links, logo, textElement(doc, "h1", "", "Fight Game Input Translator"), tagline, buttons);
  return header;
}

export function renderFooter(doc: Document, credit: { author: string; url: string }): HTMLElement {
  const footer = doc.createElement("footer");
  footer.className = "site-footer";
  footer.append(doc.createTextNode("Made by "));
  footer.append(link(doc, credit.url, credit.author));
  return footer;
}

function dialogWithClose(doc: Document, className: string, title: string, onClose: () => void) {
  const dialog = doc.createElement("dialog");
  dialog.className = className;
  dialog.append(textElement(doc, "h2", "", title));
  const close = button(doc, "close", "Close");
  close.addEventListener("click", () => onClose());
  return { dialog, close };
}

export function createAboutDialog(
  doc: Document,
  content: { title: string; paragraphs: TextPart[][] },
  onClose: () => void,
): HTMLDialogElement {
  const { dialog, close } = dialogWithClose(doc, "about-dialog", content.title, onClose);

  for (const parts of content.paragraphs) {
    const paragraph = doc.createElement("p");
    for (const part of parts) {
      if (typeof part === "string") paragraph.append(doc.createTextNode(part));
      else if (isHttps(part.href)) paragraph.append(link(doc, part.href, part.text));
      else paragraph.append(doc.createTextNode(part.text));
    }
    dialog.append(paragraph);
  }
  dialog.append(close);
  return dialog;
}

export function createReferenceDialog(
  doc: Document,
  sections: ReferenceSection[],
  onClose: () => void,
): HTMLDialogElement {
  const { dialog, close } = dialogWithClose(doc, "reference-dialog", "All Inputs", onClose);

  for (const section of sections) {
    dialog.append(textElement(doc, "h3", "", section.title));
    const list = doc.createElement("ul");
    for (const entry of section.entries) {
      list.append(textElement(doc, "li", "", `${entry.aliases.join(" or ")} → ${entry.name}`));
    }
    dialog.append(list);
  }
  dialog.append(close);
  return dialog;
}
