import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { notFound } from "@tanstack/react-router";
import { getDb, schema } from "../server/db";
import { requireAdmin } from "../server/auth";
import {
  articleKey,
  deleteArticleMarkdown,
  getArticleMarkdown,
  putArticleImage,
  putArticleMarkdown,
} from "../server/r2";
import type { ArticleStatus } from "../server/schema";

const STATUS_VALUES = ["draft", "published", "archived"] as const;
const ADMIN_FILTERS = [
  "all",
  "draft",
  "published",
  "archived",
  "trashed",
] as const;
type AdminFilter = (typeof ADMIN_FILTERS)[number];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function estimateReadTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const listAdminArticles = createServerFn({ method: "GET" })
  .inputValidator(
    (input: { filter?: AdminFilter } | undefined) => ({
      filter: input?.filter ?? "all",
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const filter = data.filter;
    const conditions = [];
    if (filter === "trashed") {
      conditions.push(isNotNull(schema.articles.deletedAt));
    } else {
      conditions.push(isNull(schema.articles.deletedAt));
      if (filter !== "all") {
        conditions.push(eq(schema.articles.status, filter));
      }
    }
    const rows = await db
      .select({
        id: schema.articles.id,
        slug: schema.articles.slug,
        title: schema.articles.title,
        status: schema.articles.status,
        publishedAt: schema.articles.publishedAt,
        updatedAt: schema.articles.updatedAt,
        deletedAt: schema.articles.deletedAt,
        viewCount: schema.articles.viewCount,
        catSlug: schema.categories.slug,
        catName: schema.categories.name,
        subSlug: schema.subcategories.slug,
        subName: schema.subcategories.name,
      })
      .from(schema.articles)
      .innerJoin(
        schema.categories,
        eq(schema.articles.categoryId, schema.categories.id),
      )
      .leftJoin(
        schema.subcategories,
        eq(schema.articles.subcategoryId, schema.subcategories.id),
      )
      .where(and(...conditions))
      .orderBy(desc(schema.articles.updatedAt));
    return rows;
  });

export const getAdminArticle = createServerFn({ method: "GET" })
  .inputValidator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const row = await db.query.articles.findFirst({
      where: eq(schema.articles.id, data.id),
    });
    if (!row) throw notFound();
    const content = await getArticleMarkdown(row.contentKey);
    return { ...row, content: content ?? "" };
  });

export const uploadArticleImage = createServerFn({ method: "POST" })
  .inputValidator((input: FormData) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const file = data.get("file");
    if (!(file instanceof File)) {
      throw new Error("Choose an image file to upload.");
    }
    return await putArticleImage(file);
  });

export const createArticle = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      title: string;
      slug?: string;
      excerpt?: string | null;
      content: string;
      categoryId: number;
      subcategoryId: number;
      coverImage?: string | null;
      seoTitle?: string | null;
      seoDescription?: string | null;
      status?: ArticleStatus;
    }) => input,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const slug = (data.slug && slugify(data.slug)) || slugify(data.title);
    if (!slug) throw new Error("Slug could not be derived from title");

    const status: ArticleStatus = data.status ?? "draft";
    const now = new Date();
    const publishedAt = status === "published" ? now : null;

    const [{ id }] = await db
      .insert(schema.articles)
      .values({
        slug,
        title: data.title.trim(),
        excerpt: data.excerpt?.trim() || null,
        contentKey: "pending",
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        coverImage: data.coverImage?.trim() || null,
        seoTitle: data.seoTitle?.trim() || null,
        seoDescription: data.seoDescription?.trim() || null,
        status,
        readTimeMinutes: estimateReadTime(data.content),
        publishedAt,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: schema.articles.id });

    const key = articleKey(id);
    await putArticleMarkdown(id, data.content);
    await db
      .update(schema.articles)
      .set({ contentKey: key })
      .where(eq(schema.articles.id, id));

    return { id, slug };
  });

export const updateArticle = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      id: number;
      title: string;
      slug: string;
      excerpt?: string | null;
      content: string;
      categoryId: number;
      subcategoryId: number;
      coverImage?: string | null;
      seoTitle?: string | null;
      seoDescription?: string | null;
    }) => input,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const existing = await db.query.articles.findFirst({
      where: eq(schema.articles.id, data.id),
    });
    if (!existing) throw notFound();

    const slug = slugify(data.slug) || existing.slug;
    const now = new Date();
    await putArticleMarkdown(data.id, data.content);
    await db
      .update(schema.articles)
      .set({
        title: data.title.trim(),
        slug,
        excerpt: data.excerpt?.trim() || null,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        coverImage: data.coverImage?.trim() || null,
        seoTitle: data.seoTitle?.trim() || null,
        seoDescription: data.seoDescription?.trim() || null,
        readTimeMinutes: estimateReadTime(data.content),
        updatedAt: now,
      })
      .where(eq(schema.articles.id, data.id));

    return { id: data.id, slug };
  });

export const setArticleStatus = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { id: number; status: ArticleStatus }) => {
      if (!STATUS_VALUES.includes(input.status)) {
        throw new Error("Invalid status");
      }
      return input;
    },
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const existing = await db.query.articles.findFirst({
      where: eq(schema.articles.id, data.id),
    });
    if (!existing) throw notFound();

    const now = new Date();
    const publishedAt =
      data.status === "published" && !existing.publishedAt
        ? now
        : existing.publishedAt;

    await db
      .update(schema.articles)
      .set({
        status: data.status,
        publishedAt,
        deletedAt: null,
        updatedAt: now,
      })
      .where(eq(schema.articles.id, data.id));
    return { ok: true as const };
  });

export const softDeleteArticle = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const now = new Date();
    await db
      .update(schema.articles)
      .set({ deletedAt: now, updatedAt: now })
      .where(eq(schema.articles.id, data.id));
    return { ok: true as const };
  });

export const restoreArticle = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const now = new Date();
    await db
      .update(schema.articles)
      .set({ deletedAt: null, updatedAt: now })
      .where(eq(schema.articles.id, data.id));
    return { ok: true as const };
  });

export const listArticlesInCategory = createServerFn({ method: "GET" })
  .inputValidator((input: { categoryId: number }) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const rows = await db
      .select({
        id: schema.articles.id,
        slug: schema.articles.slug,
        title: schema.articles.title,
        status: schema.articles.status,
        publishedAt: schema.articles.publishedAt,
        updatedAt: schema.articles.updatedAt,
        viewCount: schema.articles.viewCount,
        subSlug: schema.subcategories.slug,
        subName: schema.subcategories.name,
      })
      .from(schema.articles)
      .leftJoin(
        schema.subcategories,
        eq(schema.articles.subcategoryId, schema.subcategories.id),
      )
      .where(
        and(
          eq(schema.articles.categoryId, data.categoryId),
          isNull(schema.articles.deletedAt),
        ),
      )
      .orderBy(desc(schema.articles.updatedAt));
    return rows;
  });

export const purgeArticle = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const existing = await db.query.articles.findFirst({
      where: eq(schema.articles.id, data.id),
    });
    if (!existing) return { ok: true as const };
    if (existing.contentKey) {
      try {
        await deleteArticleMarkdown(existing.contentKey);
      } catch {
        // ignore - DB delete still succeeds
      }
    }
    await db.delete(schema.articles).where(eq(schema.articles.id, data.id));
    return { ok: true as const };
  });
