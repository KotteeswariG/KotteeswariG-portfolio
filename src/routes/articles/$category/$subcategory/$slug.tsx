import { Link, createFileRoute } from "@tanstack/react-router";
import { getPublishedArticle } from "../../../../server-fns/articles";
import { listCategoriesWithSubs } from "../../../../server-fns/categories";
import { MarkdownView } from "../../../../components/MarkdownView";
import { SideNav } from "../../../../components/SideNav";
import { Breadcrumbs } from "../../../../components/Breadcrumbs";
import { ThemeToggle } from "../../../../components/ThemeToggle";
import { ReadingProgress } from "../../../../components/ReadingProgress";
import { AuthorFooter } from "../../../../components/AuthorFooter";
import {
  SITE_URL,
  absoluteSiteUrl,
  articleJsonLd,
  articleUrl,
} from "../../../../seo";

export const Route = createFileRoute(
  "/articles/$category/$subcategory/$slug",
)({
  loader: async ({ params }) => {
    const [article, categories] = await Promise.all([
      getPublishedArticle({
        data: {
          categorySlug: params.category,
          subcategorySlug: params.subcategory,
          slug: params.slug,
        },
      }),
      listCategoriesWithSubs(),
    ]);
    return { article, categories };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const a = loaderData.article;
    const url = articleUrl({
      category: a.category,
      subcategory: a.subcategory,
      slug: a.slug,
    });
    const description =
      a.seoDescription ?? a.excerpt ?? `${a.title} by ${a.authorName}.`;
    const title = a.seoTitle ?? `${a.title} - ${a.authorName}`;
    const image = a.coverImage
      ? absoluteSiteUrl(a.coverImage)
      : `${SITE_URL}/img/profile.png`;
    const published = a.publishedAt
      ? new Date(a.publishedAt).toISOString()
      : null;
    const modified = new Date(a.updatedAt).toISOString();

    const ldInput = {
      title: a.title,
      description,
      slug: a.slug,
      category: a.category,
      subcategory: a.subcategory,
      authorName: a.authorName,
      publishedAt: a.publishedAt,
      updatedAt: a.updatedAt,
      coverImage: a.coverImage ?? null,
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "author", content: a.authorName },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "og:image:alt", content: a.title },
        ...(published
          ? [{ property: "article:published_time", content: published }]
          : []),
        { property: "article:modified_time", content: modified },
        { property: "article:author", content: a.authorName },
        { property: "article:section", content: a.category.name },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(articleJsonLd(ldInput)),
        },
      ],
    };
  },
  component: ArticlePage,
});

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  return (
    <>
      <ThemeToggle />
      <SideNav />
      <ReadingProgress />
      <main className="articles-page article-page">
        <Breadcrumbs
          items={[
            { label: "My Blog", to: "/articles" },
            {
              label: article.category.name,
              to: "/articles/$category",
              params: { category: article.category.slug },
            },
            {
              label: article.subcategory.name,
              to: "/articles/$category/$subcategory",
              params: {
                category: article.category.slug,
                subcategory: article.subcategory.slug,
              },
            },
            { label: article.title },
          ]}
        />

        <article>
          <header className="article-header">
            <div className="article-tag">
              <Link
                to="/articles/$category"
                params={{ category: article.category.slug }}
              >
                {article.category.name}
              </Link>
              <span aria-hidden="true">·</span>
              <Link
                to="/articles/$category/$subcategory"
                params={{
                  category: article.category.slug,
                  subcategory: article.subcategory.slug,
                }}
              >
                {article.subcategory.name}
              </Link>
            </div>
            <h1 className="article-title">{article.title}</h1>
            {article.excerpt ? (
              <p className="article-deck">{article.excerpt}</p>
            ) : null}
            <div className="article-byline">
              <img
                className="article-byline-avatar"
                src="/img/profile.png"
                alt={article.authorName}
                width={40}
                height={40}
              />
              <div>
                <div className="article-byline-name">{article.authorName}</div>
                <div className="article-byline-meta">
                  {article.publishedAt ? (
                    <time
                      dateTime={new Date(article.publishedAt).toISOString()}
                    >
                      {formatDate(article.publishedAt)}
                    </time>
                  ) : null}
                  {article.readTimeMinutes ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      <span>{article.readTimeMinutes} min read</span>
                    </>
                  ) : null}
                  {article.viewCount > 0 ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      <span>
                        {article.viewCount.toLocaleString("en-US")} view
                        {article.viewCount === 1 ? "" : "s"}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            {article.coverImage ? (
              <figure className="article-cover">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  loading="eager"
                />
              </figure>
            ) : null}
          </header>

          <MarkdownView source={article.content} />
        </article>

        <AuthorFooter />
      </main>
    </>
  );
}
