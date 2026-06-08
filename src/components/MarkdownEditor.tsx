import { useEffect, useState, type CSSProperties } from "react";
import { MarkdownView } from "./MarkdownView";

type Props = {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
};

type Mode = "write" | "split" | "preview";

export function MarkdownEditor({
  value,
  onChange,
  height = 520,
  placeholder = "Start writing your article…",
}: Props) {
  const [mode, setMode] = useState<Mode>("split");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 991.98px)");
    const apply = () => setMode(mq.matches ? "write" : "split");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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
