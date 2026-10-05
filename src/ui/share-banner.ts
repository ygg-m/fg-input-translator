export interface ShareBannerModel {
  tabName: string;
  /** How many shared definitions would not be added because you already save the same text. */
  skipped: number;
}

export interface ShareBannerHandlers {
  onSave: () => void;
  onDismiss: () => void;
}

const textElement = (doc: Document, tag: string, className: string, text: string) => {
  const element = doc.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
};

/** Shown while a tab opened from a link has not been saved to the user's own data yet. */
export function renderShareBanner(
  doc: Document,
  model: ShareBannerModel,
  handlers: ShareBannerHandlers,
): HTMLElement {
  const banner = doc.createElement("div");
  banner.className = "share-banner";
  banner.setAttribute("role", "status");

  banner.append(
    textElement(doc, "p", "share-banner-text", `Shared tab "${model.tabName}" is not saved yet.`),
  );
  if (model.skipped > 0) {
    const noun = model.skipped === 1 ? "definition" : "definitions";
    banner.append(
      textElement(
        doc,
        "p",
        "share-banner-skipped",
        `${model.skipped} shared ${noun} will not be added because you already save ones for the same text, so some tokens may look different from the sender's.`,
      ),
    );
  }

  const actions = doc.createElement("div");
  for (const [action, label, handler] of [
    ["save", "Save tab", handlers.onSave],
    ["dismiss", "Dismiss", handlers.onDismiss],
  ] as const) {
    const button = doc.createElement("button");
    button.type = "button";
    button.dataset.action = action;
    button.textContent = label;
    button.addEventListener("click", () => handler());
    actions.append(button);
  }
  banner.append(actions);
  return banner;
}
