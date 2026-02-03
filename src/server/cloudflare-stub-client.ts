// Client-side stub for the `cloudflare:workers` virtual module.
// Server-side code that reaches this branch should already be tree-shaken
// out of the client bundle; this stub just keeps imports resolvable so the
// client never has to evaluate worker-only logic.
const errorOnAccess = (): never => {
  throw new Error("cloudflare:workers is server-only");
};
export const env = new Proxy(
  {},
  { get: errorOnAccess, has: () => false },
) as Record<string, unknown>;
