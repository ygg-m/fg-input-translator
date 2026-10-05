// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { CHROMA_GREEN, copyPng, downloadBlob, renderPng } from "./image-export";
import type { PngRenderer } from "./image-export";

// A real 1x1 PNG, so the bytes can be checked.
const PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGD4DwABBAEAwS2OUAAAAABJRU5ErkJggg==";

const element = () => document.createElement("div");

describe("renderPng", () => {
  it("asks for the keying green only when chroma is on", async () => {
    const render = vi.fn<PngRenderer>(async () => PIXEL);

    await renderPng(element(), { chroma: true, render });
    await renderPng(element(), { chroma: false, render });

    expect(render.mock.calls[0]![1]).toEqual({ backgroundColor: CHROMA_GREEN });
    expect(render.mock.calls[1]![1]).toEqual({});
    expect(CHROMA_GREEN).toBe("#32cd33");
  });

  it("returns the drawn image as a PNG blob with the same bytes", async () => {
    const blob = await renderPng(element(), { chroma: false, render: async () => PIXEL });

    expect(blob.type).toBe("image/png");
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect([...bytes.slice(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(bytes.length).toBe(Uint8Array.from(atob(PIXEL.split(",")[1]!), (c) => c.charCodeAt(0)).length);
  });

  it("reports a result that is not a PNG data URL, and a renderer that fails", async () => {
    await expect(renderPng(element(), { chroma: false, render: async () => "data:text/plain;base64,aGk=" })).rejects.toThrow(
      /image/i,
    );
    await expect(
      renderPng(element(), {
        chroma: false,
        render: async () => {
          throw new Error("canvas tainted");
        },
      }),
    ).rejects.toThrow(/image/i);
  });
});

describe("copyPng", () => {
  const blob = new Blob(["x"], { type: "image/png" });

  it("puts the PNG on the clipboard", async () => {
    const write = vi.fn(async () => {});
    class FakeItem {
      constructor(public data: Record<string, Blob>) {}
    }

    const result = await copyPng(blob, { clipboard: { write }, ClipboardItem: FakeItem });

    expect(result).toBe("copied");
    expect((write.mock.calls[0] as unknown as [FakeItem[]])[0][0]!.data).toEqual({ "image/png": blob });
  });

  it("says when the browser cannot copy images or refuses to", async () => {
    class FakeItem {
      constructor(public data: Record<string, Blob>) {}
    }

    expect(await copyPng(blob, { clipboard: undefined, ClipboardItem: FakeItem })).toBe("unsupported");
    expect(await copyPng(blob, { clipboard: { write: async () => {} }, ClipboardItem: undefined })).toBe("unsupported");
    expect(
      await copyPng(blob, {
        clipboard: {
          write: async () => {
            throw new DOMException("denied", "NotAllowedError");
          },
        },
        ClipboardItem: FakeItem,
      }),
    ).toBe("denied");
  });
});

describe("downloadBlob", () => {
  it("clicks a download link for the blob and releases the object URL afterwards", () => {
    const clicks: { download: string; href: string }[] = [];
    const createObjectURL = vi.fn(() => "blob:fake");
    const revokeObjectURL = vi.fn();
    const doc = {
      createElement: () => ({
        href: "",
        download: "",
        click() {
          clicks.push({ download: this.download, href: this.href });
        },
      }),
    } as unknown as Document;

    downloadBlob(new Blob(["x"]), "combo.png", { document: doc, createObjectURL, revokeObjectURL });

    expect(clicks).toEqual([{ download: "combo.png", href: "blob:fake" }]);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:fake");
  });
});
