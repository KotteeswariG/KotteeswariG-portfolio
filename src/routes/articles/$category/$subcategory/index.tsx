import { createFileRoute, notFound } from "@tanstack/react-router";
import { listArticlesByCategory } from "../../../../server-fns/articles";
import {
  getSubcategoryBySlug,
  listCategoriesWithSubs,
} from "../../../../server-fns/categories";
import { ArticleCard } from "../../../../components/ArticleCard";
import { SideNav } from "../../../../components/SideNav";
import { Breadcrumbs } from "../../../../components/Breadcrumbs";
import { ThemeToggle } from "../../../../components/ThemeToggle";
import { SITE_URL } from "../../../../seo";

export const Route = createFileRoute("/articles/$category/$subcategory/")({
  loader: async ({ params }) => {
    const result = await getSubcategoryBySlug({
      data: {
        categorySlug: params.category,
        subcategorySlug: params.subcategory,
      },
    });
    if (!result) throw notFound();
    const [articles, categories] = await Promise.all([
      listArticlesByCategory({
        data: {
          categorySlug: params.category,
          subcategorySlug: params.subcategory,
        },
      }),
      listCategoriesWithSubs(),
    ]);
    return {
      category: result.category,
      subcategory: result.subcategory,
      articles,
      categories,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { category, subcategory } = loaderData;
    const url = `${SITE_URL}/articles/${category.slug}/${subcategory.slug}`;
    const desc =
      subcategory.description ??
      `${subcategory.name} posts in ${category.name} by Kotteeswari Ganesh.`;
    return {
      meta: [
        {
          title: `${subcategory.name} · ${category.name} - Kotteeswari Ganesh`,
        },
        { name: "description", content: desc },
        {
          property: "og:title",
          content: `${subcategory.name} · ${category.name}`,
        },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: SubcategoryIndex,
});

function SubcategoryIndex() {
  const { category, subcategory, articles } = Route.useLoaderData();
  return (
    <>
      <ThemeToggle />
      <SideNav />
      <main className="articles-page">
        <Breadcrumbs
          items={[
            { label: "My Blog", to: "/articles" },
            {
              label: category.name,
              to: "/articles/$category",
              params: { category: category.slug },
            },
            { label: subcategory.name },
          ]}
        />
        <h1 className="mb-1">{subcategory.name}</h1>
        {subcategory.description ? (
          <p className="subheading mb-4">{subcategory.description}</p>
        ) : (
          <div className="mb-4" />
        )}

        {articles.length === 0 ? (
          <div className="empty-state">
            No posts in {subcategory.name} yet.
          </div>
        ) : (
          <div className="row">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
