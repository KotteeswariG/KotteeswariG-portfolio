import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/server/schema.ts",
  out: "./migrations",
  casing: "snake_case",
  verbose: true,
  strict: true,
});
