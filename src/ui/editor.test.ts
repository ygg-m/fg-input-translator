// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { createEditor } from "./editor";
import type { EditorHandlers, EditorInit } from "./editor";

const init: EditorInit = {
  text: "2 3 6",
  definitionId: "motion.qcf",
  name: "Quarter Circle Forward",
  display: { mode: "image", asset: "Motion236", transform: { rotate: 90 } },
  label: "qcf",
  description: "Down, down-forward, forward.",
  more: { name: "Glossary", url: "https://glossary.infil.net/?t=Quarter%20Circle" },
  choices: [
    { id: "motion.qcf", name: "Quarter Circle Forward" },
    { id: "motion.hcf", name: "Half Circle Forward" },
  ],
  assetIds: ["Motion236", "Motion41236"],
};

const handlers = (): EditorHandlers => ({
  onChange: vi.fn(),
  onApply: vi.fn(),
  onSave: vi.fn(),
  onReset: vi.fn(),
  onReassign: vi.fn(),
  onCancel: vi.fn(),
});

const field = <T extends HTMLElement>(dialog: HTMLElement, name: string) =>
  dialog.querySelector<T>(`[name="${name}"]`)!;

describe("createEditor", () => {
  it("fills the form from the Token's current properties", () => {
    const dialog = createEditor(document, init, handlers());

    expect(dialog.tagName).toBe("DIALOG");
    expect(field<HTMLInputElement>(dialog, "name").value).toBe("Quarter Circle Forward");
    expect(field<HTMLSelectElement>(dialog, "mode").value).toBe("image");
    expect(field<HTMLSelectElement>(dialog, "asset").value).toBe("Motion236");
    expect(field<HTMLInputElement>(dialog, "label").value).toBe("qcf");
    expect(field<HTMLTextAreaElement>(dialog, "description").value).toBe("Down, down-forward, forward.");
    expect(field<HTMLInputElement>(dialog, "linkName").value).toBe("Glossary");
    expect(field<HTMLInputElement>(dialog, "linkUrl").value).toBe(
      "https://glossary.infil.net/?t=Quarter%20Circle",
    );
    expect(field<HTMLSelectElement>(dialog, "definition").value).toBe("motion.qcf");
  });

  const type = (dialog: HTMLElement, name: string, value: string) => {
    const element = field<HTMLInputElement>(dialog, name);
    element.value = value;
    element.dispatchEvent(new Event("input", { bubbles: true }));
  };

  it("reports only the properties that differ from the current ones, as they are edited", () => {
    const h = handlers();
    const dialog = createEditor(document, init, h);

    type(dialog, "name", "Fireball motion");
    expect(h.onChange).toHaveBeenLastCalledWith({ name: "Fireball motion" });

    type(dialog, "name", init.name);
    expect(h.onChange).toHaveBeenLastCalledWith({});

    type(dialog, "label", "");
    expect(h.onChange).toHaveBeenLastCalledWith({ label: undefined });
    expect(Object.keys((h.onChange as ReturnType<typeof vi.fn>).mock.lastCall![0])).toEqual(["label"]);
  });

  it("builds the display from the chosen mode and shows only the matching control", () => {
    const h = handlers();
    const dialog = createEditor(document, init, h);
    const choose = (mode: string) => {
      const element = field<HTMLSelectElement>(dialog, "mode");
      element.value = mode;
      element.dispatchEvent(new Event("change", { bubbles: true }));
    };
    const hidden = (name: string) => field(dialog, name).closest("label")!.hidden;

    expect([hidden("asset"), hidden("text")]).toEqual([false, true]);

    choose("text");
    type(dialog, "text", "🌀");
    expect(h.onChange).toHaveBeenLastCalledWith({ display: { mode: "text", text: "🌀" } });
    expect([hidden("asset"), hidden("text")]).toEqual([true, false]);

    choose("label");
    expect(h.onChange).toHaveBeenLastCalledWith({ display: { mode: "label" } });
    expect([hidden("asset"), hidden("text")]).toEqual([true, true]);

    choose("image");
    field<HTMLSelectElement>(dialog, "asset").value = "Motion41236";
    field(dialog, "asset").dispatchEvent(new Event("change", { bubbles: true }));
    expect(h.onChange).toHaveBeenLastCalledWith({ display: { mode: "image", asset: "Motion41236" } });

    field<HTMLSelectElement>(dialog, "asset").value = "Motion236";
    field(dialog, "asset").dispatchEvent(new Event("change", { bubbles: true }));
    expect(h.onChange).toHaveBeenLastCalledWith({});
  });

  describe("link field", () => {
    const lastDraft = (h: EditorHandlers) => (h.onChange as ReturnType<typeof vi.fn>).mock.lastCall![0];
    const error = (dialog: HTMLElement) => dialog.querySelector(".editor-error")!;

    it("accepts a new https link and a cleared one", () => {
      const h = handlers();
      const dialog = createEditor(document, init, h);

      type(dialog, "linkName", "Wiki");
      type(dialog, "linkUrl", "https://example.com/qcf");
      expect(lastDraft(h)).toEqual({ more: { name: "Wiki", url: "https://example.com/qcf" } });
      expect(error(dialog).textContent).toBe("");

      type(dialog, "linkName", "");
      type(dialog, "linkUrl", "");
      expect(lastDraft(h)).toStrictEqual({ more: undefined });
    });

    it("refuses non-https links and half-filled links, showing why and leaving the link out", () => {
      const h = handlers();
      const dialog = createEditor(document, init, h);

      type(dialog, "linkUrl", "javascript:alert(1)");
      expect(error(dialog).textContent).toMatch(/https/);
      expect(lastDraft(h)).not.toHaveProperty("more");

      type(dialog, "linkUrl", "");
      expect(error(dialog).textContent).toMatch(/both|text and a link/i);
      expect(lastDraft(h)).not.toHaveProperty("more");
    });
  });

  describe("actions", () => {
    const click = (dialog: HTMLElement, action: string) =>
      dialog.querySelector<HTMLButtonElement>(`[data-action="${action}"]`)!.click();

    it("applies the current draft", () => {
      const h = handlers();
      const dialog = createEditor(document, init, h);

      type(dialog, "name", "Mine");
      click(dialog, "apply");

      expect(h.onApply).toHaveBeenCalledWith({ name: "Mine" });
    });

    it("saves the draft as a definition with the Token's text as the default alias", () => {
      const h = handlers();
      const dialog = createEditor(document, init, h);

      type(dialog, "name", "Mine");
      click(dialog, "save");
      expect(h.onSave).toHaveBeenLastCalledWith({ name: "Mine" }, ["236"]);

      type(dialog, "aliases", "236, qcf ,");
      click(dialog, "save");
      expect(h.onSave).toHaveBeenLastCalledWith({ name: "Mine" }, ["236", "qcf"]);
    });

    it("does not apply or save while the form has an error", () => {
      const h = handlers();
      const dialog = createEditor(document, init, h);

      type(dialog, "linkUrl", "http://insecure.example/");
      click(dialog, "apply");
      click(dialog, "save");

      expect(h.onApply).not.toHaveBeenCalled();
      expect(h.onSave).not.toHaveBeenCalled();
    });

    it("offers reset only for a custom Token", () => {
      const pure = createEditor(document, init, handlers());
      const h = handlers();
      const custom = createEditor(document, { ...init, custom: "instance" }, h);

      expect(pure.querySelector<HTMLButtonElement>('[data-action="reset"]')!.disabled).toBe(true);
      click(custom, "reset");
      expect(h.onReset).toHaveBeenCalledTimes(1);
    });

    it("cancels, and reassigns when another definition is picked", () => {
      const h = handlers();
      const dialog = createEditor(document, init, h);

      click(dialog, "cancel");
      expect(h.onCancel).toHaveBeenCalledTimes(1);

      const pick = field<HTMLSelectElement>(dialog, "definition");
      pick.value = "motion.hcf";
      pick.dispatchEvent(new Event("change", { bubbles: true }));
      expect(h.onReassign).toHaveBeenCalledWith("motion.hcf");
    });
  });

  it("keeps hostile Token data inert", () => {
    const hostile = '<img src=x onerror="alert(1)">';
    const dialog = createEditor(document, { ...init, name: hostile, description: hostile }, handlers());

    expect(dialog.querySelector("img")).toBeNull();
    expect(field<HTMLInputElement>(dialog, "name").value).toBe(hostile);
    expect(field<HTMLTextAreaElement>(dialog, "description").value).toBe(hostile);
  });
});
