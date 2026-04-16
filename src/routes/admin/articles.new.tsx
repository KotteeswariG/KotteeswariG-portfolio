import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { adminListCategoriesWithSubs } from "../../server-fns/admin-categories";
import {
  createArticle,
  uploadArticleImage,
} from "../../server-fns/admin-articles";
import { MarkdownEditor } from "../../components/MarkdownEditor";
import type { ArticleStatus } from "../../server/schema";

export const Route = createFileRoute("/admin/articles/new")({
  loader: async () => {
    const categories = await adminListCategoriesWithSubs();
    return { categories };
  },
  component: NewArticle,
});

function NewArticle() {
  const navigate = useNavigate();
  const { categories } = Route.useLoaderData();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [subcategoryId, setSubcategoryId] = useState<number | "">("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subOptions = useMemo(() => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.subcategories ?? [];
  }, [categories, categoryId]);

  async function save(status: ArticleStatus) {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!categoryId || !subcategoryId) {
      setError("Pick a category and subcategory");
      return;
    }
    setError(null);
    setPending(true);
    try {
      const res = await createArticle({
        data: {
          title,
          slug: slug || undefined,
          excerpt: excerpt || null,
          content,
          categoryId: Number(categoryId),
          subcategoryId: Number(subcategoryId),
          coverImage: coverImage || null,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
          status,
        },
      });
      navigate({
        to: "/admin/articles/$id/edit",
        params: { id: String(res.id) },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setPending(false);
    }
  }

  if (categories.length === 0) {
    return (
      <>
        <div className="page-header">
          <h2 className="mb-0">New article</h2>
        </div>
        <div className="empty-state">
          You need at least one category and subcategory before creating an
          article. <Link to="/admin/categories">Set up categories</Link>.
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header editor-page-header">
        <div className="editor-page-title">
          <span className="editor-page-icon" aria-hidden="true">
            <i className="fa fa-file-text-o"></i>
          </span>
          <h2 className="mb-0">New article</h2>
        </div>
        <div className="actions">
          <button
            type="button"
            className="btn btn-outline-secondary editor-action-btn"
            disabled={pending}
            onClick={() => save("draft")}
          >
            Save draft
          </button>
          <button
            type="button"
            className="btn btn-primary editor-action-btn editor-action-btn--primary"
            disabled={pending}
            onClick={() => save("published")}
          >
            {pending ? "Saving…" : "Publish"}
          </button>
        </div>
      </div>

      {error ? <div className="alert alert-danger py-2">{error}</div> : null}

      <ArticleForm
        title={title}
        setTitle={setTitle}
        slug={slug}
        setSlug={setSlug}
        excerpt={excerpt}
        setExcerpt={setExcerpt}
        seoTitle={seoTitle}
        setSeoTitle={setSeoTitle}
        seoDescription={seoDescription}
        setSeoDescription={setSeoDescription}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        categories={categories}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        subcategoryId={subcategoryId}
        setSubcategoryId={setSubcategoryId}
        subOptions={subOptions}
        content={content}
        setContent={setContent}
      />
    </>
  );
}

type FormProps = {
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  excerpt: string;
  setExcerpt: (v: string) => void;
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
  coverImage: string;
  setCoverImage: (v: string) => void;
  categories: Array<{
    id: number;
    name: string;
    subcategories: { id: number; name: string }[];
  }>;
  categoryId: number | "";
  setCategoryId: (v: number | "") => void;
  subcategoryId: number | "";
  setSubcategoryId: (v: number | "") => void;
  subOptions: { id: number; name: string }[];
  content: string;
  setContent: (v: string) => void;
  seoSidebar?: "left" | "right";
};

export function ArticleForm(p: FormProps) {
  const seoSidebar = p.seoSidebar ?? "left";
  const [imagePending, setImagePending] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  async function uploadImage(file: File, mode: "cover" | "content") {
    setImageError(null);
    setImagePending(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadArticleImage({ data: formData });
      if (mode === "cover") {
        p.setCoverImage(result.url);
      } else {
        const label =
          file.name.replace(/\.[^.]+$/, "").trim() || "Article image";
        const nextContent = `${p.content.trimEnd()}\n\n![${label}](${result.url})\n`;
        p.setContent(nextContent);
      }
    } catch (e) {
      setImageError(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setImagePending(false);
    }
  }

  return (
    <div
      className={`editor-page editor-page--new${
        seoSidebar === "right" ? " editor-page--with-right-sidebar" : ""
      }`}
    >
      <aside className="editor-sidebar" aria-label="Article settings">
        <section className="editor-card editor-card--sidebar">
          <div className="editor-sidebar-header">
            <h3 className="editor-sidebar-title">Article settings</h3>
            <p className="editor-sidebar-copy">
              Manage the details of your article.
            </p>
          </div>

          <div className="editor-settings-stack">
            <label className="editor-field">
              <span className="editor-field-label">Article title</span>
              <input
                type="text"
                className="editor-title-input"
                placeholder="Article title"
                value={p.title}
                onChange={(e) => p.setTitle(e.target.value)}
                aria-label="Article title"
              />
            </label>

            <label className="editor-field">
              <span className="editor-field-label">Category</span>
              <select
                className="editor-field-input"
                value={p.categoryId}
                onChange={(e) => {
                  p.setCategoryId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  );
                  p.setSubcategoryId("");
                }}
              >
                <option value="">Select…</option>
                {p.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="editor-field">
              <span className="editor-field-label">Subcategory</span>
              <select
                className="editor-field-input"
                value={p.subcategoryId}
                onChange={(e) =>
                  p.setSubcategoryId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                disabled={p.subOptions.length === 0}
              >
                <option value="">Select…</option>
                {p.subOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="editor-field">
              <span className="editor-field-label">Slug</span>
              <input
                type="text"
                className="editor-field-input"
                placeholder="auto from title"
                value={p.slug}
                onChange={(e) => p.setSlug(e.target.value)}
              />
            </label>

            <label className="editor-field">
              <span className="editor-field-label">Excerpt</span>
              <textarea
                className="editor-excerpt"
                rows={5}
                placeholder="Excerpt - one sentence shown on listing pages."
                value={p.excerpt}
                onChange={(e) => p.setExcerpt(e.target.value)}
              />
            </label>
          </div>
        </section>
      </aside>

      <section className="editor-card editor-card--body editor-main-panel">
        <div className="editor-upload-row">
          <label className="editor-upload-control">
            <span>{imagePending ? "Uploading image..." : "Add article image"}</span>
            <input
              type="file"
              accept="image/*"
              disabled={imagePending}
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                e.currentTarget.value = "";
                if (file) void uploadImage(file, "content");
              }}
            />
          </label>
          <span className="editor-upload-help">
            Stored in Cloudflare R2 and inserted as Markdown.
          </span>
        </div>
        <MarkdownEditor
          value={p.content}
          onChange={p.setContent}
          height={640}
          placeholder="Start writing your article..."
        />
      </section>

      <aside
        className={`editor-sidebar editor-sidebar--seo${
          seoSidebar === "right" ? " editor-sidebar--right" : ""
        }`}
        aria-label="SEO and cover settings"
      >
        <details className="editor-card editor-card--sidebar editor-seo" open>
          <summary>
            <span>SEO &amp; cover</span>
            <span className="editor-seo-hint">optional</span>
          </summary>
          <div className="editor-seo-body">
            <label className="editor-field">
              <span className="editor-field-label">SEO title</span>
              <input
                type="text"
                className="editor-field-input"
                value={p.seoTitle}
                onChange={(e) => p.setSeoTitle(e.target.value)}
                placeholder="Falls back to title"
              />
            </label>

            <label className="editor-field">
              <span className="editor-field-label">Cover image URL</span>
              <input
                type="text"
                className="editor-field-input"
                value={p.coverImage}
                onChange={(e) => p.setCoverImage(e.target.value)}
                placeholder="https://..."
              />
            </label>
            <label className="editor-field">
              <span className="editor-field-label">Upload cover image</span>
              <input
                type="file"
                className="editor-field-input editor-file-input"
                accept="image/*"
                disabled={imagePending}
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  e.currentTarget.value = "";
                  if (file) void uploadImage(file, "cover");
                }}
              />
              <span className="editor-field-help">
                Stored in Cloudflare R2 and used as the cover image URL.
              </span>
            </label>
            {imageError ? (
              <div className="editor-inline-error">{imageError}</div>
            ) : null}

            <label className="editor-field editor-field-full">
              <span className="editor-field-label">SEO description</span>
              <textarea
                className="editor-field-input"
                rows={3}
                value={p.seoDescription}
                onChange={(e) => p.setSeoDescription(e.target.value)}
                placeholder="Falls back to excerpt"
              />
            </label>
          </div>
        </details>
      </aside>
    </div>
  );
}
// shared form fields next
// preview pane fix
