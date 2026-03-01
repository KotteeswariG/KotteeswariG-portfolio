import { getEnv } from "./env";

const SESSION_COOKIE = "kg_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const PBKDF2_ITERATIONS = 100_000;

const enc = new TextEncoder();
const dec = new TextDecoder();

function bytesToHex(bytes: Uint8Array | ArrayBuffer): string {
  const view =
    bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes as ArrayBuffer);
  let hex = "";
  for (let i = 0; i < view.length; i++) {
    hex += view[i].toString(16).padStart(2, "0");
  }
  return hex;
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function b64urlEncode(bytes: Uint8Array | string): string {
  const view =
    typeof bytes === "string" ? enc.encode(bytes) : bytes;
  let s = "";
  for (let i = 0; i < view.length; i++) s += String.fromCharCode(view[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const bin = atob(padded + padding);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function hashPassword(
  password: string,
  saltHex?: string,
  iterations: number = PBKDF2_ITERATIONS,
): Promise<string> {
  const salt =
    saltHex ?? bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: hexToBytes(salt),
      iterations,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return `pbkdf2$${iterations}$${salt}$${bytesToHex(new Uint8Array(bits))}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  const salt = parts[2];
  if (!Number.isFinite(iterations)) return false;
  const computed = await hashPassword(password, salt, iterations);
  return timingSafeEqual(enc.encode(computed), enc.encode(stored));
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

type SessionPayload = {
  sub: string;
  exp: number;
};

export async function createSessionToken(username: string): Promise<string> {
  const env = getEnv();
  if (!env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not configured");
  }
  const payload: SessionPayload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = b64urlEncode(JSON.stringify(payload));
  const key = await importHmacKey(env.SESSION_SECRET);
  const sig = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, enc.encode(body)),
  );
  return `${body}.${b64urlEncode(sig)}`;
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  const env = getEnv();
  if (!env.SESSION_SECRET) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const key = await importHmacKey(env.SESSION_SECRET);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    b64urlDecode(sig),
    enc.encode(body),
  );
  if (!ok) return null;
  try {
    const payload = JSON.parse(dec.decode(b64urlDecode(body))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function buildSessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function buildClearedCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function readSessionCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === SESSION_COOKIE) return rest.join("=");
  }
  return null;
}

export async function getSessionFromRequest(
  request: Request,
): Promise<SessionPayload | null> {
  const token = readSessionCookie(request.headers.get("cookie"));
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function requireAdminFromRequest(
  request: Request,
): Promise<SessionPayload> {
  const session = await getSessionFromRequest(request);
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return session;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

import {
  deleteCookie as tssDeleteCookie,
  getCookie as tssGetCookie,
  getRequestHeader,
  setCookie as tssSetCookie,
} from "@tanstack/react-start/server";

function shouldUseSecureCookie(): boolean {
  const host = getRequestHeader("host") ?? "";
  const proto = getRequestHeader("x-forwarded-proto") ?? "";
  if (
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]")
  ) {
    return false;
  }
  return proto === "https" || !host;
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const token = tssGetCookie(SESSION_COOKIE);
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Response("Unauthorized", {
      status: 401,
      headers: { "x-redirect": "/admin/login" },
    });
  }
  return session;
}

export async function setSessionCookie(username: string): Promise<void> {
  const token = await createSessionToken(username);
  tssSetCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: shouldUseSecureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(): void {
  tssDeleteCookie(SESSION_COOKIE, { path: "/" });
}
