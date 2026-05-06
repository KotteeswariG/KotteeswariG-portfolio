import { Link, createFileRoute } from "@tanstack/react-router";
import { listPublishedArticles } from "../../server-fns/articles";
import { listCategoriesWithSubs } from "../../server-fns/categories";
import { ArticleCard } from "../../components/ArticleCard";
import { ThemeToggle } from "../../components/ThemeToggle";
import { SideNav } from "../../components/SideNav";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { SEO, SITE_URL } from "../../seo";

export const Route = createFileRoute("/articles/")({
  loader: async () => {
    const [articles, categories] = await Promise.all([
      listPublishedArticles({ data: { limit: 50 } }),
      listCategoriesWithSubs(),
    ]);
    return { articles, categories };
  },
  head: () => ({
    meta: [
      { title: `My Blog · ${SEO.title}` },
      {
        name: "description",
        content:
          "My blog by Kotteeswari Ganesh - tutorials, learning notes, and writing on web development, Python, and software engineering.",
      },
      { property: "og:title", content: "My Blog - Kotteeswari Ganesh" },
      {
        property: "og:description",
        content:
          "Tutorials, learning notes, and writing on web development, Python, and software engineering.",
      },
      { property: "og:url", content: `${SITE_URL}/articles` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/articles` }],
  }),
  component: ArticlesIndex,
});

function ArticlesIndex() {
  const { articles, categories } = Route.useLoaderData();
  return (
    <>
      <ThemeToggle />
      <SideNav />
      <main className="articles-page">
        <Breadcrumbs items={[{ label: "My Blog" }]} />

        <header className="blog-header">
          <h1>My Blog</h1>
          <p className="blog-tagline">
            Tutorials, notes and writing on web development and software
            engineering.
          </p>
        </header>

        {categories.length > 0 ? (
          <nav className="blog-filter-pills" aria-label="Topics">
            <Link
              to="/articles"
              className="blog-filter-pill active"
              aria-current="page"
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/articles/$category"
                params={{ category: c.slug }}
                className="blog-filter-pill"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        ) : null}

        {articles.length === 0 ? (
          <div className="empty-state">
            No published posts yet. Check back soon.
          </div>
        ) : (
          <div className="row blog-post-grid">
            {articles.map((a, i) => (
              <ArticleCard
                key={a.id}
                article={a}
                featured={articles.length >= 2 && i === 0}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
