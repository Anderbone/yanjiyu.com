---
title: "Codex anywhere with tmux, Mosh, Termius, and Tailscale"
description: "A practical mobile setup for using Codex from a phone with Mosh, Tailscale, and a durable tmux session."
date: 2026-05-18
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["Codex", "tmux", "Mosh", "SSH", "Tailscale", "Termius"]
draft: false
---

My current mobile [Codex](https://openai.com/codex) setup is deliberately simple: I use [Termius](https://termius.com/) on my phone to connect to my own laptop, then run Codex inside a [tmux](https://github.com/tmux/tmux) session. For a normal connection I use SSH; on a less reliable mobile network I use [Mosh](https://mosh.org/) instead.

When I am at home, this is just SSH over my home Wi-Fi. When I am outside, I turn on [Tailscale](https://tailscale.com/docs) and use the same Termius profile against the laptop's Tailscale address. The workflow stays the same:

```text
Phone -> Termius -> Mosh or SSH -> laptop -> tmux -> Codex
```

Mosh makes the interactive connection more forgiving. It starts through SSH, then uses UDP so the terminal can survive short interruptions and roam between Wi-Fi and mobile data. On my Arch Linux laptop, the server is a small install:

```bash
sudo pacman -S mosh
```

I can then connect to the laptop by its Tailscale hostname or address:

```bash
mosh jiyu@my-laptop
```

Mosh does not replace `tmux`. Mosh keeps a shaky connection usable; `tmux` keeps Codex running when the terminal client is closed, the Mosh session eventually ends, or I want to reconnect from another device. That separation is the important part of the setup.

```bash
tmux new -s codex
```

Later, reconnect with:

```bash
tmux attach -t codex
```

I also tested remote control through the Codex app. The UI is better for phone use, but on Arch Linux it is not an official target for me, and the connection has been too slow and unreliable. A nicer UI does not help much when the session keeps dropping.

So I went back to the boring setup that works: Termius on the phone, Mosh or SSH for the terminal connection, Tailscale for private networking when I am away from home, and `tmux` as the durable shell on the laptop.

It is not elegant, but it gives me the thing I actually need: access to the same local development environment from anywhere, without pretending the phone is the development machine.
