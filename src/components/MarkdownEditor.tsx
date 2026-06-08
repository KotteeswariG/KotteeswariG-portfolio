import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { MarkdownView } from "./MarkdownView";

type Props = {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
  /**
   * Stable key (e.g. "new" or `edit-${id}`) that scopes the saved
   * cursor / scroll / mode in sessionStorage. When the component
   * unmounts (route change) we snapshot the editing state; on the next
   * mount with the same key, we restore it so coming back to the page
   * is byte-for-byte identical to leaving.
   */
  restoreKey?: string;
};

type Mode = "write" | "split" | "preview";

type RestoredState = {
  mode?: Mode;
  selectionStart?: number;
  selectionEnd?: number;
  scrollTop?: number;
  pageScrollY?: number;
};

function readSnapshot(key: string): RestoredState | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as RestoredState;
  } catch {
    return null;
  }
}

function writeSnapshot(key: string, state: RestoredState) {
  try {
    sessionStorage.setItem(key, JSON.stringify(state));
  } catch {
    // ignore - storage full or disabled
  }
}

export function MarkdownEditor({
  value,
  onChange,
  height = 520,
  placeholder = "Start writing your article…",
  restoreKey,
}: Props) {
  const storageKey = restoreKey ? `md-editor-snapshot-${restoreKey}` : null;

  const [mode, setMode] = useState<Mode>(() => {
    if (storageKey) {
      const snap = readSnapshot(storageKey);
      if (snap?.mode) return snap.mode;
    }
    return "split";
  });
  const [isDark, setIsDark] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const restoredOnce = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 991.98px)");
    const apply = () => {
      // Only auto-collapse to "write" on small screens if user hasn't
      // explicitly picked a mode from sessionStorage.
      if (storageKey && readSnapshot(storageKey)?.mode) return;
      setMode(mq.matches ? "write" : "split");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [storageKey]);

  useEffect(() => {
    const read = () => {
      const t = document.documentElement.dataset.theme;
      setIsDark(t === "dark");
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  // Restore cursor + scroll AFTER the textarea has its restored value.
  // We wait one layout pass so the textarea's content is laid out, then
  // set selection and scroll positions.
  useLayoutEffect(() => {
    if (!storageKey || restoredOnce.current) return;
    if (!value) return; // wait until parent restored its persisted value
    const snap = readSnapshot(storageKey);
    if (!snap) {
      restoredOnce.current = true;
      return;
    }
    const ta = textareaRef.current;
    if (ta && typeof snap.selectionStart === "number") {
      try {
        ta.focus({ preventScroll: true });
        ta.setSelectionRange(
          snap.selectionStart,
          snap.selectionEnd ?? snap.selectionStart,
        );
      } catch {
        // selection setting can fail if element is detached - ignore
      }
      if (typeof snap.scrollTop === "number") {
        ta.scrollTop = snap.scrollTop;
      }
    }
    if (typeof snap.pageScrollY === "number") {
      window.scrollTo({ top: snap.pageScrollY, behavior: "instant" as ScrollBehavior });
    }
    restoredOnce.current = true;
  }, [value, storageKey]);

  // On unmount, snapshot current editing state.
  useEffect(() => {
    if (!storageKey) return;
    return () => {
      const ta = textareaRef.current;
      writeSnapshot(storageKey, {
        mode,
        selectionStart: ta?.selectionStart,
        selectionEnd: ta?.selectionEnd,
        scrollTop: ta?.scrollTop,
        pageScrollY: window.scrollY,
      });
    };
  }, [storageKey, mode]);

  const showWrite = mode === "write" || mode === "split";
  const showPreview = mode === "preview" || mode === "split";

  const textColor = isDark ? "#e6edf3" : "#0d1117";
  const bgColor = isDark ? "#0d1117" : "#ffffff";

  const textareaStyle: CSSProperties = {
    width: "100%",
    minHeight: height,
    border: 0,
    outline: 0,
    resize: "vertical",
    padding: "1rem 1.1rem",
    background: bgColor,
    color: textColor,
    WebkitTextFillColor: textColor,
    caretColor: "#5f01bc",
    opacity: 1,
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    fontSize: 14,
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  return (
    <div className="md-editor-shell md-editor-shell--plain">
      <div className="md-editor-tabs" role="group" aria-label="Editor mode">
        {(["write", "split", "preview"] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={`md-editor-tab${mode === m ? " active" : ""}`}
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
          >
            {m === "write" ? "Write" : m === "split" ? "Split" : "Preview"}
          </button>
        ))}
      </div>
      <div
        className={`md-editor-panes md-editor-panes--${mode}`}
        style={{ minHeight: height }}
      >
        {showWrite ? (
          <textarea
            ref={textareaRef}
            className="md-editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            placeholder={placeholder}
            style={textareaStyle}
          />
        ) : null}
        {showPreview ? (
          <div
            className="md-editor-preview"
            style={{ minHeight: height, background: bgColor, color: textColor }}
            aria-label="Preview"
          >
            {value.trim() ? (
              <MarkdownView source={value} />
            ) : (
              <p className="md-editor-preview-empty">
                Nothing to preview yet.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
