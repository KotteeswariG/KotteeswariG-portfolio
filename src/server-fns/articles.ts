import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { getDb, schema } from "../server/db";
import { getArticleMarkdown } from "../server/r2";
import { notFound } from "@tanstack/react-router";
import { getRequestHeader } from "@tanstack/react-start/server";

const BOT_UA_RE =
  /bot|crawl|spider|slurp|fetch|monitor|preview|wget|curl|python|httpclient|headlesschrome|lighthouse|whatsapp|telegram|skype|discord|facebookexternalhit/i;

function isBotRequest(): boolean {
  try {
    const ua = getRequestHeader("user-agent");
    if (!ua) return true;
    return BOT_UA_RE.test(ua);
  } catch {
    return false;
  }
}

// Per-IP view dedup, backed by D1 so it survives Worker restarts and
// works across instances. The same reader won't bump view_count twice
// within VIEW_WINDOW_MS on any instance.
const VIEW_WINDOW_MS = 6 * 60 * 60 * 1000;

function getClientIp(): string | null {
  try {
    const cf = getRequestHeader("cf-connecting-ip");
    if (cf) return cf;
    const xff = getRequestHeader("x-forwarded-for");
    if (xff) return xff.split(",")[0]?.trim() ?? null;
    return null;
  } catch {
    return null;
  }
}

async function hashIp(ip: string): Promise<string> {
  // SHA-256 the IP so we don't store raw addresses. The hash is stable
  // for the dedup window which is all we need.
  const data = new TextEncoder().encode(`kg-view-salt:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

/**
 * Returns true if this IP hasn't viewed this article within VIEW_WINDOW_MS.
 * Upserts the (articleId, ipHash) row in article_views with the current
 * timestamp. Safe to call without await on the view-bump itself — the
 * dedup check is the source of truth.
 */
async function shouldCountView(
  db: ReturnType<typeof getDb>,
  articleId: number,
  ip: string | null,
): Promise<boolean> {
  if (!ip) return true;
  const ipHash = await hashIp(ip);
  const now = new Date();
  const cutoff = new Date(now.getTime() - VIEW_WINDOW_MS);

  const existing = await db
    .select({ lastSeenAt: schema.articleViews.lastSeenAt })
    .from(schema.articleViews)
    .where(
      and(
        eq(schema.articleViews.articleId, articleId),
        eq(schema.articleViews.ipHash, ipHash),
      ),
    )
    .get();

  if (existing && existing.lastSeenAt > cutoff) {
    // Recent view from this IP - bump the timestamp but don't count again.
    await db
      .update(schema.articleViews)
      .set({ lastSeenAt: now })
      .where(
        and(
          eq(schema.articleViews.articleId, articleId),
          eq(schema.articleViews.ipHash, ipHash),
        ),
      );
    return false;
  }

  if (existing) {
    await db
      .update(schema.articleViews)
      .set({ lastSeenAt: now })
      .where(
        and(
          eq(schema.articleViews.articleId, articleId),
          eq(schema.articleViews.ipHash, ipHash),
        ),
      );
  } else {
    await db.insert(schema.articleViews).values({
      articleId,
      ipHash,
      lastSeenAt: now,
    });
  }
  return true;
}

export type PublicArticleSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: { slug: string; name: string };
  subcategory: { slug: string; name: string } | null;
  readTimeMinutes: number | null;
  publishedAt: Date | null;
};

function notDeleted() {
  return isNull(schema.articles.deletedAt);
}

export const listPublishedArticles = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number; offset?: number } | undefined) => ({
    limit: Math.min(input?.limit ?? 50, 100),
    offset: Math.max(input?.offset ?? 0, 0),
  }))
  .handler(async ({ data }): Promise<PublicArticleSummary[]> => {
    const db = getDb();
    const rows = await db
      .select({
        id: schema.articles.id,
        slug: schema.articles.slug,
        title: schema.articles.title,
        excerpt: schema.articles.excerpt,
        coverImage: schema.articles.coverImage,
        readTimeMinutes: schema.articles.readTimeMinutes,
        publishedAt: schema.articles.publishedAt,
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
      .where(and(eq(schema.articles.status, "published"), notDeleted()))
      .orderBy(desc(schema.articles.publishedAt))
      .limit(data.limit)
      .offset(data.offset);

    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      coverImage: r.coverImage,
      category: { slug: r.catSlug, name: r.catName },
      subcategory: r.subSlug && r.subName
        ? { slug: r.subSlug, name: r.subName }
        : null,
      readTimeMinutes: r.readTimeMinutes,
      publishedAt: r.publishedAt,
    }));
  });

export const listArticlesByCategory = createServerFn({ method: "GET" })
  .inputValidator((input: { categorySlug: string; subcategorySlug?: string }) => input)
  .handler(async ({ data }): Promise<PublicArticleSummary[]> => {
    const db = getDb();
    const cat = await db.query.categories.findFirst({
      where: eq(schema.categories.slug, data.categorySlug),
    });
    if (!cat) throw notFound();

    let subcategoryFilter;
    if (data.subcategorySlug) {
      const sub = await db.query.subcategories.findFirst({
        where: and(
          eq(schema.subcategories.categoryId, cat.id),
          eq(schema.subcategories.slug, data.subcategorySlug),
        ),
      });
      if (!sub) throw notFound();
      subcategoryFilter = eq(schema.articles.subcategoryId, sub.id);
    }

    const rows = await db
      .select({
        id: schema.articles.id,
        slug: schema.articles.slug,
        title: schema.articles.title,
        excerpt: schema.articles.excerpt,
        coverImage: schema.articles.coverImage,
        readTimeMinutes: schema.articles.readTimeMinutes,
        publishedAt: schema.articles.publishedAt,
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
      .where(
        and(
          eq(schema.articles.status, "published"),
          notDeleted(),
          eq(schema.articles.categoryId, cat.id),
          ...(subcategoryFilter ? [subcategoryFilter] : []),
        ),
      )
      .orderBy(desc(schema.articles.publishedAt));

    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      coverImage: r.coverImage,
      category: { slug: r.catSlug, name: r.catName },
      subcategory: r.subSlug && r.subName
        ? { slug: r.subSlug, name: r.subName }
        : null,
      readTimeMinutes: r.readTimeMinutes,
      publishedAt: r.publishedAt,
    }));
  });

export type PublicArticleDetail = PublicArticleSummary & {
  content: string;
  authorName: string;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: Date;
  viewCount: number;
};

export const getPublishedArticle = createServerFn({ method: "GET" })
  .inputValidator(
    (input: {
      categorySlug: string;
      subcategorySlug: string;
      slug: string;
    }) => input,
  )
  .handler(async ({ data }): Promise<PublicArticleDetail> => {
    const db = getDb();
    const row = await db
      .select({
        article: schema.articles,
        category: schema.categories,
        subcategory: schema.subcategories,
      })
      .from(schema.articles)
      .innerJoin(
        schema.categories,
        eq(schema.articles.categoryId, schema.categories.id),
      )
      .innerJoin(
        schema.subcategories,
        eq(schema.articles.subcategoryId, schema.subcategories.id),
      )
      .where(
        and(
          eq(schema.articles.slug, data.slug),
          eq(schema.articles.status, "published"),
          notDeleted(),
          eq(schema.categories.slug, data.categorySlug),
          eq(schema.subcategories.slug, data.subcategorySlug),
        ),
      )
      .get();

    if (!row) throw notFound();

    const content = (await getArticleMarkdown(row.article.contentKey)) ?? "";

    // Best-effort view-count increment. Skip bots and dedupe by IP within
    // VIEW_WINDOW_MS (via article_views table) so the same reader doesn't
    // double-count. Don't fail the page render on a D1 hiccup.
    let viewCount = row.article.viewCount;
    if (!isBotRequest()) {
      const ip = getClientIp();
      try {
        if (await shouldCountView(db, row.article.id, ip)) {
          viewCount = viewCount + 1;
          await db
            .update(schema.articles)
            .set({ viewCount: sql`${schema.articles.viewCount} + 1` })
            .where(eq(schema.articles.id, row.article.id));
        }
      } catch (e) {
        // Don't break the page on a dedup/D1 hiccup.
        console.error("[view-count]", e);
      }
    }

    return {
      id: row.article.id,
      slug: row.article.slug,
      title: row.article.title,
      excerpt: row.article.excerpt,
      coverImage: row.article.coverImage,
      category: { slug: row.category.slug, name: row.category.name },
      subcategory: { slug: row.subcategory.slug, name: row.subcategory.name },
      readTimeMinutes: row.article.readTimeMinutes,
      publishedAt: row.article.publishedAt,
      content,
      authorName: row.article.authorName,
      seoTitle: row.article.seoTitle,
      seoDescription: row.article.seoDescription,
      updatedAt: row.article.updatedAt,
      viewCount,
    };
  });

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  publishedAt: Date | null;
  coverImage: string | null;
};

export async function querySitemapEntries(): Promise<SitemapEntry[]> {
  const db = getDb();
  const rows = await db
    .select({
      slug: schema.articles.slug,
      publishedAt: schema.articles.publishedAt,
      updatedAt: schema.articles.updatedAt,
      coverImage: schema.articles.coverImage,
      catSlug: schema.categories.slug,
      subSlug: schema.subcategories.slug,
    })
    .from(schema.articles)
    .innerJoin(
      schema.categories,
      eq(schema.articles.categoryId, schema.categories.id),
    )
    .innerJoin(
      schema.subcategories,
      eq(schema.articles.subcategoryId, schema.subcategories.id),
    )
    .where(and(eq(schema.articles.status, "published"), notDeleted()));

  return rows.map((r) => ({
    url: `/articles/${r.catSlug}/${r.subSlug}/${r.slug}`,
    lastModified: r.updatedAt,
    publishedAt: r.publishedAt,
    coverImage: r.coverImage,
  }));
}

export const listSitemapEntries = createServerFn({ method: "GET" }).handler(
  () => querySitemapEntries(),
);
