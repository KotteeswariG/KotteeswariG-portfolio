import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "../server/db";

export type CategoryWithSubs = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  subcategories: {
    id: number;
    slug: string;
    name: string;
    description: string | null;
  }[];
};

export const listCategoriesWithSubs = createServerFn({ method: "GET" }).handler(
  async (): Promise<CategoryWithSubs[]> => {
    const db = getDb();
    const cats = await db
      .select()
      .from(schema.categories)
      .orderBy(asc(schema.categories.sortOrder), asc(schema.categories.name));

    if (cats.length === 0) return [];

    const subs = await db
      .select()
      .from(schema.subcategories)
      .orderBy(
        asc(schema.subcategories.sortOrder),
        asc(schema.subcategories.name),
      );

    const subsByCat = new Map<number, typeof subs>();
    for (const s of subs) {
      const arr = subsByCat.get(s.categoryId) ?? [];
      arr.push(s);
      subsByCat.set(s.categoryId, arr);
    }

    return cats.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      subcategories: (subsByCat.get(c.id) ?? []).map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        description: s.description,
      })),
    }));
  },
);

export const getCategoryBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const db = getDb();
    return await db.query.categories.findFirst({
      where: eq(schema.categories.slug, data.slug),
    });
  });

export const getSubcategoryBySlug = createServerFn({ method: "GET" })
  .inputValidator(
    (input: { categorySlug: string; subcategorySlug: string }) => input,
  )
  .handler(async ({ data }) => {
    const db = getDb();
    const cat = await db.query.categories.findFirst({
      where: eq(schema.categories.slug, data.categorySlug),
    });
    if (!cat) return null;
    const sub = await db.query.subcategories.findFirst({
      where: eq(schema.subcategories.slug, data.subcategorySlug),
    });
    if (!sub || sub.categoryId !== cat.id) return null;
    return { category: cat, subcategory: sub };
  });
