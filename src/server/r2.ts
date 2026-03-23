import { getEnv } from "./env";

const TEXT_MD = "text/markdown; charset=utf-8";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export function articleKey(id: number) {
  return `articles/${id}.md`;
}

function safeFileName(name: string): string {
  const base = name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
  return base || "article-image";
}

export function r2PublicUrl(key: string): string {
  return `/r2/${key}`;
}

export async function putArticleMarkdown(id: number, body: string) {
  const key = articleKey(id);
  await getEnv().ARTICLES_BUCKET.put(key, body, {
    httpMetadata: { contentType: TEXT_MD },
  });
  return key;
}

export async function getArticleMarkdown(key: string): Promise<string | null> {
  const obj = await getEnv().ARTICLES_BUCKET.get(key);
  if (!obj) return null;
  return await obj.text();
}

export async function deleteArticleMarkdown(key: string): Promise<void> {
  await getEnv().ARTICLES_BUCKET.delete(key);
}

export async function putArticleImage(file: File) {
  const contentType = file.type.toLowerCase();
  const extension = IMAGE_EXTENSIONS[contentType];

  if (!extension) {
    throw new Error("Upload a PNG, JPG, WebP, AVIF, GIF, or SVG image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const now = new Date();
  const folder = `${now.getUTCFullYear()}/${String(
    now.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
  const key = `images/${folder}/${crypto.randomUUID()}-${safeFileName(
    file.name,
  )}.${extension}`;

  await getEnv().ARTICLES_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  return { key, url: r2PublicUrl(key) };
}
