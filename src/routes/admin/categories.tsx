import {
  Link,
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  adminListCategoriesWithSubs,
  createCategory,
  createSubcategory,
  deleteCategory,
  deleteSubcategory,
  updateCategory,
  updateSubcategory,
} from "../../server-fns/admin-categories";
import { listArticlesInCategory } from "../../server-fns/admin-articles";
import { useConfirm } from "../../components/ConfirmModal";
import type { ArticleStatus } from "../../server/schema";

type Search = { cat?: string; mode?: "new" };

export const Route = createFileRoute("/admin/categories")({
  validateSearch: (s): Search => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
    mode: s.mode === "new" ? "new" : undefined,
  }),
  loaderDeps: ({ search }) => ({ cat: search.cat, mode: search.mode }),
  loader: async ({ deps }) => {
    const categories = await adminListCategoriesWithSubs();
    let articles: Awaited<ReturnType<typeof listArticlesInCategory>> = [];
    if (deps.mode !== "new") {
      const target =
        (deps.cat && categories.find((c) => c.slug === deps.cat)) ||
        categories[0];
      if (target) {
        articles = await listArticlesInCategory({
          data: { categoryId: target.id },
        });
      }
    }
    return { categories, articles };
  },
  component: CategoriesPage,
});

type Cat = Awaited<ReturnType<typeof adminListCategoriesWithSubs>>[number];
type Sub = Cat["subcategories"][number];
type CatArticle = Awaited<ReturnType<typeof listArticlesInCategory>>[number];

function CategoriesPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const { categories, articles } = Route.useLoaderData();
  const search = Route.useSearch();
  const confirm = useConfirm();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [filter, setFilter] = useState("");

  const selected: Cat | null =
    search.mode === "new"
      ? null
      : (search.cat && categories.find((c) => c.slug === search.cat)) ||
        categories[0] ||
        null;

  const filteredCategories = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(query));
  }, [categories, filter]);

  // Default-select first category in URL when none specified.
  useEffect(() => {
    if (!search.mode && !search.cat && categories.length > 0) {
      navigate({
        to: "/admin/categories",
        search: { cat: categories[0].slug },
        replace: true,
      });
    }
  }, [categories, navigate, search.cat, search.mode]);

  function refresh() {
    router.invalidate();
  }

  async function run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    setPending(true);
    setError(null);
    try {
      const result = await fn();
      refresh();
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operation failed");
      return undefined;
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="cat-page">
      <header className="cat-admin-head">
        <div className="cat-admin-head-copy">
          <h2 className="cat-admin-title">Categories</h2>
          <p className="cat-admin-subtitle">
            Manage article categories and subcategories.
          </p>
        </div>
        <Link
          to="/admin/categories"
          search={{ mode: "new" }}
          activeProps={{}}
          inactiveProps={{}}
          className={`cat-primary-btn${search.mode === "new" ? " active" : ""}`}
        >
          + New category
        </Link>
      </header>

      <div className="cat-shell">
        <aside className="cat-nav">
          <div className="cat-sidebar-card">
            <label className="cat-sidebar-search" htmlFor="category-filter">
              <span className="cat-sidebar-search-label">Search categories</span>
              <input
                id="category-filter"
                type="search"
                className="cat-input"
                placeholder="Search categories"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </label>

            <nav aria-label="Categories">
              {categories.length === 0 ? (
                <p className="cat-nav-empty">No categories yet.</p>
              ) : filteredCategories.length === 0 ? (
                <p className="cat-nav-empty">No categories match your search.</p>
              ) : (
                <ul className="cat-nav-list">
                  {filteredCategories.map((c) => {
                    const active =
                      search.mode !== "new" &&
                      (search.cat === c.slug ||
                        (!search.cat && categories[0]?.id === c.id));
                    return (
                      <li key={c.id}>
                        <Link
                          to="/admin/categories"
                          search={{ cat: c.slug }}
                          activeProps={{}}
                          inactiveProps={{}}
                          className={`cat-nav-link${active ? " active" : ""}`}
                        >
                          <span className="cat-nav-link-main">
                            <span className="cat-nav-link-name">{c.name}</span>
                            <span className="cat-nav-link-meta">
                              {c.articleCount} article
                              {c.articleCount === 1 ? "" : "s"}
                            </span>
                          </span>
                          <span className="cat-nav-link-count">
                            {c.articleCount}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </nav>
          </div>
        </aside>

        <main className="cat-main">
          {error ? <div className="alert alert-danger py-2">{error}</div> : null}

          {search.mode === "new" ? (
            <NewCategoryPane
              disabled={pending}
              onCancel={() =>
                navigate({
                  to: "/admin/categories",
                  search: selected ? { cat: selected.slug } : {},
                })
              }
              onCreate={async (input) => {
                const result = await run(() => createCategory({ data: input }));
                if (result?.slug) {
                  navigate({
                    to: "/admin/categories",
                    search: { cat: result.slug },
                  });
                }
              }}
            />
          ) : selected ? (
            <CategoryPane
              key={selected.id}
              category={selected}
              articles={articles}
              disabled={pending}
              confirm={confirm}
              onSaveCategory={async (input) => {
                await run(() => updateCategory({ data: input }));
                if (input.slug !== selected.slug) {
                  navigate({
                    to: "/admin/categories",
                    search: { cat: input.slug },
                    replace: true,
                  });
                }
              }}
              onDeleteCategory={async (id) => {
                await run(() => deleteCategory({ data: { id } }));
                navigate({ to: "/admin/categories" });
              }}
              onCreateSub={(input) =>
                run(() => createSubcategory({ data: input }).then(() => undefined))
              }
              onSaveSub={(input) =>
                run(() => updateSubcategory({ data: input }).then(() => undefined))
              }
              onDeleteSub={(id) =>
                run(() =>
                  deleteSubcategory({ data: { id } }).then(() => undefined),
                )
              }
            />
          ) : (
            <div className="cat-empty">
              No categories yet. Create your first one to get started.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================
// New category pane - fills the right side as a real form
// ============================================================

function NewCategoryPane({
  disabled,
  onCancel,
  onCreate,
}: {
  disabled: boolean;
  onCancel: () => void;
  onCreate: (input: {
    name: string;
    slug?: string;
    description?: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <section className="cat-content-card cat-content-card--form">
      <header className="cat-pane-header cat-pane-header--simple">
        <div>
          <h3 className="cat-pane-title">New category</h3>
          <p className="cat-pane-description">
            Create a category, then add subcategories and articles.
          </p>
        </div>
      </header>

      <form
        className="cat-section cat-section--static"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          onCreate({
            name,
            slug: slug || undefined,
            description: desc || undefined,
          });
        }}
      >
        <div className="cat-form-grid">
          <Field label="Name" required>
            <input
              type="text"
              className="cat-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tech"
              required
              autoFocus
              disabled={disabled}
            />
          </Field>
          <Field label="Slug" hint="auto from name">
            <input
              type="text"
              className="cat-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tech"
              disabled={disabled}
            />
          </Field>
        </div>
        <Field label="Description" hint="optional">
          <textarea
            className="cat-input"
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Short summary shown on the category page"
            disabled={disabled}
          />
        </Field>

        <div className="cat-section-actions">
          <button
            type="button"
            className="cat-btn cat-btn-ghost"
            onClick={onCancel}
            disabled={disabled}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cat-btn cat-btn-primary"
            disabled={disabled || !name.trim()}
          >
            Create category
          </button>
        </div>
      </form>
    </section>
  );
}

// ============================================================
// Category edit pane - always-visible sections (Stripe/Vercel style)
// ============================================================

function CategoryPane({
  category,
  articles,
  disabled,
  confirm,
  onSaveCategory,
  onDeleteCategory,
  onCreateSub,
  onSaveSub,
  onDeleteSub,
}: {
  category: Cat;
  articles: CatArticle[];
  disabled: boolean;
  confirm: ReturnType<typeof useConfirm>;
  onSaveCategory: (input: {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
  }) => void;
  onDeleteCategory: (id: number) => void;
  onCreateSub: (input: {
    categoryId: number;
    name: string;
    slug?: string;
  }) => void;
  onSaveSub: (input: { id: number; name: string; slug: string }) => void;
  onDeleteSub: (id: number) => void;
}) {
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [desc, setDesc] = useState(category.description ?? "");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [subcategoriesOpen, setSubcategoriesOpen] = useState(true);
  const [articlesOpen, setArticlesOpen] = useState(false);

  const dirty =
    name !== category.name ||
    slug !== category.slug ||
    (desc || "") !== (category.description ?? "");

  function reset() {
    setName(category.name);
    setSlug(category.slug);
    setDesc(category.description ?? "");
  }

  async function handleDelete() {
    if (category.articleCount > 0) {
      await confirm({
        title: "Can't delete this category",
        description: `${category.articleCount} article${category.articleCount === 1 ? "" : "s"} still use it. Move or trash ${category.articleCount === 1 ? "it" : "them"} first.`,
        confirmLabel: "OK",
        cancelLabel: "Close",
      });
      return;
    }
    const ok = await confirm({
      title: `Delete "${category.name}"?`,
      description:
        category.subcategories.length > 0
          ? `${category.subcategories.length} subcategor${category.subcategories.length === 1 ? "y" : "ies"} will be removed too. This can't be undone.`
          : "This can't be undone.",
      confirmLabel: "Delete category",
      tone: "danger",
    });
    if (ok) onDeleteCategory(category.id);
  }

  return (
    <section className="cat-content-card">
      <header className="cat-pane-header">
        <div>
          <h2 className="cat-pane-title">{category.name}</h2>
          <div className="cat-pane-meta">
            <span className="cat-pane-slug">/{category.slug}</span>
            <span>
              {category.articleCount} article
              {category.articleCount === 1 ? "" : "s"}
            </span>
            <span>
              {category.subcategories.length} subcategor
              {category.subcategories.length === 1 ? "y" : "ies"}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="cat-btn cat-btn-danger-outline"
          onClick={handleDelete}
          disabled={disabled}
        >
          Delete category
        </button>
      </header>

      <AccordionSection
        id={`category-details-${category.id}`}
        title="Category details"
        open={detailsOpen}
        onToggle={() => setDetailsOpen((v) => !v)}
      >
        <div className="cat-accordion-toolbar cat-accordion-toolbar--details">
          <div className="cat-accordion-copy">
            <p className="cat-accordion-copy-title">Category information</p>
            <p className="cat-accordion-copy-text">
              Update the display name, URL slug, and description for this
              category.
            </p>
          </div>
          <div className="cat-accordion-toolbar-side">
            {dirty ? (
              <div className="cat-section-actions cat-section-actions-inline">
                <button
                  type="button"
                  className="cat-btn cat-btn-ghost"
                  onClick={reset}
                  disabled={disabled}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="cat-btn cat-btn-primary"
                  disabled={disabled || !name.trim()}
                  onClick={() => {
                    onSaveCategory({
                      id: category.id,
                      name,
                      slug,
                      description: desc,
                    });
                    setSavedAt(new Date());
                  }}
                >
                  Save changes
                </button>
              </div>
            ) : savedAt ? (
              <span className="cat-section-saved">
                Saved{" "}
                {savedAt.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            ) : (
              <span className="cat-section-saved">No unsaved changes</span>
            )}
          </div>
        </div>
        <div className="cat-form-grid">
          <Field label="Name" required>
            <input
              type="text"
              className="cat-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={disabled}
            />
          </Field>
          <Field label="Slug" required>
            <input
              type="text"
              className="cat-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={disabled}
            />
          </Field>
        </div>
        <Field label="Description" hint="optional">
          <textarea
            className="cat-input"
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Short summary shown on the category page"
            disabled={disabled}
          />
        </Field>
      </AccordionSection>

      <AccordionSection
        id={`category-subcategories-${category.id}`}
        title={`Subcategories (${category.subcategories.length})`}
        open={subcategoriesOpen}
        onToggle={() => setSubcategoriesOpen((v) => !v)}
      >
        <div className="cat-accordion-toolbar cat-accordion-toolbar--subcategories">
          <div className="cat-accordion-copy">
            <p className="cat-accordion-copy-title">Subcategory structure</p>
            <p className="cat-accordion-copy-text">
              Add and manage the subcategories used under this category.
            </p>
          </div>
          <NewSubInline
            categoryId={category.id}
            disabled={disabled}
            onCreate={onCreateSub}
          />
        </div>
        {category.subcategories.length === 0 ? (
          <p className="cat-section-empty">
            No subcategories yet. Add one above.
          </p>
        ) : (
          <div className="cat-table-wrap">
            <table className="cat-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th style={{ textAlign: "right" }}>Articles</th>
                  <th style={{ textAlign: "right", width: 1 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {category.subcategories.map((s) => (
                  <SubTableRow
                    key={s.id}
                    sub={s}
                    disabled={disabled}
                    confirm={confirm}
                    onSave={onSaveSub}
                    onDelete={onDeleteSub}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AccordionSection>

      <AccordionSection
        id={`category-articles-${category.id}`}
        title={`Articles (${articles.length})`}
        open={articlesOpen}
        onToggle={() => setArticlesOpen((v) => !v)}
      >
        <div className="cat-accordion-toolbar cat-accordion-toolbar--articles">
          <div className="cat-accordion-copy">
            <p className="cat-accordion-copy-title">Assigned articles</p>
            <p className="cat-accordion-copy-text">
              Articles currently grouped under this category.
            </p>
          </div>
        </div>
        {articles.length === 0 ? (
          <p className="cat-section-empty">No articles in this category.</p>
        ) : (
          <div className="cat-table-wrap">
            <table className="cat-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subcategory</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Views</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link
                        to="/admin/articles/$id/edit"
                        params={{ id: String(a.id) }}
                        className="cat-table-link"
                      >
                        {a.title}
                      </Link>
                    </td>
                    <td>{a.subName ?? "-"}</td>
                    <td>
                      <span
                        className={`cat-status status-${a.status as ArticleStatus}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {a.viewCount}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {formatDate(a.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AccordionSection>
    </section>
  );
}

function AccordionSection({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className={`cat-accordion${open ? " is-open" : ""}`}>
      <h3 className="cat-accordion-heading">
        <button
          type="button"
          className="cat-accordion-trigger"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
        >
          <span className="cat-accordion-title">{title}</span>
          <span className="cat-accordion-chevron" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={id}
        className="cat-accordion-panel"
        hidden={!open}
      >
        <div className="cat-accordion-body">{children}</div>
      </div>
    </section>
  );
}

// ============================================================
// Helpers
// ============================================================

function formatDate(d: Date | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="cat-field">
      <span className="cat-field-label">
        {label}
        {required ? <span className="cat-field-req"> *</span> : null}
        {hint ? <span className="cat-field-hint"> · {hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

function SubTableRow({
  sub,
  disabled,
  confirm,
  onSave,
  onDelete,
}: {
  sub: Sub;
  disabled: boolean;
  confirm: ReturnType<typeof useConfirm>;
  onSave: (input: { id: number; name: string; slug: string }) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(sub.name);
  const [slug, setSlug] = useState(sub.slug);
  const articleCount = sub.articleCount ?? 0;

  if (editing) {
    return (
      <tr className="cat-table-row-editing">
        <td>
          <input
            type="text"
            className="cat-input cat-input-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </td>
        <td>
          <input
            type="text"
            className="cat-input cat-input-sm"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </td>
        <td style={{ textAlign: "right", color: "var(--color-subheading)" }}>
          {articleCount}
        </td>
        <td>
          <div className="cat-row-actions cat-row-actions-inline">
            <button
              type="button"
              className="cat-btn cat-btn-ghost cat-btn-sm"
              onClick={() => {
                setName(sub.name);
                setSlug(sub.slug);
                setEditing(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="cat-btn cat-btn-primary cat-btn-sm"
              disabled={disabled}
              onClick={() => {
                onSave({ id: sub.id, name, slug });
                setEditing(false);
              }}
            >
              Save
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>
        <span style={{ fontWeight: 600, color: "var(--color-heading)" }}>
          {sub.name}
        </span>
      </td>
      <td>
        <span className="cat-table-mono">/{sub.slug}</span>
      </td>
      <td
        style={{
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {articleCount}
      </td>
      <td>
        <div className="cat-row-actions cat-row-actions-inline">
          <button
            type="button"
            className="cat-btn cat-btn-ghost cat-btn-sm"
            onClick={() => setEditing(true)}
            disabled={disabled}
          >
            Edit
          </button>
          <button
            type="button"
            className="cat-btn cat-btn-ghost cat-btn-sm cat-btn-danger"
            disabled={disabled}
            onClick={async () => {
              if (articleCount > 0) {
                await confirm({
                  title: "Can't delete this subcategory",
                  description: `${articleCount} article${articleCount === 1 ? "" : "s"} still use it. Move or trash ${articleCount === 1 ? "it" : "them"} first.`,
                  confirmLabel: "OK",
                  cancelLabel: "Close",
                });
                return;
              }
              const ok = await confirm({
                title: `Delete "${sub.name}"?`,
                description: "This can't be undone.",
                confirmLabel: "Delete subcategory",
                tone: "danger",
              });
              if (ok) onDelete(sub.id);
            }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function NewSubInline({
  categoryId,
  disabled,
  onCreate,
}: {
  categoryId: number;
  disabled: boolean;
  onCreate: (input: { categoryId: number; name: string }) => void;
}) {
  const [name, setName] = useState("");
  return (
    <form
      className="cat-section-action-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onCreate({ categoryId, name });
        setName("");
      }}
    >
      <input
        type="text"
        className="cat-input cat-input-sm"
        placeholder="Add subcategory…"
        aria-label="Add subcategory name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        className="cat-btn cat-btn-primary cat-btn-sm"
        disabled={disabled || !name.trim()}
      >
        Add
      </button>
    </form>
  );
}
