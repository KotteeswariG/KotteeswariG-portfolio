# Kotteeswari Ganesh Portfolio

This is my personal portfolio website. It also has a small articles section where i write about things i learn and work on.

## What is this site?

A simple website to show my profile, my resume, and my articles. The articles can be added or edited from a private admin page (only i can login).

## Things i used

- Vite with React for the frontend
- TanStack Start for routing and server side rendering
- Cloudflare Workers for hosting (very fast and free for small sites)
- Cloudflare D1 (SQLite) for storing article details
- Cloudflare R2 for storing the actual markdown content
- Drizzle ORM for database queries
- A simple markdown editor for writing articles
- Dark mode and light mode both are supported

## Folder structure (quick view)

```
src/
  routes/        all the pages
  components/    small reusable parts like sidebar, theme toggle etc
  server/        database, auth, cloudflare related stuff
  server-fns/    backend functions called from frontend
  hooks/         react hooks
  styles.css     all main styles
  worker.ts      entry point for cloudflare worker
public/          static files like images, fonts, resume pdf
migrations/      database migration files
```

## How to run on local machine

You need Node.js 22 or above and pnpm installed.

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000 in your browser. That should show the site.

## How to deploy

I am deploying it to Cloudflare Workers. Once everything is setup (D1 database, R2 bucket, secrets), running below command will push it live.

```bash
pnpm deploy
```

There is also a github actions workflow that automatically deploys whenever i push to main branch.

## Setting up cloudflare bits

First time only, you need to do these steps.

1. Login to wrangler
   ```bash
   pnpm wrangler login
   ```

2. Create the D1 database
   ```bash
   pnpm wrangler d1 create kotteeswari_articles
   ```
   Take the database id from output and put it in `wrangler.jsonc`.

3. Create the R2 bucket
   ```bash
   pnpm wrangler r2 bucket create kotteeswari-articles
   ```

4. Run the migrations
   ```bash
   pnpm db:migrate:local
   pnpm db:migrate:prod
   ```

5. Set the admin password hash and session secret
   ```bash
   pnpm hash:password
   pnpm wrangler secret put ADMIN_PASSWORD_HASH
   pnpm wrangler secret put SESSION_SECRET
   ```

## Admin page

Only i use the admin page to add or update my articles. It is at `/admin/login`. Without correct password no one can enter.

## Some things to note

- The site uses SSR so first page load itself shows the content (good for SEO)
- Theme is remembered in localStorage so it does not flicker on reload
- Sitemap and robots.txt are generated at runtime, no need to manage them manually
- Markdown is rendered with code highlighting, headings also get anchor links automatically
- Mobile view is also handled, sidebar becomes a small menu

## Credits

Made by me, Kotteeswari Ganesh. If you want to contact me, my details are on the homepage itself.
