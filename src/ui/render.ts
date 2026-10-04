import type { ViewNode } from "../core/view";

export type AssetResolver = (assetId: string) => string | undefined;

export interface RenderOptions {
  /** Called with the innermost Token or group that was clicked, or activated with Enter or Space. */
  onSelect?: (node: ViewNode) => void;
}

const textElement = (doc: Document, className: string, text: string) => {
  const element = doc.createElement("span");
  element.className = className;
  element.textContent = text;
  return element;
};

// What a Token shows is decided only by its display properties; every string
// goes in through textContent so imported data can never inject markup.
function renderDisplay(node: ViewNode, doc: Document, assets: AssetResolver): HTMLElement {
  const { display } = node;

  if (display.mode === "image") {
    const url = assets(display.asset);
    if (url !== undefined) {
      const img = doc.createElement("img");
      img.className = "token-image";
      img.src = url;
      img.alt = node.name;
      const { rotate, flipX } = display.transform ?? {};
      img.style.transform = `rotate(${rotate ?? 0}deg)${flipX ? " scaleX(-1)" : ""}`;
      return img;
    }
  }

  if (display.mode === "text") return textElement(doc, "token-text", display.text);
  return textElement(doc, "token-label", node.name);
}

// Identity for click-to-customize and assistive tech: which definition, which text span.
function mark(element: HTMLElement, node: ViewNode) {
  element.dataset.definitionId = node.definitionId;
  element.dataset.start = String(node.start);
  element.dataset.end = String(node.end);
  element.setAttribute("aria-label", node.accessibleName);
  if (node.unknown) {
    element.dataset.unknown = "true";
    element.classList.add("unknown");
  }
}

let tooltipCount = 0;

// Shown on hover and keyboard focus by CSS alone; the owner points at it with aria-describedby.
function attachTooltip(owner: HTMLElement, node: ViewNode, doc: Document) {
  const tooltip = doc.createElement("span");
  tooltip.className = "tooltip";
  tooltip.id = `tooltip-${++tooltipCount}`;
  tooltip.setAttribute("role", "tooltip");
  tooltip.append(textElement(doc, "tooltip-name", node.name));
  if (node.custom) {
    const note = node.custom === "saved" ? "Custom (saved)" : "Custom (this row only)";
    tooltip.append(textElement(doc, "tooltip-custom", note));
  }
  if (node.description) tooltip.append(textElement(doc, "tooltip-description", node.description));
  if (node.more) {
    const link = doc.createElement("a");
    link.href = node.more.url;
    link.rel = "noopener noreferrer";
    link.target = "_blank";
    link.textContent = node.more.name;
    tooltip.append(link);
  }
  owner.tabIndex = 0;
  owner.setAttribute("aria-describedby", tooltip.id);
  owner.append(tooltip);
}

// Selection is ignored inside tooltips so their links keep working.
function makeSelectable(element: HTMLElement, node: ViewNode, onSelect: (node: ViewNode) => void) {
  const insideTooltip = (event: Event) =>
    event.target instanceof Element && event.target.closest(".tooltip") !== null;

  element.addEventListener("click", (event) => {
    if (insideTooltip(event)) return;
    event.stopPropagation();
    onSelect(node);
  });
  element.addEventListener("keydown", (event) => {
    if (event.target !== element) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(node);
  });
}

function renderNode(
  node: ViewNode,
  doc: Document,
  assets: AssetResolver,
  options: RenderOptions,
): HTMLElement {
  if (node.kind === "group") {
    const group = doc.createElement("span");
    group.className = "group";
    group.append(textElement(doc, "group-label", node.label ?? node.name));

    const body = doc.createElement("span");
    body.className = "group-body";
    if (node.content !== undefined) body.append(textElement(doc, "group-content", node.content));
    for (const child of node.children) body.append(renderNode(child, doc, assets, options));
    group.append(body);
    mark(group, node);
    attachTooltip(group, node, doc);
    if (options.onSelect) makeSelectable(group, node, options.onSelect);
    return group;
  }

  const element = doc.createElement("span");
  element.className = "token";
  element.append(renderDisplay(node, doc, assets));
  if (node.custom) element.append(textElement(doc, "custom-tag", "custom"));
  mark(element, node);
  attachTooltip(element, node, doc);
  if (options.onSelect) makeSelectable(element, node, options.onSelect);
  return element;
}

export function renderView(
  nodes: ViewNode[],
  doc: Document,
  assets: AssetResolver,
  options: RenderOptions = {},
): HTMLElement {
  const root = doc.createElement("div");
  root.className = "notation";
  for (const node of nodes) root.append(renderNode(node, doc, assets, options));
  return root;
}
