---
title: "通过 tmux、Mosh、Termius 与 Tailscale 随处使用 Codex"
description: "在手机上连接自己的电脑，用 Mosh、Tailscale 和持久的 tmux 会话运行 Codex。"
date: 2026-05-18
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["Codex", "tmux", "Mosh", "SSH", "Tailscale", "Termius"]
draft: false
---

> **2026 年 10 月更新：**我现在使用 Terminal Spike，配合 Herdr、code-server、Obsidian 和 Pi Edge。请看[我目前的工作流](/zh/dev/workflow-anywhere)。下面记录的是早期方案。

我早期的手机 [Codex](https://openai.com/codex) 方案很简单：手机上的 [Termius](https://termius.com/) 连接自己的笔记本，Codex 则运行在 [tmux](https://github.com/tmux/tmux) 会话里。网络稳定时用 SSH，移动网络不稳定时用 [Mosh](https://mosh.org/)。

在家就是通过 Wi-Fi 使用 SSH。出门后打开 [Tailscale](https://tailscale.com/docs)，用同一个 Termius 配置连接笔记本的 Tailscale 地址。流程没有变化：

```text
手机 → Termius → Mosh 或 SSH → 笔记本 → tmux → Codex
```

Mosh 能更好地应对交互连接中的波动。它先通过 SSH 建立连接，再使用 UDP，让终端能熬过短暂断网，并在 Wi-Fi 和移动数据间切换。在我的 Arch Linux 笔记本上，只需安装：

```bash
sudo pacman -S mosh
```

然后通过 Tailscale 主机名或地址连接：

```bash
mosh jiyu@my-laptop
```

Mosh 不能替代 `tmux`。Mosh 让不稳定的连接仍可使用；`tmux` 则在终端客户端关闭、Mosh 会话最终结束，或换设备重连时，继续运行 Codex。这个分工是方案的关键。

```bash
tmux new -s codex
```

之后重新连接：

```bash
tmux attach -t codex
```

我也试过通过 Codex 应用远程控制。手机界面更好用，但 Arch Linux 并非官方支持目标，我这里的连接也过慢且不可靠。会话不断掉线时，更好的界面帮助不大。

所以我回到朴素但可靠的组合：手机用 Termius，终端连接用 Mosh 或 SSH，出门用 Tailscale 建立私有网络，笔记本上用 `tmux` 保持持久会话。

它不算优雅，却能满足我的实际需求：随处访问同一个本地开发环境，无需假装手机就是开发机器。
