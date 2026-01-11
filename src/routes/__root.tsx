import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import appStyles from "../styles.css?url";
import { PERSON, SEO, SITE_URL, personJsonLd } from "../seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, shrink-to-fit=no",
      },
      { title: SEO.title },
      { name: "description", content: SEO.description },
      { name: "keywords", content: SEO.keywords },
      { name: "author", content: PERSON.name },
      { name: "application-name", content: `${PERSON.name} Portfolio` },
      { name: "creator", content: PERSON.name },
      { name: "publisher", content: PERSON.name },
      { name: "referrer", content: "strict-origin-when-cross-origin" },
      {
        name: "robots",
        content:
          "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      {
        name: "googlebot",
        content:
          "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "theme-color", content: "#5f01bc" },
      { name: "color-scheme", content: "light" },

      { property: "og:type", content: "profile" },
      { property: "og:site_name", content: `${PERSON.name} - Portfolio` },
      { property: "og:title", content: SEO.title },
      { property: "og:description", content: SEO.description },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: SEO.ogImage },
      { property: "og:image:alt", content: `Profile photo of ${PERSON.name}` },
      { property: "og:locale", content: SEO.locale },
      { property: "profile:first_name", content: PERSON.givenName },
      { property: "profile:last_name", content: PERSON.familyName },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: SEO.twitter },
      { name: "twitter:creator", content: SEO.twitter },
      { name: "twitter:title", content: SEO.title },
      { name: "twitter:description", content: SEO.description },
      { name: "twitter:image", content: SEO.ogImage },
      { name: "twitter:url", content: SITE_URL },
      {
        name: "twitter:image:alt",
        content: `Profile photo of ${PERSON.name}`,
      },

      { name: "format-detection", content: "telephone=no" },
      { name: "geo.region", content: "AU-QLD" },
      { name: "geo.placename", content: PERSON.city },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },

      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
        crossOrigin: "",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },

      { rel: "stylesheet", href: "/vendor/bootstrap/css/bootstrap.min.css" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: "/vendor/font-awesome/css/font-awesome.min.css",
      },
      { rel: "stylesheet", href: "/vendor/devicons/css/devicons.min.css" },
      {
        rel: "stylesheet",
        href: "/vendor/simple-line-icons/css/simple-line-icons.css",
      },
      { rel: "stylesheet", href: "/css/resume.min.css" },
      { rel: "stylesheet", href: appStyles },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(personJsonLd()),
      },
      {
        children: THEME_BOOT_SCRIPT,
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

const THEME_BOOT_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var t=(s==='dark'||s==='light')?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;document.documentElement.dataset.colorMode=t;}catch(e){document.documentElement.dataset.theme='light';document.documentElement.dataset.colorMode='light';}})();`;

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body id="page-top">
        <a href="#about" className="skip-link">
          Skip to main content
        </a>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundPage() {
  return (
    <main className="articles-page" style={{ textAlign: "center" }}>
      <p
        className="subheading mb-2"
        style={{ fontSize: "0.95rem", letterSpacing: "0.08em" }}
      >
        404 - Not found
      </p>
      <h1 className="mb-3">This page can’t be found</h1>
      <p className="mb-4" style={{ maxWidth: 520, margin: "0 auto" }}>
        The page you’re looking for may have been moved, archived, or never
        existed. Try one of the links below.
      </p>
      <div
        className="d-flex justify-content-center"
        style={{ gap: "0.75rem", flexWrap: "wrap" }}
      >
        <Link to="/" className="btn btn-primary">
          Home
        </Link>
        <Link to="/articles" className="btn btn-outline-secondary">
          Browse articles
        </Link>
      </div>
    </main>
  );
}
