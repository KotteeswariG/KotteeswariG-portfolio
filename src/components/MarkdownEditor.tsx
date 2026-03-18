import { lazy, Suspense, useEffect, useState } from "react";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));

type Props = {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
};

export function MarkdownEditor({
  value,
  onChange,
  height = 520,
  placeholder = "Start writing your article…",
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [previewMode, setPreviewMode] = useState<"edit" | "live" | "preview">(
    "live",
  );

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 991.98px)");
    const apply = () => setPreviewMode(mq.matches ? "edit" : "live");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (!mounted) {
    return (
      <textarea
        className="form-control"
        rows={18}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div className="md-editor-shell" data-color-mode-target>
      <div className="md-editor-tabs" role="group" aria-label="Editor mode">
        {(["edit", "live", "preview"] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={`md-editor-tab${previewMode === m ? " active" : ""}`}
            aria-pressed={previewMode === m}
            onClick={() => setPreviewMode(m)}
          >
            {m === "edit" ? "Write" : m === "live" ? "Split" : "Preview"}
          </button>
        ))}
      </div>
      <Suspense
        fallback={
          <div
            style={{
              minHeight: height,
              display: "grid",
              placeItems: "center",
              border: "1px dashed var(--color-border)",
              borderRadius: 6,
              color: "var(--color-subheading)",
            }}
          >
            Loading editor…
          </div>
        }
      >
        <MDEditor
          value={value}
          onChange={(v) => onChange(v ?? "")}
          height={height}
          preview={previewMode}
          visibleDragbar={false}
          enableScroll
          textareaProps={{ placeholder }}
        />
      </Suspense>
    </div>
  );
}
// mobile preview hidden, edit only
