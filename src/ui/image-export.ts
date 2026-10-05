import { toPng } from "html-to-image";

/** The keying green the previous version used so exported images can be cut out in video editors. */
export const CHROMA_GREEN = "#32cd33";

/** Draws an element to a PNG data URL; html-to-image in the app, a fake in tests. */
export type PngRenderer = (element: HTMLElement, options: { backgroundColor?: string }) => Promise<string>;

const defaultRenderer: PngRenderer = (element, options) => toPng(element, options);

const PNG_PREFIX = "data:image/png;base64,";
const FAILED = "Could not draw this row as an image.";

export async function renderPng(
  element: HTMLElement,
  options: { chroma: boolean; render?: PngRenderer },
): Promise<Blob> {
  const render = options.render ?? defaultRenderer;

  let dataUrl: string;
  try {
    dataUrl = await render(element, options.chroma ? { backgroundColor: CHROMA_GREEN } : {});
  } catch {
    throw new Error(FAILED);
  }
  if (!dataUrl.startsWith(PNG_PREFIX)) throw new Error(FAILED);

  const bytes = Uint8Array.from(atob(dataUrl.slice(PNG_PREFIX.length)), (char) => char.charCodeAt(0));
  return new Blob([bytes], { type: "image/png" });
}

export interface ClipboardDeps {
  clipboard: { write: (items: never[]) => Promise<void> } | undefined;
  ClipboardItem: (new (data: Record<string, Blob>) => unknown) | undefined;
}

/** Put a PNG on the clipboard; "unsupported" when the browser cannot copy images at all. */
export async function copyPng(blob: Blob, deps: ClipboardDeps): Promise<"copied" | "unsupported" | "denied"> {
  if (!deps.clipboard || !deps.ClipboardItem) return "unsupported";
  try {
    await deps.clipboard.write([new deps.ClipboardItem({ [blob.type]: blob })] as never[]);
    return "copied";
  } catch {
    return "denied";
  }
}

export interface DownloadDeps {
  document: Document;
  createObjectURL: (blob: Blob) => string;
  revokeObjectURL: (url: string) => void;
}

export function downloadBlob(blob: Blob, filename: string, deps: DownloadDeps) {
  const url = deps.createObjectURL(blob);
  const link = deps.document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  deps.revokeObjectURL(url);
}
