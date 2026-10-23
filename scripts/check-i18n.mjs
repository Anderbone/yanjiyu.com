import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse } from "node-html-parser";

const contentRoot = "src/content";
const messages = JSON.parse(fs.readFileSync("src/i18n/zh.json", "utf8"));
let contentPairs = 0;
for (const collection of ["dev", "journal", "pages", "about", "contact"]) {
  const files = fs.readdirSync(path.join(contentRoot, collection));
  for (const file of files.filter((name) => /\.mdx?$/.test(name))) {
    const source = matter.read(path.join(contentRoot, collection, file));
    if (source.data.draft) continue;
    const translatedPath = path.join(contentRoot, "zh", collection, file);
    assert.ok(
      fs.existsSync(translatedPath),
      `Missing Chinese content: ${translatedPath}`,
    );
    const translated = matter.read(translatedPath);
    for (const key of ["date", "categories", "tags", "draft", "pinned"]) {
      assert.deepEqual(
        translated.data[key],
        source.data[key],
        `${translatedPath}: ${key} must match`,
      );
    }
    assert.match(
      translated.data.title,
      /\p{Script=Han}/u,
      `${translatedPath}: translate the title`,
    );
    assert.match(
      translated.data.description,
      /\p{Script=Han}/u,
      `${translatedPath}: translate the description`,
    );
    if (source.content.trim()) {
      assert.match(
        translated.content,
        /\p{Script=Han}/u,
        `${translatedPath}: translate the body`,
      );
    }
    contentPairs++;
  }
}
// Catch missing literal UI translations before they silently fall back to English.
for (const file of fs
  .readdirSync("src", { recursive: true })
  .filter((name) => name.endsWith(".astro"))) {
  const source = fs.readFileSync(path.join("src", file), "utf8");
  for (const match of source.matchAll(
    /\bt\(\s*("(?:\\.|[^"\\])*")\s*,?\s*\)/g,
  )) {
    const key = JSON.parse(match[1]);
    assert.ok(
      Object.hasOwn(messages, key),
      `${file}: missing UI translation for ${key}`,
    );
  }
}
assert.ok(fs.existsSync("dist/zh/index.html"), "Run pnpm run build first");
assert.equal(
  parse(fs.readFileSync("dist/zh/404.html", "utf8"))
    .querySelector("html")
    .getAttribute("lang"),
  "zh-CN",
  "Localized static-host 404 fallback must exist",
);
let routePairs = 0;
for (const file of fs
  .readdirSync("dist", { recursive: true })
  .filter((name) => name.endsWith(".html") && !name.startsWith("zh/"))) {
  const route =
    file === "index.html" ? "/" : `/${file.replace(/(?:\/index)?\.html$/, "")}`;
  const chineseRoute = route === "/" ? "/zh" : `/zh${route}`;
  const chineseFile = [
    path.join("dist", chineseRoute, "index.html"),
    path.join("dist", `${chineseRoute}.html`),
  ].find((candidate) => fs.existsSync(candidate));
  assert.ok(chineseFile, `Missing Chinese route for ${file}`);
  for (const [filename, lang, counterpart] of [
    [path.join("dist", file), "en", chineseRoute],
    [chineseFile, "zh-CN", route],
  ]) {
    const html = parse(fs.readFileSync(filename, "utf8"));
    assert.equal(
      html.querySelector("html").getAttribute("lang"),
      lang,
      `${filename}: document language`,
    );
    assert.equal(
      html.querySelector("[data-language-switch]")?.getAttribute("href"),
      counterpart,
      `${filename}: language switch must preserve the page`,
    );
    for (const hreflang of ["en", "zh-CN", "x-default"]) {
      assert.ok(
        html.querySelector(`link[hreflang="${hreflang}"]`),
        `${filename}: missing alternate ${hreflang}`,
      );
    }
    if (route === "/projects") {
      assert.ok(
        html.querySelector("figure.terminal-demo video"),
        `${filename}: terminal demo wrapper is required`,
      );
      assert.ok(
        html.querySelector("figure.workspace-map"),
        `${filename}: workflow figure wrapper is required`,
      );
    }
    for (const element of html.querySelectorAll("[src], link[href]")) {
      const href = element.getAttribute("src") || element.getAttribute("href");
      if (!href?.startsWith("/") || href.startsWith("//")) continue;
      const target = decodeURIComponent(
        new URL(href, "https://yanjiyu.com").pathname,
      );
      assert.ok(
        fs.existsSync(path.join("dist", target)),
        `${filename}: missing resource ${href}`,
      );
    }
    for (const anchor of html.querySelectorAll("a[href]")) {
      const href = anchor.getAttribute("href");
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const pathname = decodeURIComponent(
        new URL(href, "https://yanjiyu.com").pathname,
      );
      const target = path.join("dist", pathname);
      assert.ok(
        [target, `${target}.html`, path.join(target, "index.html")].some((p) =>
          fs.existsSync(p),
        ),
        `${filename}: broken internal link ${href}`,
      );
      if (
        !anchor.hasAttribute("data-language-switch") &&
        !/\.[a-z0-9]+$/i.test(pathname)
      ) {
        assert.equal(
          /^\/zh(?:\/|$)/.test(pathname),
          lang === "zh-CN",
          `${filename}: link leaves current language: ${href}`,
        );
      }
    }
  }
  routePairs++;
}
console.log(
  `Verified ${contentPairs} content pairs and ${routePairs} route pairs: languages, switches, SEO alternates, and internal links.`,
);
