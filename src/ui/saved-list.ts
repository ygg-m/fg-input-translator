import type { TokenDefinition } from "../core/types";

const textElement = (doc: Document, tag: string, className: string, text: string) => {
  const element = doc.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
};

/** The Game's saved Custom Token Definitions, each with a delete button. */
export function renderSavedList(
  doc: Document,
  definitions: TokenDefinition[],
  onDelete: (id: string) => void,
): HTMLElement {
  const container = doc.createElement("div");
  container.className = "saved-list";

  if (definitions.length === 0) {
    container.append(textElement(doc, "p", "saved-empty", "No saved definitions yet."));
    return container;
  }

  const list = doc.createElement("ul");
  for (const definition of definitions) {
    const item = doc.createElement("li");
    const remove = textElement(doc, "button", "", "Delete");
    remove.setAttribute("type", "button");
    remove.dataset.action = "delete";
    remove.addEventListener("click", () => onDelete(definition.id));

    item.append(
      textElement(doc, "span", "saved-name", definition.name),
      textElement(doc, "code", "saved-aliases", definition.aliases.join(", ")),
      remove,
    );
    list.append(item);
  }
  container.append(list);
  return container;
}
