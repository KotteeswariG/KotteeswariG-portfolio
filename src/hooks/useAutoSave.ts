import { useEffect, useRef, useState } from "react";
import { useBlocker } from "@tanstack/react-router";
import { useConfirm } from "../components/ConfirmModal";

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

  // Block in-app navigation when dirty: ask the user before leaving.
  // "Stay" cancels the navigation so they keep editing. "Save & continue"
  // flushes the save first, then proceeds.
  const confirm = useConfirm();
  const blocker = useBlocker({
    disabled: !enabled,
    shouldBlockFn: () => dirty,
    withResolver: true,
  });

  useEffect(() => {
    if (blocker.status !== "blocked") return;
    let cancelled = false;
    (async () => {
      const choice = await confirm({
        title: "Unsaved changes",
        description:
          "You have unsaved changes. Save and continue, or stay on this page to keep editing?",
        confirmLabel: "Save & continue",
        cancelLabel: "Stay",
      });
      if (cancelled) return;
      if (!choice) {
        blocker.reset();
        return;
      }
      try {
        setStatus("saving");
        await onSaveRef.current();
        setStatus("saved");
        setSavedAt(new Date());
        setDirty(false);
        setErrorMessage(null);
        blocker.proceed();
      } catch (e) {
        setStatus("error");
        setErrorMessage(e instanceof Error ? e.message : "Save failed");
        console.error("[autosave/navguard]", e);
        blocker.reset();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [blocker, confirm]);

  return { status, savedAt, dirty, errorMessage };
}
