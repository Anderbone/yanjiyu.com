---
title: "产品应用中的本地化"
description: "本地化如何影响路由、校验、日期、权限与支持流程。"
date: 2026-03-20
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["Localization", "Product Engineering", "UX"]
draft: false
---

本地化不只是把英文字符串换成另一种语言。

在产品中，语言会影响整个工作流：标签、校验提示、日期、空状态、权限说明、文档、支持笔记，有时还有表单结构。如果这些细节散落各处，本地化就会变得昂贵且容易出错。

第一个边界是文案归属。将来需要翻译的重要产品语言，不应藏在组件内随手写下的字符串里。

```ts
const messages = {
  importStarted: "Import started.",
  importFailed: "Import failed. Check the error file and try again.",
};
```

这不是完整的国际化系统，只是在展示一种习惯：产品提示也是数据，应当能被找到、审查和替换。

校验提示尤其需要用心。“输入无效”可能技术上正确，却没有帮助用户修正问题。把差的错误提示翻译出来，依然是差的提示。

日期和数字也会影响产品行为。状态页不应该让用户猜 `05/06/2026` 究竟是 5 月 6 日还是 6 月 5 日。可以通过 [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) 按地区格式化，或者采用没有歧义的格式。

路由也要做选择。有些应用需要本地化 URL，有些只需在同一路由展示不同语言。这会影响 SEO、书签、支持链接、分析和缓存。我不会在产品没有实际需求时引入多语言路由。

代价是维护：更多文件、键名、审核步骤和测试，简单改文案也可能变慢。因此我倾向先为重要区域建立结构：校验、导航、空状态和高风险流程。

消息键名应贴近产品概念，而不是当前英文句子：

```text
较弱的键：submitButtonText
更好的键：request.submit.action
```

后者描述消息的职责，英文文案变化时仍然有效。

如果明确需要多语言，我会尽早开始；若基本工作流还在探索，我会等待。过早本地化会拖慢尚未成形的产品调整。

实际目标很简单：用户应当理解发生了什么、接下来能做什么，以及哪里出错了。本地化是这份承诺的一部分。
