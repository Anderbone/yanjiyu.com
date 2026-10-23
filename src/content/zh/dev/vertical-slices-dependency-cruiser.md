---
title: "垂直切片架构与 dependency-cruiser"
description: "通过功能切片和依赖规则，让产品工作流更容易修改。"
date: 2026-05-23
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["Architecture", "Dependency Cruiser", "Product Engineering"]
draft: false
---

我喜欢垂直切片，因为功能更容易删除、移动或审查。价值不在目录名，而在于一个工作流的代码不再散在十个无关位置。

一个用户任务往往跨越 UI、校验、服务、数据访问和测试。只按技术层分目录时，小改动也要从 `components` 跳到 `schemas`、`services` 和 `repositories`，再猜哪些属于同一功能。

垂直切片让功能规则靠近功能本身：

```text
app/features/imports/
  components/
  imports.schema.ts
  imports.service.ts
  imports.repo.ts
  imports.test.ts
```

这只是通用例子，可以是导入、通知设置或审核步骤。关键是经常一起变化的代码放在一起。

共享代码仍有位置。按钮、对话框基础组件、日期格式、数据库客户端和认证 helper，不应复制到每个切片。但功能专属规则，也不应只因为今天两个文件用到，就搬进全局 helper。

架构难处在这里：起初无害的 helper，后来可能成为不相关流程共享隐藏行为的地方，改一个流程就意外影响另一个。

我的原则是：共享 UI 基础组件和基础设施可以共享；产品决策在真正通用之前，应留在所属流程。

文字约定忙起来容易忘。[dependency-cruiser](https://github.com/sverweij/dependency-cruiser) 能把一部分边界变成 CI 反馈。例如功能可以引用共享代码，共享代码不能反过来引用功能：

```js
{
  name: "shared-must-not-import-features",
  from: { path: "^app/shared" },
  to: { path: "^app/features" },
  severity: "error"
}
```

这条规则并不聪明，只是在普通错误成为惯例前抓住它。

规则也有维护成本。太严格，工程师会忙着对抗架构；太松，则保护不了什么。我不认为它们是永久法律，而应描述仓库当前需要的结构，产品变化时规则也可能变化。

很小的应用未必值得严格切片，库的使用方式也不一定适合功能目录。但有多个工作流的产品，值得明确问：“这个用户任务究竟拥有哪些代码？”这比争论文件夹名字有用。
