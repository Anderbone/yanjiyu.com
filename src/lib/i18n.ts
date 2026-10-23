import zh from "@/i18n/zh.json";
const messages = zh as Record<string, string>;
const caseInsensitiveMessages = Object.fromEntries(
  Object.entries(messages).map(([key, value]) => [key.toLowerCase(), value]),
);
export type Locale = "en" | "zh";
export const localeFrom = (url: URL): Locale =>
  /^\/zh(?:\/|$)/.test(url.pathname) ? "zh" : "en";
export const stripLocale = (path: string) =>
  path.replace(/^\/zh(?=\/|$)/, "") || "/";
export function localePath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const clean = stripLocale(path);
  return locale === "zh" ? `/zh${clean === "/" ? "" : clean}` : clean;
}
export function translate(text: string, locale: Locale): string {
  return locale === "zh"
    ? (messages[text] ?? caseInsensitiveMessages[text.toLowerCase()] ?? text)
    : text;
}
export const translator = (url: URL) => (text: string) =>
  translate(text, localeFrom(url));
