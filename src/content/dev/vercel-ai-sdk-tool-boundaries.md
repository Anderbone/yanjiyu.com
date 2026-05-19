---
title: "Vercel AI SDK with Explicit Tool Boundaries"
description: "Why AI tools need schemas, permissions, confirmation, and audit trails before they change product data."
date: 2025-08-22
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["AI", "Vercel AI SDK", "Product Safety"]
draft: false
---

The risky part of an AI feature is not the chat UI. The risky part is what the chat is allowed to do.

It is easy to make an assistant feel powerful by giving it tools. With something like the [Vercel AI SDK](https://ai-sdk.dev/), it can read data, prepare changes, call actions, and explain the result in natural language. That can be useful. It can also become a hidden side door into important product behavior.

I prefer to treat AI tools as product boundaries. A tool should have a schema, a permission check, a clear result, and a decision about whether it is read-only or mutating.

```ts
const DraftChangeSchema = z.object({
  recordId: z.string(),
  summary: z.string(),
  proposedValue: z.string(),
});
```

This kind of schema is not only a TypeScript convenience. It describes what the assistant is allowed to ask for. It also limits what the server should accept.

For important changes, I like a confirmation step. The assistant can draft the change and explain the reason. The user reviews a summary and decides whether to apply it. Until confirmation, nothing important changes.

```text
Assistant action: prepare change
User sees: summary, affected record, proposed value
User chooses: confirm or cancel
Server records: who confirmed, when, and what changed
```

That flow is slower than direct execution. That is the point. If the action affects durable data, permissions, billing, documents, or workflow state, a little friction can be useful.

Read-only tools are a good first step. They let the assistant answer questions without changing anything. Even then, permissions still matter. The assistant should not read data the current user could not read through the normal product UI.

The confirmation copy matters too. "Apply" is not enough if the action is risky. The user should know what will happen. A good confirmation panel names the affected item, the proposed change, and the consequence in plain language.

Audit logs become more important when AI is involved. If a user confirms an AI-assisted change, the system should record that sequence. Not because AI is magic, but because the path is less direct than a normal form submit. Future debugging needs to know what the assistant proposed and what the user approved.

The trade-off is product speed. Too many confirmations can make the feature annoying. Too few can make the system unsafe. I would rather start with stricter boundaries and relax them only for actions that are low-risk, reversible, and well understood.

I would not start an AI feature by giving it every tool the app has. I would start with one narrow task:

- read the records the user can already see
- draft a change using a strict schema
- show the user what will happen
- require confirmation before mutation
- log the confirmed result

The open question is where the boundary should move over time. Some actions may become safe enough for direct execution. Others should always require review. The answer is not only technical. It depends on user trust, reversibility, and how expensive a mistake would be.
