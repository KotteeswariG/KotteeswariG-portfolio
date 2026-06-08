import { createServerFn } from "@tanstack/react-start";
import { and, eq, isNull, sql } from "drizzle-orm";
import { notFound } from "@tanstack/react-router";
import { getDb, schema } from "../server/db";
import { requireAdmin } from "../server/auth";
import { deleteArticleMarkdown } from "../server/r2";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export const createCategory = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      name: string;
      slug?: string;
      description?: string | null;
      sortOrder?: number;
    }) => input,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const slug = (data.slug && slugify(data.slug)) || slugify(data.name);
    if (!slug) throw new Error("Slug could not be derived");
    const now = new Date();
    const [{ id }] = await db
      .insert(schema.categories)
      .values({
        name: data.name.trim(),
        slug,
        description: data.description?.trim() || null,
        sortOrder: data.sortOrder ?? 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: schema.categories.id });
    return { id, slug };
  });

export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      id: number;
      name: string;
      slug: string;
      description?: string | null;
      sortOrder?: number;
    }) => input,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const slug = slugify(data.slug);
    if (!slug) throw new Error("Slug could not be derived");
    await db
      .update(schema.categories)
      .set({
        name: data.name.trim(),
        slug,
        description: data.description?.trim() || null,
        sortOrder: data.sortOrder ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(schema.categories.id, data.id));
    return { ok: true as const };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();

    // Hard cascade: delete every article that lives under this category
    // (live or trashed), its R2 markdown, all subcategories, then the
    // category itself. article_views rows for those articles cascade
    // via FK ON DELETE CASCADE. subcategories cascade from categories.
    const articles = await db
      .select({
        id: schema.articles.id,
        contentKey: schema.articles.contentKey,
      })
      .from(schema.articles)
      .where(eq(schema.articles.categoryId, data.id));

    let purgedArticles = 0;
    for (const a of articles) {
      if (a.contentKey && a.contentKey !== "pending") {
        try {
          await deleteArticleMarkdown(a.contentKey);
        } catch {
          // R2 hiccup - keep going, DB delete still succeeds
        }
      }
      purgedArticles++;
    }

    if (articles.length > 0) {
      await db
        .delete(schema.articles)
        .where(eq(schema.articles.categoryId, data.id));
    }

    // Subcategories would cascade from the category delete, but D1
    // sometimes surfaces opaque FK errors; deleting explicitly first
    // gives clearer behavior.
    await db
      .delete(schema.subcategories)
      .where(eq(schema.subcategories.categoryId, data.id));

    await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, data.id));

    return { ok: true as const, purgedArticles };
  });

export const createSubcategory = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      categoryId: number;
      name: string;
      slug?: string;
      description?: string | null;
      sortOrder?: number;
    }) => input,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const slug = (data.slug && slugify(data.slug)) || slugify(data.name);
    if (!slug) throw new Error("Slug could not be derived");
    const now = new Date();
    const [{ id }] = await db
      .insert(schema.subcategories)
      .values({
        categoryId: data.categoryId,
        name: data.name.trim(),
        slug,
        description: data.description?.trim() || null,
        sortOrder: data.sortOrder ?? 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: schema.subcategories.id });
    return { id, slug };
  });

export const updateSubcategory = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      id: number;
      name: string;
      slug: string;
      description?: string | null;
      sortOrder?: number;
    }) => input,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const slug = slugify(data.slug);
    if (!slug) throw new Error("Slug could not be derived");
    await db
      .update(schema.subcategories)
      .set({
        name: data.name.trim(),
        slug,
        description: data.description?.trim() || null,
        sortOrder: data.sortOrder ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(schema.subcategories.id, data.id));
    return { ok: true as const };
  });

export const deleteSubcategory = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();

    // Refuse if any live articles still use this subcategory.
    const liveRow = await db
      .select({ n: sql<number>`count(*)` })
      .from(schema.articles)
      .where(
        and(
          eq(schema.articles.subcategoryId, data.id),
          isNull(schema.articles.deletedAt),
        ),
      )
      .get();
    const live = Number(liveRow?.n ?? 0);
    if (live > 0) {
      throw new Error(
        `Can't delete: ${live} article${live === 1 ? "" : "s"} still use this subcategory. Move or trash them first.`,
      );
    }

    // articles.subcategory_id is nullable. Trashed articles still hold
    // an FK reference (which would block the delete on the DB layer),
    // so null them out first - trashed articles don't need a
    // subcategory anyway.
    await db
      .update(schema.articles)
      .set({ subcategoryId: null })
      .where(eq(schema.articles.subcategoryId, data.id));

    await db
      .delete(schema.subcategories)
      .where(eq(schema.subcategories.id, data.id));
    return { ok: true as const };
  });

export const adminListCategoriesWithSubs = createServerFn({
  method: "GET",
}).handler(async () => {
  await requireAdmin();
  const db = getDb();
  const cats = await db.select().from(schema.categories);
  if (cats.length === 0) return [];
  const subs = await db.select().from(schema.subcategories);

  // Count live (non-trashed) articles per category and per subcategory.
  const articleCountRows = await db
    .select({
      categoryId: schema.articles.categoryId,
      subcategoryId: schema.articles.subcategoryId,
      n: sql<number>`count(*)`,
    })
    .from(schema.articles)
    .where(isNull(schema.articles.deletedAt))
    .groupBy(schema.articles.categoryId, schema.articles.subcategoryId);

  const catCounts = new Map<number, number>();
  const subCounts = new Map<number, number>();
  for (const r of articleCountRows) {
    const n = Number(r.n);
    catCounts.set(r.categoryId, (catCounts.get(r.categoryId) ?? 0) + n);
    if (r.subcategoryId != null) {
      subCounts.set(r.subcategoryId, (subCounts.get(r.subcategoryId) ?? 0) + n);
    }
  }

  const byCat = new Map<number, typeof subs>();
  for (const s of subs) {
    const arr = byCat.get(s.categoryId) ?? [];
    arr.push(s);
    byCat.set(s.categoryId, arr);
  }
  return cats
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    .map((c) => ({
      ...c,
      articleCount: catCounts.get(c.id) ?? 0,
      subcategories: (byCat.get(c.id) ?? [])
        .sort(
          (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
        )
        .map((s) => ({ ...s, articleCount: subCounts.get(s.id) ?? 0 })),
    }));
});

export const getCategoryWithSubs = createServerFn({ method: "GET" })
  .inputValidator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const cat = await db.query.categories.findFirst({
      where: eq(schema.categories.id, data.id),
    });
    if (!cat) throw notFound();
    const subs = await db
      .select()
      .from(schema.subcategories)
      .where(eq(schema.subcategories.categoryId, data.id));
    return { category: cat, subcategories: subs };
  });
