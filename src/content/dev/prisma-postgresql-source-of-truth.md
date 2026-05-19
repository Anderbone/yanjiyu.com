---
title: "Prisma and PostgreSQL as the Product Source of Truth"
description: "Why durable product state belongs in the database, and where Prisma should stop leaking into the app."
date: 2025-04-04
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["PostgreSQL", "Prisma", "Data Modeling"]
draft: false
---

I do not think of [PostgreSQL](https://www.postgresql.org/) as only infrastructure. In a product app, it is where the product remembers what happened.

That makes database design a product decision. If a user creates a request, the system should know who created it, what state it is in, when it changed, and what later workflows are allowed to do with it. The UI can display that state, but it should not be the source of truth.

[Prisma](https://www.prisma.io/docs) helps because it makes the data model visible in code and gives typed access to the database. A small create operation can be easy to read:

```ts
export async function createRequest(input: CreateRequestInput) {
  return db.request.create({
    data: {
      title: input.title,
      status: "draft",
      createdById: input.userId,
    },
  });
}
```

This is a simplified example, not a real product schema. The important part is the boundary. A later workflow should read the durable state from the database instead of guessing from a page, cache, or client-side object.

The place where I am careful with Prisma is reach. A typed client is convenient enough that it can leak everywhere. If routes, components, background workers, and tests all call Prisma directly, product rules spread out quietly.

For example, a request may only be submitted when it has a title and the user has permission. That rule should not be copied into three route actions. I would rather put it behind a service:

```ts
export async function submitRequest(input: SubmitRequestInput) {
  const request = await requestRepo.findForUpdate(input.requestId);

  assertCanSubmit(request, input.userId);

  return requestRepo.updateStatus(request.id, "submitted");
}
```

The repository can still use Prisma. The service owns the rule.

PostgreSQL also gives useful product tools beyond simple storage. Transactions matter when a workflow changes more than one thing. Constraints matter when bad state should be impossible. Indexes matter when the product grows and the common screens need to stay fast.

The trade-off is that the database becomes a serious part of the design. Migrations need care. Permissions need care. A field that looks harmless today can become part of the public behavior tomorrow. Renaming or deleting it later may be harder than expected.

Prisma does not remove that work. It makes some of it nicer. The schema is easier to review than scattered SQL strings, and generated types catch many simple mistakes. But it can also hide query costs if I stop thinking about the database underneath.

The approach I prefer is boring:

- PostgreSQL stores durable product state
- Prisma provides typed access and migrations
- services hold product rules
- routes and workers call services, not random database operations
- tests cover the rules where they live

I would not use this exact shape for every project. If the app needs unusual SQL, heavy analytics, or database features that Prisma does not express well, I would use SQL more directly in those areas. If the app is a small prototype, I might accept more direct Prisma calls until the workflow proves it needs a stronger boundary.

The main point is not Prisma itself. The main point is treating persistent state as part of the product contract. Once users depend on it, it deserves clear ownership.
