import { useEffect, useRef } from "react";

/**
 * Mirror form state to localStorage so the user doesn't lose work when
 * switching admin tabs. Restore on mount via the provided `apply` callback.
 * Call `clear()` after the form has been persisted to a real backend so
 * stale local drafts don't repopulate the form on the next visit.
 */
export function usePersistedDraft<T>(
  key: string,
  state: T,
  apply: (restored: T) => void,
  enabled: boolean = true,
) {
  const applyRef = useRef(apply);
  applyRef.current = apply;
  const restored = useRef(false);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    if (!enabled) return;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as T;
      applyRef.current(parsed);
    } catch {
      // ignore - corrupt JSON or storage disabled
    }
  }, [key, enabled]);

  useEffect(() => {
    if (!enabled) return;
    if (!restored.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore - storage full or disabled
    }
  }, [key, state, enabled]);

  function clear() {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }

  return { clear };
}
