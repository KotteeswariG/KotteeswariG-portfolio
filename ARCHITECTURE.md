# Architecture & Flow

This document describes how the portfolio + blog runs end-to-end: the
hosting platform, the request pipeline, the data model, the auth flow,
the article lifecycle, and the build/deploy path.

---

## 1. What this project is

A single Cloudflare Worker that serves two things from one origin
(`https://gkoti.me`):

1. **Public portfolio** — a server-rendered React page at `/` with
   about, experience, projects, skills, education, interests.
2. **Blog (`/articles/...`)** — a server-rendered articles section
   backed by a small CMS at `/admin/...` (password-protected). Article
   metadata lives in **Cloudflare D1** (SQLite), article markdown
   bodies and uploaded images live in **Cloudflare R2**.

There is no separate backend service. Everything runs inside the same
Worker.

---

## 2. Tech stack

| Layer            | Tech                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------- |
| Runtime          | Cloudflare Workers (`main: src/worker.ts`, `compatibility_flags: ["nodejs_compat"]`)   |
| Framework        | TanStack Start (SSR) + TanStack Router (file-based routing)                            |
| UI               | React 19, Bootstrap 4 CSS, custom CSS (`src/styles.css`)                               |
| Bundler          | Vite 7 with `@cloudflare/vite-plugin` (dev runs Worker code inside Miniflare via Vite) |
| Database         | Cloudflare D1 (SQLite) — binding `DB`                                                  |
| Object storage   | Cloudflare R2 — binding `ARTICLES_BUCKET` (bucket `kotteeswari-articles`)              |
| ORM              | Drizzle ORM (`drizzle-orm/d1`) with `casing: "snake_case"`                             |
| Migrations       | `drizzle-kit` → `migrations/*.sql`, applied via `wrangler d1 migrations apply`         |
| Auth             | PBKDF2-SHA256 password hash + HMAC-signed session cookie (`kg_admin_session`)          |
| Markdown editor  | `@uiw/react-md-editor` in admin                                                        |
| Markdown render  | `react-markdown` + `remark-gfm` + `rehype-slug`/`autolink-headings`/`highlight`        |
| Deploy           | `wrangler deploy` (manual) + GitHub Actions on push to `main`                          |

---

## 3. Hosting topology

```
              (DNS: gkoti.me / www.gkoti.me)
                          |
                          v
              +-----------------------------+
              |   Cloudflare edge (Worker)  |
              |   name: kotteeswari-portfolio
              |   main: src/worker.ts        |
              +--+---------+--------------+--+
                 |         |              |
        DB binding   ARTICLES_BUCKET   serves static
         (D1)            (R2)         /public/* assets
            |              |          (bundled into Worker)
            v              v
      kotteeswari_     kotteeswari-
      articles (D1)    articles (R2)
```

`wrangler.jsonc` declares both bindings and the custom-domain routes
(`gkoti.me`, `www.gkoti.me`). `workers_dev: true` keeps the
`*.workers.dev` preview URL enabled for staging-style checks.

---

## 4. Request pipeline (`src/worker.ts`)

Every request hits the Worker's `fetch` handler, which short-circuits a
few well-known paths before delegating to TanStack Start:

```
fetch(request) ─┬─ path starts with /r2/   → stream R2 object back
                ├─ path == /sitemap.xml    → build XML from D1, return
                ├─ path == /robots.txt     → return text/plain
                └─ otherwise               → startEntry.fetch(request, env, ctx)
                                              (TanStack Start SSR + RPC)
```

Details:

- **`/r2/<key>`** — proxies an R2 object (article markdown, uploaded
  images). Strips `..` traversal, copies HTTP metadata + `etag` from
  R2, and sets `Cache-Control: public, max-age=31536000, immutable`
  when the object didn't carry its own. This is what
  `r2PublicUrl(key)` returns from `src/server/r2.ts`.
- **`/sitemap.xml`** — calls `querySitemapEntries()` (D1 query) and
  emits an XML sitemap with two static URLs plus one entry per
  published article. Cached for 5 minutes (`max-age=300`).
- **`/robots.txt`** — generated at runtime, disallows `/admin`,
  references the sitemap.
- **Everything else** — handed to TanStack Start's server entry, which
  matches a file-based route, runs its loaders (which may call server
  functions, which may touch D1/R2), SSRs the React tree, streams HTML
  back, and then hydrates on the client.

---

## 5. Route map (file-based, `src/routes/`)

### Public

| Path                                                  | File                                                | Purpose                                                       |
| ----------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| `/`                                                   | `routes/index.tsx`                                  | Portfolio landing page (about, experience, projects, skills…) |
| `/articles`                                           | `routes/articles/index.tsx`                         | Blog index — lists published articles + topic filters         |
| `/articles/$category`                                 | `routes/articles/$category/index.tsx`               | Articles filtered by category                                 |
| `/articles/$category/$subcategory`                    | `routes/articles/$category/$subcategory/index.tsx`  | Articles filtered by sub-category                             |
| `/articles/$category/$subcategory/$slug`              | `routes/articles/$category/$subcategory/$slug.tsx`  | Single article page (renders markdown from R2)                |

### Admin (gated by `/admin/login`)

| Path                                | File                                          | Purpose                                       |
| ----------------------------------- | --------------------------------------------- | --------------------------------------------- |
| `/admin/login`                      | `routes/admin/login.tsx`                      | Login form                                    |
| `/admin`                            | `routes/admin/index.tsx`                      | Admin dashboard — list/filter/edit articles   |
| `/admin/articles/new`               | `routes/admin/articles.new.tsx`               | Create new article (markdown editor)          |
| `/admin/articles/$id/edit`          | `routes/admin/articles.$id.edit.tsx`          | Edit an existing article                      |
| `/admin/categories`                 | `routes/admin/categories.tsx`                 | Manage categories/sub-categories              |

Gating happens in `routes/admin.tsx`:

```ts
beforeLoad: async ({ location }) => {
  if (location.pathname === "/admin/login") return;
  const session = await getAdminSession();   // server fn -> reads cookie
  if (!session) throw redirect({ to: "/admin/login" });
  return { session };
}
```

The route also emits `<meta name="robots" content="noindex, nofollow">`
so search engines skip the admin tree.

The router itself is configured in `src/router.tsx` with
`defaultPreload: "intent"` and `scrollRestoration: true`. Routes are
auto-generated into `src/routeTree.gen.ts` by the TanStack router
plugin.

---

## 6. Data model (D1 schema, `src/server/schema.ts`)

```
+----------------+         +-------------------+         +-------------------+
| categories     | 1 ---- n| subcategories     | 1 ---- n| articles          |
+----------------+         +-------------------+         +-------------------+
| id PK          |         | id PK             |         | id PK             |
| slug UNIQUE    |         | category_id FK    |         | slug UNIQUE       |
| name           |         | slug              |         | title             |
| description    |         | name              |         | excerpt           |
| sort_order     |         | description       |         | content_key       | ----> R2: "articles/<id>.md"
| created_at     |         | sort_order        |         | cover_image       |
| updated_at     |         | created_at        |         | category_id FK    |
+----------------+         | updated_at        |         | subcategory_id FK |
                           +-------------------+         | status            | (draft|published|archived)
                                                         | author_name       |
                                                         | seo_title         |
                                                         | seo_description   |
                                                         | read_time_minutes |
                                                         | view_count        |
                                                         | published_at      |
                                                         | created_at        |
                                                         | updated_at        |
                                                         | deleted_at        | (soft delete)
                                                         +-------------------+
```

Notable indexes on `articles`: `slug` UNIQUE, plus `status`,
`category_id`, `subcategory_id`, `published_at`. Soft delete via
`deleted_at IS NULL` — admin "trash" view flips that filter
(`isNotNull`).

Migrations live in `migrations/` and are applied with:

```bash
pnpm db:migrate:local   # local D1 (Miniflare)
pnpm db:migrate:prod    # production D1
```

---

## 7. R2 layout (`src/server/r2.ts`)

```
ARTICLES_BUCKET/
├── articles/
│   └── <article-id>.md              # markdown body for each article
└── images/
    └── YYYY/MM/
        └── <uuid>-<slugified-name>.<ext>   # uploaded cover/inline images
```

- Markdown is written with content-type `text/markdown; charset=utf-8`.
- Image uploads are limited to **5 MB** and these MIME types:
  `image/png`, `image/jpeg`, `image/webp`, `image/avif`, `image/gif`,
  `image/svg+xml`. Each upload gets a UUID prefix to avoid collisions
  and is stored with `Cache-Control: public, max-age=31536000,
  immutable`.
- The public URL for any R2 object is `/r2/<key>` — served via the
  Worker's `fetch` handler (section 4), not directly from R2.

---

## 8. Server functions layer (`src/server-fns/`)

TanStack Start "server functions" are RPC-style — typed functions
defined with `createServerFn(...)` that the client can call and that
execute server-side (in the Worker). The framework transports them
over HTTP automatically.

| File                  | Functions                                                                                                         | Auth     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | -------- |
| `auth.ts`             | `loginAdmin`, `logoutAdmin`, `getAdminSession`                                                                    | mixed    |
| `articles.ts`         | `listPublishedArticles`, `listArticlesByCategory`, `getPublishedArticle`, `listSitemapEntries`                    | public   |
| `categories.ts`       | `listCategoriesWithSubs`, `getCategoryBySlug`, `getSubcategoryBySlug`                                             | public   |
| `admin-articles.ts`   | `listAdminArticles`, `getAdminArticle`, `uploadArticleImage`, `createArticle`, `updateArticle`, `setArticleStatus`, `softDeleteArticle`, `restoreArticle`, `listArticlesInCategory`, `purgeArticle` | admin    |
| `admin-categories.ts` | category/sub-category CRUD                                                                                        | admin    |

Every admin function calls `await requireAdmin()` first, which reads
the session cookie and throws `Response("Unauthorized", { status: 401
})` if missing/invalid.

Public functions don't require auth, but `getPublishedArticle` does a
**best-effort view-count increment** that skips bots (UA regex match)
to avoid skew from crawlers.

---

## 9. Auth flow (`src/server/auth.ts` + `src/server-fns/auth.ts`)

### Setup (one-time)

```bash
pnpm hash:password                       # prompts for password, prints pbkdf2$... hash
pnpm wrangler secret put ADMIN_PASSWORD_HASH
pnpm wrangler secret put SESSION_SECRET  # random string used to sign session JWTs
```

`ADMIN_USERNAME` lives in `wrangler.jsonc` `vars`; the two secrets
above are encrypted Wrangler secrets.

### Hash format

`pbkdf2$<iterations>$<salt-hex>$<derived-key-hex>` — PBKDF2-SHA256
with 100k iterations, 16-byte salt, 32-byte output. All using
WebCrypto so it runs natively in the Worker.

### Login

```
Browser  ──POST {username, password}──>  loginAdmin (server fn)
                                              │
                                              ├─ ADMIN_USERNAME match?  no → 250 ms delay, "Invalid credentials"
                                              ├─ verifyPassword(...)    no → "Invalid credentials"
                                              └─ setSessionCookie(username)
Browser  <─Set-Cookie: kg_admin_session=<body>.<hmac>─
                                  HttpOnly, Secure (in prod), SameSite=Lax, 7-day Max-Age
```

The session token is a tiny custom JWT-like value: a base64url JSON
body `{ sub, exp }` and an HMAC-SHA256 signature, joined with a dot.
`SESSION_SECRET` is the HMAC key.

### Verification on every admin request

```
beforeLoad / requireAdmin() ─► getCookie(kg_admin_session)
                                       │
                              verifySessionToken(token):
                                  HMAC verify → JSON parse → exp check
                                       │
                                  valid → continue
                                  invalid/expired → redirect /admin/login (or 401)
```

Logout calls `clearSessionCookie()` which sets `Max-Age=0`.

---

## 10. Article lifecycle (write path)

```
Admin (logged in)
   │
   │  /admin/articles/new
   │
   ▼
MarkdownEditor (client)
   │  user types title, slug, body, picks category/subcategory, uploads images
   │
   │  image picker → uploadArticleImage(FormData)
   │                       │
   │                       ▼
   │             requireAdmin → putArticleImage(file) → R2.put(images/YYYY/MM/<uuid>-name.ext)
   │             returns { key, url: "/r2/images/..." }
   │
   │  user clicks Save
   ▼
createArticle({ title, slug, content, categoryId, subcategoryId, ... })
        │
        ├─ requireAdmin()
        ├─ slugify(slug || title)
        ├─ D1 INSERT into articles (... content_key="pending" ...)  ← gets id back
        ├─ R2.put("articles/<id>.md", markdownBody, contentType=text/markdown)
        └─ D1 UPDATE articles SET content_key="articles/<id>.md" WHERE id=<id>
        │
        ▼
   returns { id, slug }   → client redirects to /admin or edit page
```

`updateArticle`, `setArticleStatus`, `softDeleteArticle`,
`restoreArticle`, and `purgeArticle` follow the same shape:
auth-check → D1 mutation (and R2 mutation for content/purge). `read
time` is recomputed on each save (`words / 200`, min 1 minute).

---

## 11. Article lifecycle (read path)

```
GET /articles/<cat>/<sub>/<slug>
   │
   ▼
TanStack Start route handler (file `articles/$category/$subcategory/$slug.tsx`)
   │
   ├─ loader: getPublishedArticle({ categorySlug, subcategorySlug, slug })
   │     │
   │     ├─ D1: SELECT article + category + subcategory
   │     │     WHERE article.slug = ? AND status='published' AND deleted_at IS NULL
   │     ├─ R2: getArticleMarkdown(contentKey)  → text body
   │     ├─ if !isBotRequest(): D1 UPDATE view_count = view_count + 1 (best-effort)
   │     └─ returns { ...article, content, viewCount }
   │
   ├─ head(): emits per-article <title>, OG/Twitter meta, JSON-LD (from src/seo.ts → articleJsonLd)
   │
   └─ component: <ArticlePage>
          ├─ <Breadcrumbs/>
          ├─ <MarkdownView content={...}/>   (react-markdown + remark-gfm + rehype-slug
          │                                   + rehype-autolink-headings + rehype-highlight)
          ├─ <AuthorFooter/>
          └─ <ReadingProgress/>
```

The HTML is fully rendered server-side and streamed to the browser
(good for SEO and first paint); React then hydrates on the client.

Images inside the markdown reference `/r2/...` URLs and are served by
the same Worker out of R2.

---

## 12. SEO & discoverability

| What                | Where                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- |
| Site-wide meta tags | `src/routes/__root.tsx` — title, description, keywords, OG, Twitter, geo, robots       |
| Person JSON-LD      | `src/seo.ts` → `personJsonLd()`, injected in root `<head>`                             |
| Per-article meta    | Each article route's `head()` (uses `articleJsonLd(...)` for Article + Breadcrumb LD)  |
| Sitemap             | Generated on the fly at `/sitemap.xml` (cached 5 min) — see `src/worker.ts`            |
| Robots              | Generated at `/robots.txt` — disallows `/admin`, points to sitemap                     |
| Canonical URLs      | `<link rel="canonical">` on each route                                                 |

`src/seo.ts` is the single source of truth for `PERSON`, `SEO`, and
schema.org structures.

---

## 13. Theming

- `useTheme` hook + `<ThemeToggle/>` flip between `light` and `dark`,
  storing the choice in `localStorage`.
- A small inline boot script in `__root.tsx` reads `localStorage` (or
  `prefers-color-scheme`) **before** React hydrates, sets
  `data-theme`/`data-color-mode` on `<html>`, so there is no
  light→dark flash on first paint.

---

## 14. Build & deploy

### Local dev

```bash
pnpm install
pnpm dev          # vite dev — Miniflare runs the Worker, vite serves the client
```

`vite.config.ts` uses `@cloudflare/vite-plugin` so the SSR/Worker
environment matches production. A small `clientCloudflareStub` plugin
swaps `cloudflare:workers` to a no-op stub when bundling the client.
`fullReloadServerModules` plugin forces full reloads for any `src/**`
edit, to avoid an HMR/registry bug in the Cloudflare Vite plugin.

### Production build

```
pnpm build     ─►  vite build (client + SSR + Worker bundle)
pnpm deploy    ─►  vite build && wrangler deploy
```

`wrangler deploy` reads `wrangler.jsonc` and uploads the Worker plus
bindings.

### CI (`.github/workflows/deploy.yml`)

```
push to main
   │
   ▼
runs-on: ubuntu-latest
   ├─ checkout
   ├─ setup pnpm 10.32.1 + node 22 (cached)
   ├─ pnpm install --frozen-lockfile
   ├─ pnpm run build
   └─ cloudflare/wrangler-action@v3   (uses CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID secrets)
         command: deploy
```

Concurrency group `deploy-${{ github.ref }}` prevents overlapping
deploys on the same branch.

---

## 15. End-to-end request flow (worked example)

A reader opens `https://gkoti.me/articles/python/flask/my-first-flask-app`:

```
1. DNS resolves gkoti.me to Cloudflare's edge.
2. Cloudflare routes to the Worker (matched by `routes` in wrangler.jsonc).
3. worker.ts fetch():
      path doesn't start with /r2/, isn't /sitemap.xml or /robots.txt
      → delegates to startEntry.fetch(...)
4. TanStack Start matches: /articles/$category/$subcategory/$slug
5. Route loader runs:
      getPublishedArticle({ categorySlug: "python",
                            subcategorySlug: "flask",
                            slug: "my-first-flask-app" })
        ├─ D1 query joins articles + categories + subcategories
        ├─ R2 GET articles/<id>.md → markdown text
        └─ D1 UPDATE view_count += 1 (skipped for bots)
6. head() builds <title>, OG tags, JSON-LD (Article + Breadcrumb).
7. React renders <ArticlePage> on the server with the loader data.
8. Worker streams HTML response.
9. Browser displays the page immediately, then loads the client JS
   bundle and hydrates.
10. Any <img src="/r2/images/...">  in the body → another GET hits the
    Worker, which streams the object out of R2 with long-cache headers.
```

---

## 16. Folder structure (annotated)

```
src/
  worker.ts                  Cloudflare Worker entry; handles /r2/*, sitemap, robots; delegates to TanStack Start
  router.tsx                 createRouter() setup (file-based routes, preload-on-intent)
  routeTree.gen.ts           generated by TanStack router plugin — do not edit
  seo.ts                     PERSON profile, site SEO, JSON-LD builders
  styles.css                 app-wide styles (theme, skills grid, blog layouts)

  routes/
    __root.tsx               <html>/<head> shell, site meta, theme boot script
    index.tsx                Portfolio landing page (about/experience/projects/skills/...)
    articles/                Public blog tree
    admin.tsx                Admin gate (beforeLoad: check session, redirect to login)
    admin/                   Admin pages: dashboard, new/edit article, categories, login

  components/                Reusable UI (SideNav, ThemeToggle, MarkdownView/Editor, AdminLayout, ...)
  hooks/                     useTheme

  server/                    Server-only modules (run inside the Worker)
    env.ts                   Typed wrapper around `cloudflare:workers` env (DB, ARTICLES_BUCKET, secrets)
    db.ts                    Drizzle client (D1)
    schema.ts                Drizzle schema (categories, subcategories, articles)
    r2.ts                    R2 helpers (article markdown + image upload)
    auth.ts                  PBKDF2 hashing, HMAC session token, cookie helpers
    cloudflare-stub-client.ts  No-op stub used in client bundle (see vite.config.ts plugin)

  server-fns/                TanStack Start server functions (RPC from client → Worker)
    auth.ts                  loginAdmin, logoutAdmin, getAdminSession
    articles.ts              public article reads + sitemap query
    categories.ts            public category reads
    admin-articles.ts        admin CRUD for articles (auth-gated)
    admin-categories.ts      admin CRUD for categories (auth-gated)

migrations/                  drizzle-kit-generated SQL (applied with `wrangler d1 migrations apply`)
scripts/
  hash-password.mjs          CLI: prompts for password, prints pbkdf2$ hash for ADMIN_PASSWORD_HASH

public/                      Static assets bundled into the Worker (profile image, fonts, resume PDF, vendor CSS)
wrangler.jsonc               Worker config: bindings, routes, vars
vite.config.ts               Vite + Cloudflare + TanStack Start plugins
drizzle.config.ts            drizzle-kit config (points at src/server/schema.ts)
.github/workflows/deploy.yml CI: build + wrangler deploy on push to main
```

---

## 17. Quick reference — where things live

| Need to…                              | Look at                                                         |
| ------------------------------------- | --------------------------------------------------------------- |
| Add a public route                    | new file under `src/routes/`                                    |
| Add an admin route                    | new file under `src/routes/admin/` (auto-gated by `admin.tsx`)  |
| Add a DB column                       | edit `src/server/schema.ts` → `pnpm db:generate` → apply migration |
| Add a server-side function            | new function in `src/server-fns/<area>.ts` with `createServerFn` |
| Change site title / SEO defaults      | `src/seo.ts`                                                    |
| Change portfolio content              | `src/routes/index.tsx`                                          |
| Change article markdown rendering     | `src/components/MarkdownView.tsx`                               |
| Change the markdown editor experience | `src/components/MarkdownEditor.tsx`                             |
| Tweak hosting / bindings              | `wrangler.jsonc`                                                |
| Change the deploy pipeline            | `.github/workflows/deploy.yml`                                  |
