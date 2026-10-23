# Agent Notes

## Project Goal

This repo is the new professional personal website for Jiyu Yan. The priority is a polished bilingual English/Chinese site useful for job hunting: clear profile, selected projects, and curated writing. Avoid migrating the old site wholesale unless asked.

The original Hugo repo is available at:

```text
/home/jiyu/git/archived/myblog
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

## Preview Access

- Always share preview links using this machine's Tailscale address so the user can open them on their phone. Do not use localhost or 127.0.0.1 in user-facing preview links.
- Check `tailscale ip -4` for the current address. Reuse an existing project preview bound to that address when available; otherwise bind Astro to the Tailscale IP.
- Current example: `pnpm exec astro dev --host 100.102.70.20 --port 4321`, then share `http://100.102.70.20:4321/zh` for Chinese previews.

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
- Reuse existing Chinese originals from the old blog when available. Store Chinese versions under `src/content/zh/<collection>/` with the same filename and taxonomy identifiers as the English version.
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

- Maintain both English and Simplified Chinese for every published page and post.
- English URLs stay at `/`; Chinese counterparts use `/zh`. The header language link switches to the same page in the other language.
- Astro pages are automatically registered at both paths by the `chinese-routes` integration. Use `localeFrom`, `translator`, and `localePath` from `src/lib/i18n.ts` for UI, metadata, and internal links.
- Add Chinese interface strings in `src/i18n/zh.json`. Technical identifiers and product names may remain unchanged.
- For content, add matching Markdown/MDX under `src/content/zh/<collection>/`, preserving dates, draft/pinned status, tags, categories, and slugs. Keep prose and image descriptions localized.
- Run `pnpm run check`, `pnpm run build`, and `pnpm run check:i18n` after changes. The translation check must pass before considering new content complete.
- Keep labels short: use `Dev` and `Journal`, not `Engineering` or `Notes`.
- Prefer curated content over large archive imports.
- If adding professional pages later, likely priorities are `Projects`, `Experience`, and a stronger `About` page.

<!-- BEGIN OBSIDIAN_PROJECT_NOTES -->
<!-- obsidian-mapping: {"project": "yanjiyu.com", "link": "obsidian", "plans": "plan"} -->

## Durable project notes (Obsidian)

Project: `yanjiyu.com`. Repository link: `obsidian`. Before writing durable notes,
check the mapping; invoke `$ensure-obsidian-link` for setup or repair.
Write plans in `obsidian/plan/`, and other working notes in
`obsidian/notes/`, `obsidian/research/`, or `obsidian/decisions/` (create on demand).
Inspect existing notes; continue existing plans, re-read the latest file before edits,
and preserve unrelated content. Keep one canonical copy in Obsidian; verify writes
and report the resolved Obsidian file path. This covers English/Chinese requests
such as “列个计划”, “更新计划”, “记录一下”, “write a plan”, “document this decision”.
Conversational answers and temporary checklists do not require a saved note.
Keep source, configuration, AGENTS instructions, and repository-required docs in
this repository; honor explicit destinations in the current request.

<!-- END OBSIDIAN_PROJECT_NOTES -->
