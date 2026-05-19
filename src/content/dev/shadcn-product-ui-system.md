---
title: "shadcn-Style UI as an Owned Product System"
description: "Why copied UI primitives can become a practical product system instead of a black-box dependency."
date: 2025-12-05
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["UI", "Design System", "Product Engineering"]
draft: false
---

I like copied UI primitives because they make the component library feel like part of the app, not something the app is borrowing.

That is the part of the [shadcn/ui](https://ui.shadcn.com/)-style approach I find most useful. The components are not locked away behind a black-box package. They live in the codebase. The team can read them, change them, and make them fit the product language.

This matters most for repeated product patterns: dialogs, forms, tables, empty states, toasts, and menus. The visual style should be consistent, but the copy and behavior still need to match the action.

A delete dialog and a submit dialog may share the same primitive. They should not share vague language.

```text
Dialog primitive: shared
Action copy: specific
Permission check: owned by the workflow
Result handling: owned by the workflow
```

The component system should make the common shape easy. It should not hide the product decision.

For example, a confirmation dialog can standardize layout, focus behavior, buttons, and accessible labels. The workflow still decides what is being confirmed, whether the user has permission, and what happens after confirmation.

That boundary keeps shared UI useful without making it too clever. A component named `ConfirmDialog` can be shared. A component that secretly knows every domain-specific action becomes harder to reuse and harder to trust.

The trade-off is ownership. Copied components are now your components. If accessibility needs improvement, the team owns that improvement. If the design changes, the team owns the update. That is more work than importing a finished library and accepting its defaults.

I think that trade-off is often good for product apps. The app will usually need its own language anyway. Empty states need to explain what the user can do next. Toasts need to say what actually happened. Form errors need to match the workflow. A generic component library cannot decide those things for the product.

Icons are similar. A consistent icon set is useful, but icons should support recognition, not replace clarity. A destructive action still needs careful text. A toolbar button still needs an accessible label or tooltip if the icon is not obvious.

I would use this style when:

- the app has repeated interaction patterns
- the team wants control over details
- accessibility and copy need product-specific review
- consistency matters more than fast visual novelty

I would be more cautious for a very small prototype where a full component system would slow everything down. I would also avoid turning every shared component into a large abstraction. Sometimes a copied primitive with clear props is enough.

The value is not that the UI looks like a certain library. The value is that common product interactions become consistent and editable. A good product system should make the ordinary paths feel predictable, while still leaving enough room for each workflow to say exactly what it means.
