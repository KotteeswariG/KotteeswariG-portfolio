import { Link } from "@tanstack/react-router";
import type { PublicArticleSummary } from "../server-fns/articles";

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ArticleCard({
  article,
  featured = false,
}: {
  article: PublicArticleSummary;
  featured?: boolean;
}) {
  if (!article.subcategory) return null;
  const colClass = featured ? "col-12 mb-4 d-flex" : "col-md-6 mb-4 d-flex";
  const cardClass = featured
    ? "blog-post-card blog-post-card-featured"
    : "blog-post-card";

  return (
    <article className={colClass}>
      <Link
        to="/articles/$category/$subcategory/$slug"
        params={{
          category: article.category.slug,
          subcategory: article.subcategory.slug,
          slug: article.slug,
        }}
        className={cardClass}
      >
        {featured ? (
          <div className="blog-post-card-featured-flag">Featured</div>
        ) : null}
        <div className="blog-post-card-tag">
          {article.category.name} · {article.subcategory.name}
        </div>
        <h3 className="blog-post-card-title">{article.title}</h3>
        {article.excerpt ? (
          <p className="blog-post-card-excerpt">{article.excerpt}</p>
        ) : null}
        <div className="blog-post-card-meta">
          {article.publishedAt ? (
            <time dateTime={new Date(article.publishedAt).toISOString()}>
              {formatDate(article.publishedAt)}
            </time>
          ) : null}
          {article.readTimeMinutes ? (
            <>
              <span className="blog-post-card-meta-sep" aria-hidden="true">·</span>
              <span>{article.readTimeMinutes} min read</span>
            </>
          ) : null}
          {featured ? (
            <span className="blog-post-card-meta-cta" aria-hidden="true">
              Read →
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
// trim preview length
