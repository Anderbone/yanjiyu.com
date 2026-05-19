---
title: "Pragmatic Drag and Drop for Real Ordering Tasks"
description: "How drag-and-drop UI can support ordering workflows without hiding keyboard access or persistence rules."
date: 2026-02-13
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["UI", "Drag and Drop", "Product Engineering"]
draft: false
---

Drag and drop is easy to add for a demo and harder to make reliable for real work.

The product question is not "can the item move on screen?" The question is whether the user can safely change an order, understand what changed, save it, and recover if something goes wrong.

A simple ordering workflow might look like this:

```text
1. User reorders steps
2. UI shows unsaved changes
3. User saves the new order
4. Server validates the order
5. Page shows the saved result
```

That is different from moving elements in local state only. The order usually matters to a later workflow. If the save fails, the app should not pretend the new order is durable.

Libraries such as [Pragmatic Drag and Drop](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/) are useful because they handle a difficult interaction pattern while still letting the product own the data model. I do not want drag behavior to decide business rules. I want it to produce a clear reorder intent.

```ts
type ReorderInput = {
  itemId: string;
  beforeItemId?: string;
  afterItemId?: string;
};
```

The exact shape can vary. The useful part is that the UI sends an intentional change instead of a vague blob of client state.

Keyboard access matters here. Drag and drop cannot be the only path if ordering is a real task. Users should be able to move an item up or down with controls that are understandable and reachable without a mouse.

The save model also matters. Immediate persistence can feel fast, but it can be awkward if the user wants to make several moves and review the final order. A batch save can be calmer for dense ordering tasks. The UI should make that choice visible with a dirty state.

The server still needs to validate the result. It should reject missing items, duplicate positions, or changes the user is not allowed to make. The client can help prevent mistakes, but it should not be the only guard.

The trade-off is that ordering UI adds more states than it first appears:

- idle
- dragging
- changed but unsaved
- saving
- saved
- failed

If those states are not designed, the feature feels fragile. Users can end up wondering whether the order changed only on their screen or in the product.

I would use drag and drop when ordering is frequent and visual position helps the task. I would avoid it when a plain priority number, select menu, or move up/down button would be clearer.

The goal is not to make the UI feel interactive. The goal is to help the user express a real ordering decision and make that decision durable.
