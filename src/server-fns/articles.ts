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

// Per-IP view dedup. Lives in the Worker instance's memory, so it resets
// when Cloudflare cycles the instance — that's the intended "soft" dedup:
// the same reader won't bump view_count twice within VIEW_WINDOW_MS on a
// given instance.
const VIEW_WINDOW_MS = 6 * 60 * 60 * 1000;
const MAX_IPS_PER_ARTICLE = 5_000;
const viewDedupe = new Map<number, Map<string, number>>();

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

function shouldCountView(articleId: number, ip: string | null): boolean {
  if (!ip) return true;
  const now = Date.now();
  let perArticle = viewDedupe.get(articleId);
  if (!perArticle) {
    perArticle = new Map();
    viewDedupe.set(articleId, perArticle);
  }
  const last = perArticle.get(ip);
  if (last !== undefined && now - last < VIEW_WINDOW_MS) {
    perArticle.set(ip, now);
    return false;
  }
  perArticle.set(ip, now);
  if (perArticle.size > MAX_IPS_PER_ARTICLE) {
    const entries = Array.from(perArticle.entries()).sort(
      (a, b) => a[1] - b[1],
    );
    perArticle.clear();
    for (const [k, v] of entries.slice(Math.floor(entries.length / 2))) {
      perArticle.set(k, v);
    }
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
    // VIEW_WINDOW_MS so the same reader doesn't double-count. Don't fail
    // the page render on a D1 hiccup.
    let viewCount = row.article.viewCount;
    if (!isBotRequest()) {
      const ip = getClientIp();
      if (shouldCountView(row.article.id, ip)) {
        viewCount = viewCount + 1;
        try {
          await db
            .update(schema.articles)
            .set({ viewCount: sql`${schema.articles.viewCount} + 1` })
            .where(eq(schema.articles.id, row.article.id));
        } catch {
          // ignore - display the optimistic count anyway
        }
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
