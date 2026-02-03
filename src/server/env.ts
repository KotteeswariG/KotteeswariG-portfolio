import { env as cfEnv } from "cloudflare:workers";

export type AppEnv = {
  DB: D1Database;
  ARTICLES_BUCKET: R2Bucket;
  SITE_URL: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD_HASH?: string;
  SESSION_SECRET?: string;
};

export function getEnv(): AppEnv {
  return cfEnv as unknown as AppEnv;
}
