import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useTransition } from "react";
import {
  listAdminArticles,
  purgeArticle,
  restoreArticle,
  setArticleStatus,
  softDeleteArticle,
} from "../../server-fns/admin-articles";
import type { ArticleStatus } from "../../server/schema";
import { useConfirm } from "../../components/ConfirmModal";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "published", label: "Published" },
  { key: "archived", label: "Archived" },
  { key: "trashed", label: "Trash" },
] as const;

type Filter = (typeof FILTERS)[number]["key"];

export const Route = createFileRoute("/admin/")({
  validateSearch: (s): { filter?: Filter } => ({
    filter: (FILTERS.find((f) => f.key === s.filter)?.key ?? undefined) as
      | Filter
      | undefined,
  }),
  loaderDeps: ({ search }) => ({ filter: search.filter ?? "all" }),
  loader: async ({ deps }) => {
    const articles = await listAdminArticles({
      data: { filter: deps.filter },
    });
    return { articles };
  },
  component: AdminDashboard,
});

function StatusBadge({
  status,
  trashed,
}: {
  status: ArticleStatus;
  trashed: boolean;
}) {
  if (trashed) {
    return <span className="badge badge-danger status-badge">Trash</span>;
  }
  const map: Record<ArticleStatus, string> = {
    draft: "badge-secondary",
    published: "badge-primary",
    archived: "badge-info",
  };
  return <span className={`badge ${map[status]} status-badge`}>{status}</span>;
}

function formatDate(d: Date | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function AdminDashboard() {
  const router = useRouter();
  const { articles } = Route.useLoaderData();
  // Read from URL search instead of loaderData so the active chip flips
  // instantly on click, before the loader finishes fetching.
  const search = Route.useSearch();
  const filter: Filter = search.filter ?? "all";
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const confirm = useConfirm();

  function refresh() {
    startTransition(() => router.invalidate());
  }

  function handleFilterChange(nextFilter: Filter) {
    router.navigate({
      to: "/admin",
      search: { filter: nextFilter === "all" ? undefined : nextFilter },
    });
  }

  async function changeStatus(id: number, status: ArticleStatus) {
    setPendingId(id);
    try {
      await setArticleStatus({ data: { id, status } });
      refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function trash(id: number) {
    const ok = await confirm({
      title: "Move article to trash?",
      description:
        "It won't be visible on the public site, but you can restore it from the Trash tab.",
      confirmLabel: "Move to trash",
      tone: "danger",
    });
    if (!ok) return;
    setPendingId(id);
    try {
      await softDeleteArticle({ data: { id } });
      refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function restore(id: number) {
    setPendingId(id);
    try {
      await restoreArticle({ data: { id } });
      refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function purge(id: number) {
    const ok = await confirm({
      title: "Delete forever?",
      description:
        "This permanently deletes the article and its markdown body. This cannot be undone.",
      confirmLabel: "Delete forever",
      tone: "danger",
    });
    if (!ok) return;
    setPendingId(id);
    try {
      await purgeArticle({ data: { id } });
      refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <div className="admin-menubar" role="toolbar" aria-label="Articles toolbar">
        <label className="admin-menubar-select-wrap">
          <span className="visually-hidden">Filter articles</span>
          <select
            className="admin-menubar-select"
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value as Filter)}
          >
            {FILTERS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <div className="admin-menubar-filters" role="tablist" aria-label="Filter">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              to="/admin"
              search={{ filter: f.key === "all" ? undefined : f.key }}
              className={`admin-menubar-chip${filter === f.key ? " active" : ""}`}
              activeProps={{}}
              inactiveProps={{}}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <Link
          to="/admin/articles/new"
          className="admin-menubar-action"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="empty-state">No articles in this view.</div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    Views
                  </th>
                  <th>Updated</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => {
                  const trashed = !!a.deletedAt;
                  return (
                    <tr key={a.id}>
                      <td>
                        <Link
                          to="/admin/articles/$id/edit"
                          params={{ id: String(a.id) }}
                          className="article-title"
                        >
                          {a.title}
                        </Link>
                        <div className="row-meta">{a.slug}</div>
                      </td>
                      <td>
                        {a.catName}
                        <div className="row-meta">{a.subName ?? "-"}</div>
                      </td>
                      <td>
                        <StatusBadge status={a.status} trashed={trashed} />
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {a.viewCount.toLocaleString("en-US")}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {formatDate(a.updatedAt)}
                      </td>
                      <td>
                        <div className="row-actions">
                          {trashed ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                disabled={pendingId === a.id}
                                onClick={() => restore(a.id)}
                              >
                                Restore
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                disabled={pendingId === a.id}
                                onClick={() => purge(a.id)}
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <Link
                                to="/admin/articles/$id/edit"
                                params={{ id: String(a.id) }}
                                className="btn btn-sm btn-outline-primary"
                              >
                                Edit
                              </Link>
                              {a.status !== "published" ? (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  disabled={pendingId === a.id}
                                  onClick={() => changeStatus(a.id, "published")}
                                >
                                  Publish
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  disabled={pendingId === a.id}
                                  onClick={() => changeStatus(a.id, "draft")}
                                >
                                  Unpublish
                                </button>
                              )}
                              {a.status !== "archived" ? (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-info"
                                  disabled={pendingId === a.id}
                                  onClick={() => changeStatus(a.id, "archived")}
                                >
                                  Archive
                                </button>
                              ) : null}
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                disabled={pendingId === a.id}
                                onClick={() => trash(a.id)}
                              >
                                Trash
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
