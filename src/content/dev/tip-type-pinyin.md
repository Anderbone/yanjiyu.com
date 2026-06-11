---
title: "Input Chinese pinyin with tones on Linux with fcitx"
description: "A short setup note for typing pinyin with tone marks on Linux using fcitx and Rime."
date: 2024-08-15
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["Linux", "Input Methods", "Rime"]
draft: false
---

The goal is to type pinyin with tone marks directly from the Linux input method:

```text
nǐ hǎo
```

The schema I used is [rime-lumen-pinyin](https://github.com/williampan/rime-lumen-pinyin/tree/master). I also keep a double-pinyin Flypy schema enabled for normal Chinese input.

This note assumes `fcitx` is already installed. `ibus` or `fcitx5` should be similar, but the paths and frontend name may differ.

Install [Rime](https://rime.im/), the input method engine:

```bash
yay -S fcitx-rime
```

Install [Plum](https://github.com/rime/plum) to configure Rime.

```bash
git clone https://github.com/rime/plum.git plum.git
cd plum.git
make
```

Because this setup uses `fcitx`, run Plum with the `fcitx-rime` frontend:

```bash
rime_frontend=fcitx-rime bash rime-install
bash rime-install double-pinyin
```

Copy the pinyin schema from the GitHub repository into:

```text
~/.config/fcitx/rime/
```

Then edit:

```text
~/.config/fcitx/rime/default.custom.yaml
```

```yaml
patch:
  schema_list:
    - schema: double_pinyin_flypy
    - schema: lumen_pinyi
```

Restart the input system. Switch to Rime, then right-click the input method menu and deploy the configuration.

Use the Rime configuration shortcut to adjust options such as simplified Chinese output:

```text
Ctrl + `
```
