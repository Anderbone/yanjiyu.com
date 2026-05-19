---
title: "Astro for Documentation and a Professional Site"
description: "Why a static-first Astro site is a good fit for curated engineering writing and professional notes."
date: 2025-10-31
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["Astro", "Documentation", "Writing"]
draft: false
---

I use [Astro](https://astro.build/) because this site is mostly writing. I do not need a heavy app framework for pages that should load fast and be easy to edit.

That sounds simple, but it is the main decision. A professional personal site should make the important things easy to find: profile, selected projects, engineering notes, and a small amount of personal writing. It should not feel like a full application unless the content needs that.

Astro works well for this because it is static-first. Markdown files can hold posts. [Content collections](https://docs.astro.build/en/guides/content-collections/) can give those files a light content model. Layouts can stay shared without turning every page into a client-side app.

For this site, the split between Dev and Journal is useful:

```text
src/content/dev
src/content/journal
```

Dev can stay focused on practical engineering notes. Journal can hold selected personal essays or reflective writing. The separation keeps the homepage from becoming a large archive, and it helps readers choose the section they actually want.

Content collections are small, but they provide a real boundary. A post can require a title, description, date, tags, categories, and draft status. That catches mistakes before publishing.

```yaml
---
title: "Post title"
description: "Short useful summary."
date: 2025-10-31
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["Astro", "Writing"]
draft: true
---
```

The `draft` field matters. It lets me work on posts in the same structure they will eventually use, while keeping unfinished writing out of the public site.

The other reason I like Astro here is that the site can grow without becoming a dumping ground. A content model does not force curation, but it makes curation easier. Dev posts can be short, practical, and selected. Journal posts can stay separate and not dominate the professional signal.

This also maps to product documentation work. Good docs are not only pages. They need structure, names, ownership, and a way to avoid broken links or stale metadata. A personal site is smaller, but the same habit applies.

The trade-off is that Astro is not trying to be everything. If I needed a highly interactive dashboard, realtime collaboration, or complex authenticated flows, I would reach for a different app shape. For writing and documentation, that limitation is a benefit. It keeps the site focused.

I also like that Astro does not make every component client-side by default. Most of the page can be HTML. Interactive pieces can opt in only when they need JavaScript.

For this site, the decision is boring in the right way:

- static-first pages
- Markdown content
- collections for structure
- simple navigation
- selected writing instead of a full archive import

The useful outcome is not that the stack sounds modern. The useful outcome is that the site stays easy to maintain while making the professional signal clearer.
