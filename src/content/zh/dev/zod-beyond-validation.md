---
title: "Zod 不只是校验"
description: "用运行时 schema 描述边界、规范输入，并保持 API 与 UI 契约一致。"
date: 2026-04-17
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["Zod", "TypeScript", "API"]
draft: false
---

[Zod](https://zod.dev/) 通常被介绍为校验库，但更有用的理解是边界定义。

TypeScript 类型主要帮助程序内部的数据，Zod 则帮助守住数据从表单、API、环境变量、导入文件和 AI 工具调用进入的边缘。

```ts
const ImportRowSchema = z.object({
  name: z.string().trim().min(1),
  quantity: z.coerce.number().int().positive(),
});
```

这个 schema 不只校验，也说明边界预期。trim 和强制转换都是小型规范化决策，会改变产品接受什么，应有意识地选择。

schema 应靠近它保护的边界。表单 schema 描述表单输入，API schema 描述公开请求，数据库模型不应自动成为外部契约。

数据库可能有用户不该发送的字段，API 可能接受比内部模型简单的结构，表单解析前也可能以字符串表示数字。到处复用同一 schema 看似高效，却可能隐藏不同职责。

Zod 也有助于统一错误处理，让多个路由以可预期结构返回字段错误：

```json
{
  "fields": {
    "quantity": "Quantity must be a positive number."
  }
}
```

格式本身不如一致性重要。用户和 API 客户端不应为每个接口学习一套错误形式。

取舍在于 schema 可能过于聪明。大型转换、隐藏默认值和复杂 refinement 会让接受什么变得难看清。开始包含真正产品决策时，我通常将决策移到服务，让 schema 专注边界。

我会用它处理表单输入、API 请求体、查询参数、导入行、环境变量和 AI 工具参数。

Zod 不应成为整个领域模型。它擅长边缘，应用其他部分仍需清楚的服务、权限与持久化规则。

如果 schema 让边界更容易审查，它就在帮忙；如果它把工作流藏进一堆转换，就做得过多了。
