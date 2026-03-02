#!/usr/bin/env node
import { webcrypto as crypto } from "node:crypto";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

const ITERATIONS = 100_000;
const enc = new TextEncoder();

function toHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return `pbkdf2$${ITERATIONS}$${toHex(salt)}$${toHex(bits)}`;
}

const argPassword = process.argv[2];
let password = argPassword;
if (!password) {
  const rl = createInterface({ input: stdin, output: stdout });
  password = (await rl.question("Admin password: ")).trim();
  rl.close();
}
if (!password) {
  console.error("Password required");
  process.exit(1);
}

const out = await hash(password);
console.log("\nADMIN_PASSWORD_HASH:");
console.log(out);
console.log(
  '\nStore via:  wrangler secret put ADMIN_PASSWORD_HASH  (paste the hash)\nAlso set:   wrangler secret put SESSION_SECRET   (any long random string)',
);
