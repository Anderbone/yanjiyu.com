---
title: "Ralph Loop as a Plan Queue"
description: "A small TypeScript CLI for running pre-reviewed Markdown implementation plans through Codex with fresh context."
date: 2026-05-24
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["Codex", "AI Agents", "TypeScript", "Automation"]
draft: false
---

[Ralph Loop](https://ghuntley.com/ralph/) is the simple idea of putting an AI coding agent in a loop and giving it enough structure to keep making progress. My version is deliberately smaller than the hype around the pattern: it is a local TypeScript CLI for running a folder of pre-reviewed Markdown implementation plans through Codex, one file at a time.

The repository is here: [Anderbone/ralph-loop](https://github.com/Anderbone/ralph-loop).

The showcase is simple. I have a folder like this:

```text
plans/
  01-add-health-endpoint.plan.md
  02-add-smoke-test.plan.md
  03-document-health-check.plan.md
```

Each file is a clear, ready-to-run coding plan. Ralph picks the next runnable plan, starts Codex with that plan as the main context, waits for the implementation, runs a simplify/review pass, archives the plan into `done/`, then starts again with a fresh context for the next file.

The rough flow is:

```text
plan 01 -> Codex implements -> simplify pass -> archive
plan 02 -> new Codex context -> simplify pass -> archive
plan 03 -> new Codex context -> simplify pass -> archive
```

That clean context is the main reason I wanted this. Instead of asking one long agent session to remember a whole project, each run gets one focused plan and a fresh window. If there are enough plans, the loop can run for a long time.

I prefer this over letting Ralph both make the plan and run the plan. Planning does not take much time, and it is the part where human review matters most. Before a plan enters the folder, I can answer open questions, remove ambiguity, and decide whether the work is actually worth doing.

For complex plans, I like stress-testing the plan first with the [`grill-me` skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md). The goal is to make the plan boring before the agent sees it: clear scope, clear acceptance criteria, clear verification, and no hidden decisions.

```text
reviewed plans -> Ralph loop -> implementation -> tests/e2e -> simplify -> next fresh context
```

The best version of this is not magic. It is leaving the laptop running overnight with a good plan queue, real checks such as tests or e2e tests, and a simplify pass after each change. In the morning, I want a stack of small completed plans, not one giant mysterious agent session.
