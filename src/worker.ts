import startEntry from "@tanstack/react-start/server-entry";
import { querySitemapEntries } from "./server-fns/articles";
import { getEnv } from "./server/env";
import type { AppEnv } from "./server/env";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function buildSitemap(siteUrl: string): Promise<string> {
  let entries: Array<{
    url: string;
    lastModified: Date;
    publishedAt: Date | null;
    coverImage: string | null;
  }>;
  try {
    entries = await querySitemapEntries();
  } catch {
    entries = [];
  }
  const staticUrls = [
    { loc: siteUrl, priority: "1.0", changefreq: "monthly" },
    { loc: `${siteUrl}/articles`, priority: "0.9", changefreq: "weekly" },
  ];
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  );
  for (const u of staticUrls) {
    lines.push(
      `  <url><loc>${escapeXml(u.loc)}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
    );
  }
  for (const e of entries) {
    const lastmod = new Date(e.lastModified).toISOString();
    const imageUrl = absoluteUrl(siteUrl, e.coverImage);
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(`${siteUrl}${e.url}`)}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push("    <changefreq>monthly</changefreq>");
    lines.push("    <priority>0.8</priority>");
    if (imageUrl) {
      lines.push("    <image:image>");
      lines.push(`      <image:loc>${escapeXml(imageUrl)}</image:loc>`);
      lines.push("    </image:image>");
    }
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n");
}

function absoluteUrl(siteUrl: string, value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value, siteUrl).toString();
  } catch {
    return null;
  }
}

function buildRobots(siteUrl: string): string {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
}

export default {
  async fetch(
    request: Request,
    env: unknown,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const appEnv = env as AppEnv;

    if (url.pathname.startsWith("/r2/")) {
      const key = decodeURIComponent(url.pathname.slice(4));
      if (!key || key.includes("..")) {
        return new Response("Invalid R2 asset key", { status: 400 });
      }
      const obj = await appEnv.ARTICLES_BUCKET.get(key);
      if (!obj) {
        return new Response("Asset not found", { status: 404 });
      }

      const headers = new Headers();
      obj.writeHttpMetadata(headers);
      headers.set("etag", obj.httpEtag);
      if (!headers.has("cache-control")) {
        headers.set("cache-control", "public, max-age=31536000, immutable");
      }
      return new Response(obj.body, { headers });
    }

    if (url.pathname === "/sitemap.xml") {
      const siteUrl = getEnv().SITE_URL ?? url.origin;
      const xml = await buildSitemap(siteUrl);
      return new Response(xml, {
        headers: {
          "content-type": "application/xml; charset=utf-8",
          "cache-control": "public, max-age=300",
        },
      });
    }

    if (url.pathname === "/robots.txt") {
      const siteUrl = getEnv().SITE_URL ?? url.origin;
      return new Response(buildRobots(siteUrl), {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      });
    }

    return startEntry.fetch(request, env, ctx);
  },
};
// /sitemap.xml handler
// /robots.txt handler
// use SITE_URL env for canonical
// disallow /admin
