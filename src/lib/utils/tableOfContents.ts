type Heading = {
  depth: number;
  slug: string;
  text: string;
};

type TocOptions = {
  explicitToc?: boolean;
  minAutoWords?: number;
  minHeadings?: number;
};

export type TocItem = Heading & {
  level: number;
};

const DEFAULT_MIN_AUTO_WORDS = 1000;
const DEFAULT_MIN_HEADINGS = 3;
const INCLUDED_DEPTHS = new Set([2, 3, 4]);

export const getWordCount = (content = "") => {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/[#>*_\-[\]()+.!|:]/g, " ");

  return plainText.trim().split(/\s+/).filter(Boolean).length;
};

export const getTocItems = (headings: Heading[] = []): TocItem[] =>
  headings
    .filter((heading) => INCLUDED_DEPTHS.has(heading.depth))
    .filter((heading) => heading.slug && heading.text)
    .map((heading) => ({
      ...heading,
      level: heading.depth - 2,
    }));

export const shouldShowToc = (
  items: TocItem[],
  content: string,
  {
    explicitToc,
    minAutoWords = DEFAULT_MIN_AUTO_WORDS,
    minHeadings = DEFAULT_MIN_HEADINGS,
  }: TocOptions = {},
) => {
  if (!items.length) {
    return false;
  }

  if (explicitToc === true) {
    return true;
  }

  if (explicitToc === false) {
    return false;
  }

  return items.length >= minHeadings && getWordCount(content) >= minAutoWords;
};
