import type { SaveResult } from "./persistence";

export interface Autosave {
  /** Something changed: save after the quiet period. */
  notify(): void;
  /** Save now if a save is pending (for when the page is going away). */
  flush(): void;
}

export function createAutosave(
  save: () => SaveResult,
  onResult: (result: SaveResult) => void,
  delayMs = 400,
): Autosave {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const run = () => {
    timer = undefined;
    onResult(save());
  };

  return {
    notify() {
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(run, delayMs);
    },
    flush() {
      if (timer === undefined) return;
      clearTimeout(timer);
      run();
    },
  };
}
