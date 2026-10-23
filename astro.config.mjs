import { readdirSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig, fontProviders } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sharp from "sharp";
import config from "./src/config/config.json";
import theme from "./src/config/theme.json";

// Helper to parse font string format: "FontName:wght@400;500;600;700"
function parseFontString(fontStr) {
  const [name, weightPart] = fontStr.split(":");
  let weights = [400]; // default weight

  if (weightPart) {
    // Extract weights from wght@400;500;600 format
    const weightMatch = weightPart.match(/wght@?([\d;]+)/);
    if (weightMatch) {
      weights = weightMatch[1].split(";").map((w) => parseInt(w, 10));
    }
  }

  // remove + from font name and add space
  const cleanName = name.replace(/\+/g, " ");
  return { name: cleanName, weights };
}

// Build fonts configuration from theme.json
const fontsConfig = Object.entries(theme.fonts.font_family)
  .filter(([key]) => !key.includes("_type")) // Filter out type entries
  .map(([key, fontStr]) => {
    const { name, weights } = parseFontString(fontStr);
    const typeKey = `${key}_type`;
    const fallback = theme.fonts.font_family[typeKey] || "sans-serif";

    return {
      name,
      cssVariable: `--font-${key}`,
      provider: fontProviders.fontshare(),
      weights,
      display: "swap",
      fallbacks: [fallback],
    };
  });

// Render both languages from the same page templates, including future pages.
function chineseRoutes() {
  return {
    name: "chinese-routes",
    hooks: {
      // Static hosts select the nearest 404.html for unknown localized URLs.
      "astro:build:done": ({ dir }) => {
        copyFileSync(
          new URL("zh/404/index.html", dir),
          new URL("zh/404.html", dir),
        );
      },
      "astro:config:setup": ({ injectRoute }) => {
        const pages = new URL("./src/pages/", import.meta.url);
        for (const file of readdirSync(pages, { recursive: true })) {
          if (!file.endsWith(".astro")) continue;
          const route = file
            .replace(/\\/g, "/")
            .replace(/\.astro$/, "")
            .replace(/(^|\/)index$/, "")
            .replace(/\/$/, "");
          injectRoute({
            pattern: `/zh/${route}`.replace(/\/$/, ""),
            entrypoint: fileURLToPath(new URL(file, pages)),
          });
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  image: { service: sharp() },
  vite: { plugins: [tailwindcss()] },
  fonts: fontsConfig,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    chineseRoutes(),
    react(),
    sitemap({ filter: (page) => !new URL(page).pathname.endsWith("/404") }),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: { theme: "one-dark-pro", wrap: true },
  },
});
