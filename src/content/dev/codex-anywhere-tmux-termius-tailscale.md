---
title: "Codex anywhere with tmux, Termius, and Tailscale"
description: "A practical mobile setup for using Codex from a phone by SSHing into a laptop and attaching to tmux."
date: 2026-05-18
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["Codex", "tmux", "SSH", "Tailscale", "Termius"]
draft: false
---

My current mobile [Codex](https://openai.com/codex) setup is deliberately simple: I use [Termius](https://termius.com/) on my phone to SSH into my own laptop, then run Codex inside a [tmux](https://github.com/tmux/tmux) session.

When I am at home, this is just SSH over my home Wi-Fi. When I am outside, I turn on [Tailscale](https://tailscale.com/docs) and use the same Termius profile against the laptop's Tailscale address. The workflow stays the same:

```text
Phone -> Termius -> SSH -> laptop -> tmux -> Codex
```

The important part is `tmux`. If the phone app is suspended, the network changes, or the SSH session drops, the work does not disappear. I reconnect from Termius, attach to the existing session, and continue from where I left off.

```bash
tmux new -s codex
```

Later, reconnect with:

```bash
tmux attach -t codex
```

I also tested remote control through the Codex app. The UI is better for phone use, but on Arch Linux it is not an official target for me, and the connection has been too slow and unreliable. A nicer UI does not help much when the session keeps dropping.

So I went back to the boring setup that works: Termius for SSH, Tailscale for private networking when I am away from home, and `tmux` as the durable shell on the laptop.

It is not elegant, but it gives me the thing I actually need: access to the same local development environment from anywhere, without pretending the phone is the development machine.
