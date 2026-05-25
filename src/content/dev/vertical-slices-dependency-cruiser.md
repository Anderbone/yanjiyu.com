---
title: "Vertical Slice Architecture with Dependency-Cruiser"
description: "How vertical feature slices and dependency rules can keep product workflows easier to change."
date: 2026-05-23
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["Architecture", "Dependency Cruiser", "Product Engineering"]
draft: false
---

I like vertical slices because they make a feature easier to delete, move, or review. The folder structure is not the main value. The value is that the code for one workflow is not spread across ten unrelated places.

For product work, that matters. A single user task usually crosses the UI, validation, service logic, data access, and tests. If those pieces live only in broad technical folders, a small change can feel larger than it is. You have to jump from `components` to `schemas` to `services` to `repositories` and then guess which parts belong together.

With a vertical slice, I try to keep the feature rule close to the feature.

```text
app/features/imports/
  components/
  imports.schema.ts
  imports.service.ts
  imports.repo.ts
  imports.test.ts
```

This example is deliberately generic. The feature could be an import workflow, a notification setting, or a review step. The point is the boundary: most of the code that changes together is close together.

Shared code still has a place. A button, dialog primitive, date formatter, database client, or authentication helper should not be copied into every slice. But feature-specific rules should not drift into a global helper just because two files need them today.

That is the awkward part of architecture. The first version of a helper often looks harmless. Later it becomes a place where unrelated workflows share hidden behavior. At that point, changing one product flow can accidentally change another.

My rule of thumb is:

- shared UI primitives can be shared
- shared infrastructure can be shared
- product decisions should stay inside the workflow until they are truly common

I also like having a tool check the boundary. A written convention is easy to forget during a busy week. [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) can turn some of those conventions into CI feedback.

A simplified rule might say that feature code can import shared code, but shared code cannot import a feature.

```js
{
  name: "shared-must-not-import-features",
  from: { path: "^app/shared" },
  to: { path: "^app/features" },
  severity: "error"
}
```

That rule is not clever. It is useful because it catches a boring mistake before it becomes normal.

The trade-off is that dependency rules can become their own maintenance burden. If the rules are too strict, engineers spend time fighting the architecture instead of improving the product. If the rules are too loose, they do not protect anything.

I do not think architecture rules should be permanent law. They should describe the shape the codebase needs right now. When the product changes, the rules may need to change too.

This approach is not always worth it. For a tiny app, strict vertical slices may be ceremony. For a library, feature folders may not match how users consume the code. But for a product app with several workflows, vertical slices make it easier to ask the practical question: "What code does this user task actually own?"

That question is more useful than arguing about folder names.
