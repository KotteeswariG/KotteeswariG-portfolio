import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { adminListCategoriesWithSubs } from "../../server-fns/admin-categories";
import {
  getAdminArticle,
  setArticleStatus,
  softDeleteArticle,
  updateArticle,
} from "../../server-fns/admin-articles";
import { ArticleForm, AutoSaveBadge } from "./articles.new";
import type { ArticleStatus } from "../../server/schema";
import { useConfirm } from "../../components/ConfirmModal";
import { useAutoSave } from "../../hooks/useAutoSave";

export const Route = createFileRoute("/admin/articles/$id/edit")({
  loader: async ({ params }) => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) throw new Error("Invalid article id");
    const [article, categories] = await Promise.all([
      getAdminArticle({ data: { id } }),
      adminListCategoriesWithSubs(),
    ]);
    return { article, categories };
  },
  component: EditArticle,
});

function EditArticle() {
  const router = useRouter();
  const { article, categories } = Route.useLoaderData();
  const confirm = useConfirm();

  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [excerpt, setExcerpt] = useState(article.excerpt ?? "");
  const [seoTitle, setSeoTitle] = useState(article.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    article.seoDescription ?? "",
  );
  const [coverImage, setCoverImage] = useState(article.coverImage ?? "");
  const [content, setContent] = useState(article.content);
  const [categoryId, setCategoryId] = useState<number | "">(article.categoryId);
  const [subcategoryId, setSubcategoryId] = useState<number | "">(
    article.subcategoryId ?? "",
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [currentStatus, setCurrentStatus] = useState<ArticleStatus>(
    article.status,
  );
  const [trashed, setTrashed] = useState<boolean>(article.deletedAt !== null);

  const subOptions = useMemo(() => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.subcategories ?? [];
  }, [categories, categoryId]);

  const canPersist =
    title.trim().length > 0 && categoryId !== "" && subcategoryId !== "";

  async function persistDraft() {
    if (!canPersist) return;
    await updateArticle({
      data: {
        id: article.id,
        title,
        slug,
        excerpt: excerpt || null,
        content,
        categoryId: Number(categoryId),
        subcategoryId: Number(subcategoryId),
        coverImage: coverImage || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
    });
    setSavedAt(new Date());
  }

  const {
    status: autoStatus,
    savedAt: autoSavedAt,
    errorMessage: autoErrorMessage,
  } = useAutoSave(
    `${title} ${slug} ${excerpt} ${seoTitle} ${seoDescription} ${coverImage} ${content} ${categoryId} ${subcategoryId}`,
    {
      enabled: canPersist,
      delayMs: 1500,
      onSave: persistDraft,
    },
  );

  async function save() {
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
      await updateArticle({
        data: {
          id: article.id,
          title,
          slug,
          excerpt: excerpt || null,
          content,
          categoryId: Number(categoryId),
          subcategoryId: Number(subcategoryId),
          coverImage: coverImage || null,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
        },
      });
      setSavedAt(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setPending(false);
    }
  }

  async function changeStatus(status: ArticleStatus) {
    setPending(true);
    try {
      await save();
      await setArticleStatus({ data: { id: article.id, status } });
      setCurrentStatus(status);
      setTrashed(false);
    } finally {
      setPending(false);
    }
  }

  async function trash() {
    const ok = await confirm({
      title: "Move article to trash?",
      description:
        "It won't be visible on the public site, but you can restore it from the Trash tab.",
      confirmLabel: "Move to trash",
      tone: "danger",
    });
    if (!ok) return;
    setPending(true);
    try {
      await softDeleteArticle({ data: { id: article.id } });
      router.navigate({ to: "/admin" });
    } finally {
      setPending(false);
    }
  }

  const status = trashed ? "trashed" : currentStatus;
  const badgeClass: Record<string, string> = {
    draft: "badge-secondary",
    published: "badge-primary",
    archived: "badge-info",
    trashed: "badge-danger",
  };

  return (
    <div className="editor-edit-page">
      <div className="page-header editor-page-header editor-page-header--edit">
        <div
          className="editor-page-title editor-page-title--edit"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}
        >
          <h2 className="mb-0">Edit</h2>
          <span className={`badge ${badgeClass[status]} status-badge`}>
            {status}
          </span>
          {savedAt ? (
            <span
              className="text-muted"
              style={{ fontSize: "0.78rem" }}
            >
              saved {savedAt.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          ) : null}
          <AutoSaveBadge
            status={autoStatus}
            savedAt={autoSavedAt}
            errorMessage={autoErrorMessage}
          />
        </div>
        <div className="actions">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary editor-action-btn editor-action-btn--compact"
            disabled={pending}
            onClick={save}
          >
            Save
          </button>
          {currentStatus !== "published" ? (
            <button
              type="button"
              className="btn btn-sm btn-primary editor-action-btn editor-action-btn--compact editor-action-btn--primary"
              disabled={pending}
              onClick={() => changeStatus("published")}
            >
              Publish
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary editor-action-btn editor-action-btn--compact"
              disabled={pending}
              onClick={() => changeStatus("draft")}
            >
              Unpublish
            </button>
          )}
          {currentStatus !== "archived" ? (
            <button
              type="button"
              className="btn btn-sm btn-outline-info editor-action-btn editor-action-btn--compact"
              disabled={pending}
              onClick={() => changeStatus("archived")}
            >
              Archive
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger editor-action-btn editor-action-btn--compact"
            disabled={pending}
            onClick={trash}
          >
            Trash
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
        seoSidebar="right"
        editorRestoreKey={`edit-${article.id}`}
      />
    </div>
  );
}
