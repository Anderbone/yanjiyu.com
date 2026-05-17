# Agent Notes

## Project Goal

This repo is the new professional personal website for Jiyu Yan. The priority is a polished English-only site useful for job hunting: clear profile, selected projects, and curated writing. Avoid migrating the old site wholesale unless asked.

The original Hugo repo is available at:

```text
/home/jiyu/github/myblog
```

Use it as a source for old posts and content, but curate aggressively.

## Stack

- Astro site using content collections.
- Package manager: `pnpm`.
- Main build command:

```bash
pnpm run build
```

- Dev server can be started with:

```bash
pnpm exec astro dev
```

The existing `pnpm run dev` script runs extra generators/watchers. Use it when needed, but `pnpm exec astro dev` is often simpler for route checks.

## Content Direction

The writing split is intentional:

- `Dev`: technical posts, tooling notes, implementation writeups.
- `Journal`: selected personal essays, translations, and reflective writing.

Keep these sections short and clear in navigation:

```text
Home
About
Dev
Journal
```

For job hunting, prefer technical/professional signal over breadth. Personal writing should be selective and not dominate the homepage.

## Content Collections

Current writing collections:

```text
src/content/dev
src/content/journal
```

Each section has independent taxonomy pages:

```text
/dev/tags
/dev/categories
/journal/tags
/journal/categories
```

Do not link Dev posts to global `/tags` or `/categories`; keep taxonomy scoped to the current section.

## Migration Notes

Old site examples already migrated:

```text
/dev/tip-type-pinyin
/dev/tool-koreader-pocket
/journal/share-made-in-shenzhen
/journal/opinion-personality
```

When migrating from Hugo:

- Convert TOML frontmatter (`+++`) to YAML frontmatter (`---`).
- Add `description`, `author`, `categories`, `tags`, and `draft`.
- Skip `.zh.md` files for now. The new site is English-only.
- Remove broken external image embeds instead of preserving them blindly.
- Check post tone and relevance before adding it to `Journal`.

Recommended frontmatter shape:

```yaml
---
title: "Post title"
description: "Short useful summary."
date: 2024-01-12
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["Linux", "Rime"]
draft: false
---
```

## Implementation Notes

Shared post UI should accept a `collection` prop so Dev and Journal links stay scoped.

Important files:

```text
src/content.config.ts
src/layouts/components/BlogCard.astro
src/layouts/PostSingle.astro
src/layouts/partials/PostSidebar.astro
src/config/menu.json
src/pages/dev
src/pages/journal
```

After content or route changes, run:

```bash
pnpm run build
```

This catches Astro collection schema issues and generated route problems.

## Future Preferences

- Keep the site English-first for now; do not add multilingual routing unless explicitly requested.
- Keep labels short: use `Dev` and `Journal`, not `Engineering` or `Notes`.
- Prefer curated content over large archive imports.
- If adding professional pages later, likely priorities are `Projects`, `Experience`, and a stronger `About` page.
