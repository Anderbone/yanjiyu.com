---
title: "用 Zod、OpenAPI 与 Swagger 维护 API 契约"
description: "运行时校验与可读文档，如何避免公开 API 的行为逐渐偏离约定。"
date: 2025-06-13
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["API", "OpenAPI", "Zod"]
draft: false
---

公开 API 不只是后端代码，也是面向其他开发者的产品界面。

因此契约既要可读，也要在运行时执行。应用中的类型有帮助，但外部脚本仍可能发送错误结构、漏掉字段或调用旧版接口。

我喜欢在边界使用 [Zod](https://zod.dev/)，明确预期输入：

```ts
const CreateRequestSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
});
```

例子刻意保持通用。重点在于服务器校验真正跨过边界的数据，而不是信任客户端某处看起来正确的 TypeScript 类型。

[OpenAPI](https://www.openapis.org/) 解决另一个问题：让契约可见。开发者无需阅读服务端源码，就应能了解认证要求、请求体、响应结构和错误格式。

[Swagger](https://swagger.io/docs/) 等文档界面让人查看并试用 API。这不仅方便，也能让预期行为更容易发现，从而减少支持问题。

我尤其重视错误结构。校验失败也是产品响应，应当稳定到其他系统可以处理：

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

格式可以不同，但必须一致。一个接口返回 `message`，另一个返回 `errors`，再一个只返回字符串，会让每个集成都变脆弱。

主要风险是契约漂移：校验说一套，文档说另一套；OpenAPI 更新落后于代码，或重构时被遗忘。所以我尽量从运行时使用的同一套 schema 生成契约，至少也要测试文档中的示例。

工具也有代价。产品还不需要公开或合作伙伴 API 时，完整 Swagger 系统可能过重。只供应用内部调用的路由未必需要它，但其他开发者或脚本依赖行为时，这份清晰度值得。

我的 API 边界检查包括：运行时校验、请求与响应文档、可见的认证要求、稳定错误结构、一个真实示例，以及覆盖契约路径而不只是成功路径的测试。

并非每个项目都要“API 优先”。先有网页应用，再补 API 也没问题。但一旦 API 存在，就值得像页面一样认真对待。它仍是用户界面，只是用户恰好是另一个程序。
