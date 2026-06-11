import { slug } from "github-slugger";
import { marked } from "marked";

// slugify
export const slugify = (content: string) => {
  return slug(content);
};

// markdownify
export const markdownify = (content: string, div?: boolean) => {
  return div ? marked.parse(content) : marked.parseInline(content);
};

// humanize
const displayNameOverrides: Record<string, string> = {
  ai: "AI",
  api: "API",
  codex: "Codex",
  koreader: "KOReader",
  mcp: "MCP",
  openapi: "OpenAPI",
  postgresql: "PostgreSQL",
  rime: "Rime",
  sdk: "SDK",
  shadcn: "shadcn",
  ssh: "SSH",
  tmux: "tmux",
  typescript: "TypeScript",
  uae: "UAE",
  ui: "UI",
  ux: "UX",
  xorg: "Xorg",
  zod: "Zod",
};

export const humanize = (content: string) => {
  const normalized = content
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/[-\s]+/g, " ");

  return normalized
    .split(" ")
    .map((word, index) => {
      const override = displayNameOverrides[word.toLowerCase()];
      if (override) {
        return override;
      }
      return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    })
    .join(" ");
};

// titleify
export const titleify = (content: string) => {
  const humanized = humanize(content);
  return humanized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// plainify
export const plainify = (content: string) => {
  const parseMarkdown: any = marked.parse(content);
  const filterBrackets = parseMarkdown.replace(/<\/?[^>]+(>|$)/gm, "");
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, "");
  const stripHTML = htmlEntityDecoder(filterSpaces);
  return stripHTML;
};

// strip entities for plainify
const htmlEntityDecoder = (htmlWithEntities: string) => {
  let entityList: { [key: string]: string } = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };
  let htmlWithoutEntities: string = htmlWithEntities.replace(
    /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity: string): string => {
      return entityList[entity];
    },
  );
  return htmlWithoutEntities;
};
