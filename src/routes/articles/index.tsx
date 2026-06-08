import { Link, createFileRoute } from "@tanstack/react-router";
import { listPublishedArticles } from "../../server-fns/articles";
import { ThemeToggle } from "../../components/ThemeToggle";
import { SideNav } from "../../components/SideNav";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { SEO, SITE_URL } from "../../seo";

function formatShortDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
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

  // Group articles by year (newest year first, newest article first within)
  const groups = new Map<number, typeof articles>();
  for (const a of articles) {
    if (!a.subcategory) continue;
    const year = a.publishedAt
      ? new Date(a.publishedAt).getFullYear()
      : new Date().getFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(a);
  }
  const years = Array.from(groups.keys()).sort((a, b) => b - a);

  return (
    <>
      <ThemeToggle />
      <SideNav />
      <main className="articles-page">
        <Breadcrumbs items={[{ label: "My Blog" }]} />

        <header className="blog-header">
          <h1>Notes</h1>
          <p className="blog-tagline">
            Short writeups on Python, Express, SQL, and DSA — things I
            picked up while building.
          </p>
        </header>

        {articles.length === 0 ? (
          <div className="empty-state">
            No published posts yet. Check back soon.
          </div>
        ) : (
          <div className="blog-notes" aria-label="Articles, newest first">
            {years.map((year) => (
              <section key={year} className="blog-notes-year">
                <h2 className="blog-notes-year-label">{year}</h2>
                <ul className="blog-notes-list">
                  {groups.get(year)!.map((a) => (
                    <li key={a.id} className="blog-notes-row">
                      <Link
                        to="/articles/$category/$subcategory/$slug"
                        params={{
                          category: a.category.slug,
                          subcategory: a.subcategory!.slug,
                          slug: a.slug,
                        }}
                        className="blog-notes-link"
                      >
                        <time className="blog-notes-date">
                          {formatShortDate(a.publishedAt)}
                        </time>
                        <span className="blog-notes-title">{a.title}</span>
                        <span className="blog-notes-cat">
                          {a.category.slug}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
