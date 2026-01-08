import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

const cloudflareStubPath = path.resolve(
  process.cwd(),
  "src/server/cloudflare-stub-client.ts",
);

function clientCloudflareStub(): Plugin {
  return {
    name: "client-cloudflare-stub",
    enforce: "pre",
    resolveId(source) {
      if (source !== "cloudflare:workers") return null;
      const envName = (this as unknown as { environment?: { name: string } })
        .environment?.name;
      if (envName === "client") return cloudflareStubPath;
      return null;
    },
  };
}

/**
 * `@cloudflare/vite-plugin`'s worker module registry can desync when Vite HMR
 * partially-updates server-side code - the symptoms are
 *   "(0 , __vite_ssr_import_0__.createStartHandler) is not a function"
 * and a related "Unexpected end of JSON input" from miniflare's dispatchFetch.
 * The worker entry imports stay cached but the imported symbol is undefined
 * in the new module.
 *
 * Fix: detect updates to files that participate in the worker bundle and ask
 * the dev server for a full-reload instead. Full reload re-evaluates the
 * worker from scratch so the registry stays consistent. Editor refresh is
 * imperceptibly slower but the runtime never enters the broken state.
 */
function fullReloadServerModules(): Plugin {
  // Any app source file can participate in the SSR worker graph through route
  // trees, shared components, and CSS imports. If Vite applies partial HMR to
  // one of those modules, Cloudflare's worker module registry can keep stale
  // references around and surface `(0, createStartHandler) is not a function`.
  // A full reload is slightly heavier, but it keeps the worker graph coherent.
  const SERVER_FILE_RE = /\/src\/.+/;
  return {
    name: "full-reload-on-server-module-change",
    handleHotUpdate({ file, server }) {
      if (SERVER_FILE_RE.test(file)) {
        server.hot.send({ type: "full-reload" });
        return [];
      }
      return undefined;
    },
  };
}

export default defineConfig({
  server: {
    port: 5175,
    strictPort: true,
  },
  preview: {
    port: 5175,
    strictPort: true,
  },
  plugins: [
    clientCloudflareStub(),
    fullReloadServerModules(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      tsr: {
        srcDirectory: "src",
      },
    }),
    react(),
  ],
});
