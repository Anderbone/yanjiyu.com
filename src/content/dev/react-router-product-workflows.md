---
title: "React Router for Full-Stack Product Workflows"
description: "How route loaders and actions can make user tasks explicit without putting every rule in the route."
date: 2025-02-28
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["React Router", "Full Stack", "Product Engineering"]
draft: false
---

A route is not only a URL. In a product app, a route often represents a task the user is trying to finish.

That sounds obvious, but it changes how I design the code. A settings page that starts an import is not just a screen. It has current state, validation, permission checks, a submit action, a redirect, and a failure state. If those pieces are scattered, the workflow becomes harder to reason about.

[React Router](https://reactrouter.com/) loaders and actions give a simple way to keep the page boundary explicit.

```ts
export async function loader() {
  return getImportStatus();
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const result = await startImportFromForm(formData);

  return redirect(`/settings/imports/${result.jobId}`);
}
```

The example is small, but it shows the shape I like. The loader answers: what does the user need before seeing this page? The action answers: what happens when the user submits the form?

The route should not own every decision. If an uploaded file needs validation, permissions, an idempotency key, or a background job, I prefer to move that into a service. The route should coordinate the web boundary. The service should own the product rule.

That keeps the route readable:

```ts
const result = await startImportFromForm(formData);
```

The route does not need to know every detail of import processing. It needs to know how to turn a user request into the next user-visible state.

This is where route design becomes product design. After the action starts a slow task, the user should not stay on a frozen form. A redirect to a status page gives the user an answer: the request was accepted, it has a job id, and the app can show whether it is queued, running, done, or failed.

The first version of a workflow often starts inside one action because that is the fastest way to ship it. That is fine. The warning sign is when the action becomes the only place where the rule exists. At that point, it becomes harder to test without a browser and harder to reuse from another entry point.

I usually look for these boundaries:

- the route handles form data, response shape, redirects, and route-level errors
- the schema validates external input
- the service decides what the workflow means
- the repository or database layer handles persistence
- the UI shows the state in a way the user can act on

React Router is a good fit when the workflow maps naturally to pages and forms. It is less helpful if most interactions are highly realtime, canvas-based, or mostly local state. In those cases, the route may be a thin shell around a more interactive client.

The trade-off is that loaders and actions can make routes feel powerful enough to hold everything. I try to resist that. A thin route with a clear service behind it is usually easier to test and easier to change.

The practical test is simple: if I can explain the user task by reading the route and test the business rule without rendering the page, the boundary is probably in a good place.
