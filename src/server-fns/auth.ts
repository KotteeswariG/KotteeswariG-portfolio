import { createServerFn } from "@tanstack/react-start";
import {
  clearSessionCookie,
  getCurrentSession,
  setSessionCookie,
  verifyPassword,
} from "../server/auth";
import { getEnv } from "../server/env";

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: { username: string; password: string }) => input)
  .handler(async ({ data }) => {
    const env = getEnv();
    const expectedUser = (env.ADMIN_USERNAME ?? "admin").trim();
    const hash = env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      throw new Error(
        "ADMIN_PASSWORD_HASH is not set - run `pnpm hash:password` and add it to .dev.vars or wrangler secrets",
      );
    }

    if (data.username.trim() !== expectedUser) {
      await new Promise((r) => setTimeout(r, 250));
      return { ok: false as const, error: "Invalid credentials" };
    }
    const ok = await verifyPassword(data.password, hash);
    if (!ok) {
      return { ok: false as const, error: "Invalid credentials" };
    }
    await setSessionCookie(expectedUser);
    return { ok: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(
  async () => {
    clearSessionCookie();
    return { ok: true as const };
  },
);

export const getAdminSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await getCurrentSession();
    return session ? { username: session.sub } : null;
  },
);
