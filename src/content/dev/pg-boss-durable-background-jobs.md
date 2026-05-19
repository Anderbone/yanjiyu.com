---
title: "pg-boss for Durable Background Jobs"
description: "Why I used a database-backed job queue for slow product workflows, and what had to be visible to users."
date: 2025-05-09
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["PostgreSQL", "Background Jobs", "Product Engineering"]
draft: false
---

The customer problem was not "we need a queue". The problem was that a slow operation made the user wait with no clear answer.

That distinction matters. A queue is an implementation detail. The product problem is uncertainty. The user clicks a button, the app thinks for too long, and nobody knows whether the work started, failed, or will finish later.

For that kind of workflow, I like moving slow work out of the request and into a durable background job. A common example is a report export or CSV import. The web request should validate the basics, create a job, and send the user to a status page. The worker can do the slow part.

```ts
await boss.send("report.export", {
  reportId,
  requestedBy: userId,
  idempotencyKey,
});
```

This is a fake job name and payload, but the shape is realistic. The request captures enough information for the worker to do the work later. The user gets a job they can track.

I like [pg-boss](https://github.com/timgit/pg-boss) for this stage because it uses [PostgreSQL](https://www.postgresql.org/). If the app already depends on Postgres for durable state, a database-backed queue can be a practical choice. It avoids adding a separate queue service before the product needs that extra moving part.

The important UI is the status page. It should show states the user understands:

```text
queued
running
done
failed
```

This sounds small, but it changes the experience. The user does not have to guess whether the button worked. Support does not have to guess either. The system has a record of the job and the latest state.

Retries are useful, but only if the job can handle them. A retry should not create duplicate records, send duplicate emails, or charge twice. That is why an idempotency key matters. The worker needs a way to say, "I have already handled this logical request."

Failure also needs a product answer. A failed job should not disappear into logs only engineers can read. The user may need a short error message, a retry button, or a way to download validation errors. The exact UI depends on the workflow, but the failure state should be designed.

The trade-off is that a queue does not remove complexity. It moves complexity into a different place. Now there is a worker process, job monitoring, retry behavior, and a question of what happens during deploys. That is still simpler than making a user wait for long work inside one request, but it is not free.

I would use `pg-boss` when:

- the app already uses PostgreSQL
- job volume is moderate
- operational simplicity matters
- the team wants durable jobs without a separate queue service

I would consider a separate queue when job volume becomes a main bottleneck, workers need more specialized scaling, or the system already has queue infrastructure.

The lesson for me is that background jobs are a product feature, not just backend plumbing. The queue matters, but the visible workflow matters more. A durable job without a clear status page still leaves the user guessing.
