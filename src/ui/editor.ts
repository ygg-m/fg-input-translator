import type { Display, MoreLink } from "../core/types";
import type { TokenChanges } from "../core/row";

export interface EditorInit {
  /** The Token's text in the Notation; the default alias when saving as a definition. */
  text: string;
  definitionId: string;
  name: string;
  display: Display;
  label?: string;
  description?: string;
  more?: MoreLink;
  custom?: "instance" | "saved";
  /** Definitions this Token can be switched to. */
  choices: { id: string; name: string }[];
  assetIds: string[];
}

export interface EditorHandlers {
  onChange: (changes: TokenChanges) => void;
  onApply: (changes: TokenChanges) => void;
  onSave: (changes: TokenChanges, aliases: string[]) => void;
  onReset: () => void;
  onReassign: (definitionId: string) => void;
  onCancel: () => void;
}

function input(doc: Document, name: string, value: string): HTMLInputElement {
  const element = doc.createElement("input");
  element.name = name;
  element.value = value;
  return element;
}

function select(doc: Document, name: string, options: { value: string; text: string }[], value: string) {
  const element = doc.createElement("select");
  element.name = name;
  for (const option of options) {
    const item = doc.createElement("option");
    item.value = option.value;
    item.textContent = option.text;
    element.append(item);
  }
  element.value = value;
  return element;
}

function labelled(doc: Document, text: string, control: HTMLElement): HTMLLabelElement {
  const label = doc.createElement("label");
  label.append(doc.createTextNode(text), control);
  return label;
}

// Every value goes in through properties, never markup, so Token data cannot inject HTML.
export function createEditor(doc: Document, init: EditorInit, handlers: EditorHandlers): HTMLDialogElement {
  const dialog = doc.createElement("dialog");
  dialog.className = "editor";

  const form = doc.createElement("form");
  form.method = "dialog";

  const mode = init.display.mode;
  const assetId = init.display.mode === "image" ? init.display.asset : (init.assetIds[0] ?? "");
  const displayText = init.display.mode === "text" ? init.display.text : "";

  const description = doc.createElement("textarea");
  description.name = "description";
  description.value = init.description ?? "";

  form.append(
    labelled(
      doc,
      "Definition",
      select(doc, "definition", init.choices.map((c) => ({ value: c.id, text: c.name })), init.definitionId),
    ),
    labelled(doc, "Name", input(doc, "name", init.name)),
    labelled(
      doc,
      "Shows",
      select(
        doc,
        "mode",
        [
          { value: "image", text: "Image" },
          { value: "text", text: "Text or emoji" },
          { value: "label", text: "Name label" },
        ],
        mode,
      ),
    ),
    labelled(doc, "Image", select(doc, "asset", init.assetIds.map((id) => ({ value: id, text: id })), assetId)),
    labelled(doc, "Text", input(doc, "text", displayText)),
    labelled(doc, "Caption", input(doc, "label", init.label ?? "")),
    labelled(doc, "Description", description),
    labelled(doc, "Link text", input(doc, "linkName", init.more?.name ?? "")),
    labelled(doc, "Link (https)", input(doc, "linkUrl", init.more?.url ?? "")),
    labelled(
      doc,
      "Aliases when saved (comma separated)",
      input(doc, "aliases", init.text.replace(/\s+/g, "")),
    ),
  );

  const actions = doc.createElement("div");
  actions.className = "editor-actions";
  const button = (action: string, text: string) => {
    const element = doc.createElement("button");
    element.type = "button";
    element.dataset.action = action;
    element.textContent = text;
    return element;
  };
  const reset = button("reset", "Reset to pure");
  reset.disabled = init.custom === undefined;
  actions.append(
    button("apply", "Apply to this row"),
    button("save", "Save as definition"),
    reset,
    button("cancel", "Cancel"),
  );
  form.append(actions);

  const errorMessage = doc.createElement("p");
  errorMessage.className = "editor-error";
  errorMessage.setAttribute("role", "alert");
  form.append(errorMessage);

  dialog.append(form);

  const control = <T extends HTMLElement>(name: string) =>
    form.querySelector<T>(`[name="${name}"]`)!;
  const wrapper = (name: string) => control(name).closest("label")!;

  const showMatchingControls = () => {
    const chosen = control<HTMLSelectElement>("mode").value;
    wrapper("asset").hidden = chosen !== "image";
    wrapper("text").hidden = chosen !== "text";
  };

  // The display the form currently describes; an unchanged image keeps its transform.
  const currentDisplay = (): Display => {
    const chosen = control<HTMLSelectElement>("mode").value;
    if (chosen === "text") return { mode: "text", text: control<HTMLInputElement>("text").value };
    if (chosen === "image") {
      const asset = control<HTMLSelectElement>("asset").value;
      const keep = init.display.mode === "image" && init.display.asset === asset;
      return keep ? init.display : { mode: "image", asset };
    }
    return { mode: "label" };
  };

  // The link must be both parts or neither, and https only (shared data is untrusted).
  const readLink = (): { more?: MoreLink | undefined; error?: string } => {
    const name = control<HTMLInputElement>("linkName").value.trim();
    const url = control<HTMLInputElement>("linkUrl").value.trim();
    if (name === "" && url === "") return init.more ? { more: undefined } : {};
    if (name === "" || url === "") return { error: "Give the link both a text and a link." };
    try {
      if (new URL(url).protocol !== "https:") throw new Error("not https");
    } catch {
      return { error: "Links must be a full https:// address." };
    }
    const same = init.more?.name === name && init.more.url === url;
    return same ? {} : { more: { name, url } };
  };

  // Only what differs from the Token's current properties; a cleared field is an explicit undefined.
  const readDraft = (): { changes: TokenChanges; error?: string } => {
    const changes: TokenChanges = {};

    const name = control<HTMLInputElement>("name").value;
    if (name !== "" && name !== init.name) changes.name = name;

    const display = currentDisplay();
    if (JSON.stringify(display) !== JSON.stringify(init.display)) changes.display = display;

    const label = control<HTMLInputElement>("label").value;
    if (label !== (init.label ?? "")) changes.label = label === "" ? undefined : label;

    const description = control<HTMLTextAreaElement>("description").value;
    if (description !== (init.description ?? "")) {
      changes.description = description === "" ? undefined : description;
    }

    const link = readLink();
    if (link.error !== undefined) return { changes, error: link.error };
    if ("more" in link) changes.more = link.more;
    return { changes };
  };

  const report = () => {
    const draft = readDraft();
    errorMessage.textContent = draft.error ?? "";
    handlers.onChange(draft.changes);
  };

  const aliases = () =>
    control<HTMLInputElement>("aliases")
      .value.split(",")
      .map((alias) => alias.trim())
      .filter((alias) => alias !== "");

  form.addEventListener("input", report);
  form.addEventListener("change", (event) => {
    if (event.target === control("definition")) {
      handlers.onReassign(control<HTMLSelectElement>("definition").value);
      return;
    }
    showMatchingControls();
    report();
  });

  const whenValid = (act: (changes: TokenChanges) => void) => () => {
    const draft = readDraft();
    errorMessage.textContent = draft.error ?? "";
    if (draft.error === undefined) act(draft.changes);
  };
  const on = (action: string, listener: () => void) =>
    form.querySelector(`[data-action="${action}"]`)!.addEventListener("click", listener);
  on("apply", whenValid((changes) => handlers.onApply(changes)));
  on("save", whenValid((changes) => handlers.onSave(changes, aliases())));
  on("reset", () => handlers.onReset());
  on("cancel", () => handlers.onCancel());
  showMatchingControls();
  return dialog;
}
