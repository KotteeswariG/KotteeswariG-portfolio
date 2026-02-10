import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { listArticlesByCategory } from "../../../server-fns/articles";
import {
  getCategoryBySlug,
  listCategoriesWithSubs,
} from "../../../server-fns/categories";
import { ArticleCard } from "../../../components/ArticleCard";
import { SideNav } from "../../../components/SideNav";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { SITE_URL } from "../../../seo";

export const Route = createFileRoute("/articles/$category/")({
  loader: async ({ params }) => {
    const [category, articles, categories] = await Promise.all([
      getCategoryBySlug({ data: { slug: params.category } }),
      listArticlesByCategory({ data: { categorySlug: params.category } }),
      listCategoriesWithSubs(),
    ]);
    if (!category) throw notFound();
    return { category, articles, categories };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const c = loaderData.category;
    const url = `${SITE_URL}/articles/${c.slug}`;
    const desc =
      c.description ?? `Posts in the ${c.name} category by Kotteeswari Ganesh.`;
    return {
      meta: [
        { title: `${c.name} · My Blog - Kotteeswari Ganesh` },
        { name: "description", content: desc },
        { property: "og:title", content: `${c.name} · My Blog` },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CategoryIndex,
});

function CategoryIndex() {
  const { category, articles, categories } = Route.useLoaderData();
  const subcategories =
    categories.find((c) => c.id === category.id)?.subcategories ?? [];

  return (
    <>
      <ThemeToggle />
      <SideNav />
      <main className="articles-page">
        <Breadcrumbs
          items={[
            { label: "My Blog", to: "/articles" },
            { label: category.name },
          ]}
        />

        <header className="blog-header">
          <h1>{category.name}</h1>
          {category.description ? (
            <p className="blog-tagline">{category.description}</p>
          ) : null}
        </header>

        <nav className="blog-filter-pills" aria-label="Topics">
          <Link to="/articles" className="blog-filter-pill">
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/articles/$category"
              params={{ category: c.slug }}
              className={`blog-filter-pill${c.id === category.id ? " active" : ""}`}
              aria-current={c.id === category.id ? "page" : undefined}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        {subcategories.length > 0 ? (
          <div className="blog-subcat-pills">
            {subcategories.map((s) => (
              <Link
                key={s.id}
                to="/articles/$category/$subcategory"
                params={{ category: category.slug, subcategory: s.slug }}
              >
                {s.name}
              </Link>
            ))}
          </div>
        ) : null}

        {articles.length === 0 ? (
          <div className="empty-state">No posts in {category.name} yet.</div>
        ) : (
          <div className="row blog-post-grid">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
