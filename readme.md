# yanjiyu.com

Personal website for Jiyu Yan, built with Astro and deployed at [yanjiyu.com](https://yanjiyu.com).

The site is intentionally English-first and job-search oriented: a concise profile, selected technical writing, and a smaller set of curated personal essays.

## Sections

- `Home`: professional landing page
- `About`: profile and CV link
- `Dev`: technical posts, tooling notes, and implementation writeups
- `Journal`: selected essays, translations, and reflective writing

## Stack

- Astro
- React islands for interactive UI
- Tailwind CSS
- Astro content collections
- pnpm

## Development

Install dependencies:

```bash
pnpm install
```

Run the Astro dev server:

```bash
pnpm exec astro dev
```

Run the full development script when generated theme files need to be watched:

```bash
pnpm run dev
```

Build the site:

```bash
pnpm run build
```

Preview the built output:

```bash
pnpm run preview
```

## Content

Main writing collections:

- `src/content/dev`
- `src/content/journal`

Each section has scoped taxonomy pages, so Dev posts should link to `/dev/tags` and `/dev/categories`, while Journal posts should link to `/journal/tags` and `/journal/categories`.

Recommended post frontmatter:

```yaml
---
title: "Post title"
description: "Short useful summary."
date: 2026-05-24
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["Astro", "Product Engineering"]
draft: false
---
```

## Deployment

The site is deployed on Netlify. The primary build command is:

```bash
pnpm run build
```

Cloudflare Workers helpers are available for manual preview/deploy experiments:

```bash
pnpm run preview:cf-workers
pnpm run deploy:cf-workers
```

## License

Code is released under the MIT license. Site content belongs to Jiyu Yan unless otherwise noted.
