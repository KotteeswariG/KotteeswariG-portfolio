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

export function ArticleCard({ article }: { article: PublicArticleSummary }) {
  if (!article.subcategory) return null;

  return (
    <article className="blog-post-grid-item">
      <Link
        to="/articles/$category/$subcategory/$slug"
        params={{
          category: article.category.slug,
          subcategory: article.subcategory.slug,
          slug: article.slug,
        }}
        className="blog-post-card"
      >
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
        </div>
      </Link>
    </article>
  );
}
