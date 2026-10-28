import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const base = process.env.PAGES_BASE_PATH || "/familydaystay/";
if (!/^\/(?:[A-Za-z0-9._-]+\/)*$/.test(base)) {
  throw new Error("PAGES_BASE_PATH must be an absolute directory path ending in /.");
}

export default defineConfig({
  root: path.join(projectRoot, "pages"),
  base,
  publicDir: path.join(projectRoot, "public"),
  resolve: { alias: { "@": projectRoot } },
  build: { outDir: path.join(projectRoot, "dist-pages"), emptyOutDir: true },
  plugins: [
    {
      name: "familyday-pages-assets",
      enforce: "pre",
      transform(code, id) {
        const filename = id.split("?")[0].replaceAll("\\", "/");
        // Catalog image URLs are public URLs, not JavaScript imports. Prefix only
        // their literal asset paths for project Pages; Sites source stays intact.
        if (filename.startsWith(projectRoot.replaceAll("\\", "/") + "app/") && /\.(?:tsx?|json)$/.test(filename)) {
          return code.replace(/(["'])\/assets\//g, `$1${base}assets/`);
        }
      },
      closeBundle() {
        const filename = path.join(projectRoot, "dist-pages/manifest.webmanifest");
        const manifest = JSON.parse(readFileSync(filename, "utf8"));
        manifest.start_url = base;
        manifest.scope = base;
        manifest.icons = manifest.icons.map((icon: { src: string }) => ({ ...icon, src: base + icon.src.replace(/^\//, "") }));
        writeFileSync(filename, JSON.stringify(manifest, null, 2) + "\n");
        writeFileSync(path.join(projectRoot, "dist-pages/.nojekyll"), "");
      },
    },
    react(),
  ],
});
