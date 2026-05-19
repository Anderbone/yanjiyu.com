---
title: "Zod, OpenAPI, and Swagger for API Contracts"
description: "How runtime validation and readable docs help keep public API behavior from drifting."
date: 2025-06-13
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["API", "OpenAPI", "Zod"]
draft: false
---

A public API is not just backend code. It is a product surface for another developer.

That means the contract has to be readable. It also has to be enforced at runtime. Types in the app are useful, but an external script can still send the wrong shape, miss a field, or use an old version of an endpoint.

I like using [Zod](https://zod.dev/) at the boundary because it makes the expected input explicit.

```ts
const CreateRequestSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
});
```

This example is intentionally generic. The real point is that the server validates what crossed the boundary. It does not trust a client because the TypeScript type looked correct somewhere else.

[OpenAPI](https://www.openapis.org/) solves a different problem. It makes the contract visible. A developer should be able to see the authentication requirement, request body, response shape, and error format without reading the server code.

[Swagger](https://swagger.io/docs/) or another API documentation UI then gives people a way to inspect and try the API. That is not just convenience. It can reduce support questions because the expected behavior is easier to discover.

The part I try to design carefully is the error shape. A validation error is still a product response. It should be stable enough that another system can handle it.

```json
{
  "error": {
    "code": "validation_failed",
    "message": "The request body is invalid.",
    "fields": {
      "title": "Title is required."
    }
  }
}
```

The exact format can vary, but it should be consistent. If one endpoint returns `message`, another returns `errors`, and another returns a plain string, every integration becomes more brittle.

The main risk is drift. Validation can say one thing while the docs say another. The OpenAPI file can be updated after the code or forgotten during a refactor. That is why I prefer generating as much of the contract as possible from the same schemas used at runtime, or at least keeping tests around the documented examples.

There is a trade-off. API tooling can become heavy if the product does not need a public or partner-facing API yet. For internal routes used only by the app, a full Swagger setup may be more ceremony than value. But when another developer or script depends on the behavior, the extra clarity is worth it.

My practical checklist for an API boundary is:

- validate runtime input
- document the request and response
- keep authentication requirements visible
- return a stable error shape
- include one realistic example
- test the contract path, not only the happy path

I would not describe this as "API-first" for every project. Sometimes the product starts with the web app and the API follows. That is fine. But once the API exists, it deserves the same attention as a screen. It is still a user interface. The user just happens to be another program.
