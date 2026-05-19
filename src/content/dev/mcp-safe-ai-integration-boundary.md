---
title: "MCP as a Safe AI Integration Boundary"
description: "How I think about model tools as narrow product interfaces instead of hidden access to an application."
date: 2026-01-09
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["AI", "MCP", "Product Safety"]
draft: false
---

[MCP](https://modelcontextprotocol.io/) is interesting because it makes AI integrations feel less like prompt magic and more like software boundaries.

That is the part I care about. A model should not get vague access to an application. It should get a small set of tools with names, schemas, permission checks, and predictable results. The boundary should be visible enough that an engineer can review it and a user can understand what the assistant is allowed to do.

A safe tool can be very small.

```ts
const GetJobStatusInput = z.object({
  jobId: z.string(),
});
```

This tool does one thing: it reads the status of a job the user is allowed to see. It does not update records, skip permissions, or infer hidden state from private data. The boring shape is useful.

I like starting AI integrations with read-only tools. They help users ask questions without giving the assistant mutation power too early. If read-only tools are not useful, mutating tools probably will not be safe just because they are more powerful.

When a tool does change something, I want the app to answer a few questions clearly:

- who is allowed to call it
- what input shape is accepted
- what state can change
- whether the user must confirm first
- what gets logged after execution
- how failure is reported

MCP does not solve those questions by itself. It gives a place to express the boundary. The product still needs permission checks, confirmation states, audit logs, and careful copy.

The risk is that tool names can sound safe while the implementation is too broad. A tool called `updateRecord` is not a product boundary. It is a vague remote control. A better tool should describe a specific action with a narrow input and a clear result.

```text
Too broad: updateRecord
Better: draftStatusChange
Better: confirmStatusChange
```

That split matters. Drafting a change and applying a change are different actions. One can be safe for the assistant to prepare. The other may need the user to review and confirm.

The trade-off is speed. A narrow tool set takes more design work than giving the assistant a general API client. I think that work is worthwhile when the product contains important data. The assistant should make workflows easier, not create a second path around normal product rules.

I would use MCP when I want the AI boundary to be explicit and reviewable. I would still keep the same product rules behind the tools that I keep behind normal routes and APIs. The model can choose a tool, but the server should still decide what is allowed.
