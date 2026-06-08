import { useEffect, useRef, useState } from "react";

export type AutoSaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

type Options = {
  enabled: boolean;
  delayMs?: number;
  onSave: () => Promise<void>;
};

/**
 * Debounced auto-save. `signal` is any value derived from the form state —
 * when it changes and `enabled` is true, a save is scheduled `delayMs` later.
 * Subsequent changes within that window reset the timer. The `dirty` flag
 * is exposed so callers can warn on navigation.
 */
export function useAutoSave(signal: unknown, opts: Options) {
  const { enabled, delayMs = 1500, onSave } = opts;
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [dirty, setDirty] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onSaveRef = useRef(onSave);
  const firstRun = useRef(true);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!enabled) return;
    setDirty(true);
    setStatus("pending");
    const t = setTimeout(async () => {
      setStatus("saving");
      try {
        await onSaveRef.current();
        setStatus("saved");
        setSavedAt(new Date());
        setDirty(false);
        setErrorMessage(null);
      } catch (e) {
        setStatus("error");
        setErrorMessage(e instanceof Error ? e.message : "Save failed");
        // surface in console so devtools shows the stack
        console.error("[autosave]", e);
      }
    }, delayMs);
    return () => clearTimeout(t);
  }, [signal, enabled, delayMs]);

  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  return { status, savedAt, dirty, errorMessage };
}
