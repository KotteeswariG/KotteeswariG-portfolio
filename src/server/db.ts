import { drizzle } from "drizzle-orm/d1";
import { getEnv } from "./env";
import * as schema from "./schema";

export function getDb() {
  return drizzle(getEnv().DB, { schema, casing: "snake_case" });
}

export type DB = ReturnType<typeof getDb>;
export { schema };
