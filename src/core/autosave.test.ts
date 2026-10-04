import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAutosave } from "./autosave";
import type { SaveResult } from "./persistence";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("createAutosave", () => {
  it("saves once, after the quiet period, however many changes came in", () => {
    const save = vi.fn((): SaveResult => ({ ok: true }));
    const autosave = createAutosave(save, () => {}, 400);

    autosave.notify();
    vi.advanceTimersByTime(300);
    autosave.notify();
    vi.advanceTimersByTime(300);
    expect(save).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(save).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(5000);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("flushes a pending save immediately and does nothing when nothing is pending", () => {
    const save = vi.fn((): SaveResult => ({ ok: true }));
    const autosave = createAutosave(save, () => {}, 400);

    autosave.flush();
    expect(save).not.toHaveBeenCalled();

    autosave.notify();
    autosave.flush();
    expect(save).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("reports every result and keeps saving after a failure", () => {
    const results: SaveResult[] = [{ ok: false, error: "QuotaExceededError: full" }, { ok: true }];
    const save = vi.fn(() => results.shift()!);
    const seen: SaveResult[] = [];
    const autosave = createAutosave(save, (result) => seen.push(result), 400);

    autosave.notify();
    vi.advanceTimersByTime(400);
    autosave.notify();
    vi.advanceTimersByTime(400);

    expect(seen).toEqual([{ ok: false, error: "QuotaExceededError: full" }, { ok: true }]);
  });
});
