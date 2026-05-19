---
title: "Testing Product Workflows with Vitest and Playwright"
description: "How I split workflow tests between fast service checks and a few browser paths that matter."
date: 2025-07-18
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["Testing", "Vitest", "Playwright"]
draft: false
---

I do not want a test suite that only proves functions work. I want it to protect the workflows that would hurt if they broke.

That does not mean every rule needs a browser test. Browser tests are valuable, but they are slower and more fragile than service tests. If I can test a product rule directly with [Vitest](https://vitest.dev/), I usually start there.

For example, a request may not be submitted without a title.

```ts
test("cannot submit an empty request", async () => {
  await expectSubmitRequest({ title: "" }).rejects.toThrow("Title is required");
});
```

This is a simplified test, but it shows the level where the rule belongs. I do not need to open a browser to check that an empty title is invalid. A service test can run quickly and fail close to the problem.

[Playwright](https://playwright.dev/) is useful for a different question: does the full path work for a user? Can they open the page, fill the form, submit it, follow the redirect, and see the new status?

That kind of test catches broken wiring. It catches missing form names, redirect mistakes, route loader errors, permission issues, and UI states that are not visible from a service test.

I try to keep browser tests focused on critical paths:

- create the thing users create most often
- edit the thing users are likely to edit
- submit or approve a workflow
- check the state that confirms the action worked
- cover one important permission or error path

The mistake I have made before is pushing too much into end-to-end tests because they feel closer to the real product. That can turn the test suite into a slow checklist. When a test fails, it is not always clear whether the rule is wrong, the selector changed, the seed data broke, or the browser path is flaky.

A better split is:

- Vitest for rules, services, validation, formatting, and small integration boundaries
- Playwright for a small number of user journeys where the whole stack matters

Screenshots and traces can help when a browser test fails. They are especially useful in CI, where nobody is watching the browser. But private screenshots should stay private. For public writing, I would rather use a small demo app or no screenshot at all.

The trade-off is that test boundaries need maintenance. If the service layer is too thin, service tests do not prove much. If the UI owns too much logic, browser tests become the only way to test product behavior. That is usually a sign that the code boundary should improve, not that the test suite needs more browser coverage.

I also try to avoid fake confidence. A passing test suite does not prove the product is correct. It proves specific expectations are still true. The value is choosing expectations that match the risk users actually care about.

For a small product workflow, a useful test plan might be:

```text
service test: cannot submit invalid input
service test: valid submit changes status
service test: user without permission is rejected
browser test: user creates, submits, and sees submitted status
```

That is not exhaustive. It is a practical start. It protects the rule and the path without making every small variation a full browser test.
