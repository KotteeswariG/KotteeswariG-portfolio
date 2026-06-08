import { Link, createFileRoute } from "@tanstack/react-router";
import { listPublishedArticles } from "../../server-fns/articles";
import { ThemeToggle } from "../../components/ThemeToggle";
import { SideNav } from "../../components/SideNav";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { SEO, SITE_URL } from "../../seo";

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const Route = createFileRoute("/articles/")({
  loader: async () => {
    const articles = await listPublishedArticles({ data: { limit: 100 } });
    return { articles };
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
  const { articles } = Route.useLoaderData();
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

        {articles.length === 0 ? (
          <div className="empty-state">
            No published posts yet. Check back soon.
          </div>
        ) : (
          <ul className="blog-post-list" aria-label="Articles, newest first">
            {articles.map((a) =>
              a.subcategory ? (
                <li key={a.id} className="blog-post-list-item">
                  <Link
                    to="/articles/$category/$subcategory/$slug"
                    params={{
                      category: a.category.slug,
                      subcategory: a.subcategory.slug,
                      slug: a.slug,
                    }}
                    className="blog-post-list-link"
                  >
                    <span className="blog-post-list-date">
                      {a.publishedAt ? formatDate(a.publishedAt) : ""}
                    </span>
                    <span className="blog-post-list-title">{a.title}</span>
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </main>
    </>
  );
}
