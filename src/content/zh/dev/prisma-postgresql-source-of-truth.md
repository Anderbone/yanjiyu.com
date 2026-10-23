---
title: "Prisma 与 PostgreSQL：产品状态的事实来源"
description: "持久状态为何属于数据库，以及如何避免 Prisma 渗透应用各处。"
date: 2025-04-04
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["PostgreSQL", "Prisma", "Data Modeling"]
draft: false
---

我不把 [PostgreSQL](https://www.postgresql.org/) 只当作基础设施。对于产品，它是记住发生过什么的地方。

因此数据库设计也是产品决策。用户创建请求后，系统应知道创建者、当前状态、修改时间，以及后续流程允许做什么。界面可以展示状态，却不应成为事实来源。

[Prisma](https://www.prisma.io/docs) 让数据模型在代码中可见，并提供有类型的数据库访问：

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

这只是简化示例。重点是边界：后续工作流应读取数据库里的持久状态，而不是从页面、缓存或客户端对象猜测。

Prisma 很方便，容易出现在路由、组件、后台 worker 和测试的每个角落，产品规则也随之悄悄散开。

例如请求只有具备标题且用户有权限时才能提交。这条规则不应复制到三个路由 action 中，应该放在服务后面：

```ts
export async function submitRequest(input: SubmitRequestInput) {
  const request = await requestRepo.findForUpdate(input.requestId);
  assertCanSubmit(request, input.userId);
  return requestRepo.updateStatus(request.id, "submitted");
}
```

repository 仍可使用 Prisma，服务负责规则。

PostgreSQL 也不只是存储。一次流程修改多个对象时需要事务；必须杜绝坏状态时需要约束；产品增长后常用页面仍要快，就需要索引。

代价是必须认真设计数据库。迁移和权限都需要谨慎。今天看似无害的字段，明天可能成为公开行为的一部分，之后改名或删除会比想象困难。

Prisma 让 schema 更容易审查，生成类型能抓住许多简单错误，却不能消除这些设计工作。如果忘记底层数据库，也容易忽略查询成本。

我偏好的分工是：PostgreSQL 存持久状态；Prisma 提供类型访问和迁移；服务承载产品规则；路由与 worker 调用服务；测试在规则所在处验证规则。

这并非适用于所有项目。特殊 SQL、重分析或 Prisma 不擅长表达的数据库特性，可以直接用 SQL。小原型也可以先接受更直接的 Prisma 调用，直到流程确实需要更强的边界。

重点不在 Prisma 本身，而在于把持久状态当作产品契约。用户一旦依赖它，就应该有清楚的归属。
