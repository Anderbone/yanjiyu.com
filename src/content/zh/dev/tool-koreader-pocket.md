---
title: "在 KOReader 上使用 Pocket 稍后读"
description: "通过 news2reader 和 OPDS 目录将 Pocket 文章送入 KOReader。"
date: 2024-01-12
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["KOReader", "Pocket", "Self-hosting"]
draft: false
---

Pocket 无法直接与 KOReader 集成，但 [news2reader](https://github.com/BHSPitMonkey/news2reader#news2reader) 可以将 Pocket 文章提供为 OPDS 目录。

相关链接：

- [MobileRead 论坛讨论](https://www.mobileread.com/forums/showthread.php?t=355533)
- [GitHub 上的 news2reader](https://github.com/BHSPitMonkey/news2reader#news2reader)

我把它运行在群晖 NAS 上。服务可访问后，在 KOReader 中添加其 OPDS 地址：

```text
https://pingu:443/opds
```

请按你自己的反向代理或局域网设置修改主机名与端口。
