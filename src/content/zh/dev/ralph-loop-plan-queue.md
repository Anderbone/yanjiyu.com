---
title: "把 Ralph Loop 当作计划队列"
description: "用一个小巧的 TypeScript 命令行工具，让 Codex 在独立上下文中逐个执行已审阅的 Markdown 计划。"
date: 2026-05-24
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["Codex", "AI Agents", "TypeScript", "Automation"]
draft: false
---

[Ralph Loop](https://ghuntley.com/ralph/) 的想法很简单：让 AI 编程智能体循环执行，同时给予足够结构以持续推进。我做的版本比较小：一个本地 TypeScript CLI，逐个将文件夹中已审阅的 Markdown 实施计划交给 Codex。

源码：[Anderbone/ralph-loop](https://github.com/Anderbone/ralph-loop)。

```text
plans/
  01-add-health-endpoint.plan.md
  02-add-smoke-test.plan.md
  03-document-health-check.plan.md
```

每个文件都是清楚、可直接执行的编程计划。Ralph 选择下一个可运行计划，以它为主要上下文启动 Codex，等待实现，再做一轮简化与审查，将计划归档到 `done/`，然后在新上下文中开始下一个文件。

```text
计划 01 → Codex 实现 → 简化审查 → 归档
计划 02 → 新的 Codex 上下文 → 简化审查 → 归档
计划 03 → 新的 Codex 上下文 → 简化审查 → 归档
```

干净的上下文是我想做这个工具的主要原因。不让一个漫长会话记住整个项目，而让每次执行得到一个专注计划和全新窗口。计划足够多，循环就能运行很久。

我更愿意先审阅计划，再交给 Ralph，而不是让它同时负责规划和执行。规划并不耗时，却最需要人的判断：先回答开放问题、消除歧义，并判断工作是否值得做。

复杂计划可以先用 [`grill-me` 技能](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md) 追问检验。智能体拿到计划前，就应该有清楚范围、验收标准、验证方法，不留隐藏决策。

```text
已审阅计划 → Ralph 循环 → 实现 → 测试/E2E → 简化 → 下一个独立上下文
```

最好的版本并不神奇：准备好计划队列、真实的测试或端到端检查，每次改动后简化，让电脑运行一夜。早上我想看到一组小而完成的计划，而不是一个巨大又难以理解的智能体会话。
