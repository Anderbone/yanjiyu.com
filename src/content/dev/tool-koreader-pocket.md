---
title: "Use Pocket (read it later) on KOReader"
description: "How to send Pocket articles to KOReader through news2reader and an OPDS catalog."
date: 2024-01-12
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["KOReader", "Pocket", "Self-hosting"]
draft: false
---

Pocket does not integrate with KOReader directly, but [news2reader](https://github.com/BHSPitMonkey/news2reader#news2reader) can expose Pocket articles as an OPDS catalog.

Useful links:

- [MobileRead forum thread](https://www.mobileread.com/forums/showthread.php?t=355533)
- [news2reader on GitHub](https://github.com/BHSPitMonkey/news2reader#news2reader)

I run it on my Synology NAS. After the service is reachable, add its OPDS endpoint in KOReader:

```text
https://pingu:443/opds
```

Change the hostname and port to match your own reverse proxy or local network setup.
