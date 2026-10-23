---
title: "在 Linux 上用 fcitx 输入带声调的拼音"
description: "用 fcitx 与 Rime 直接输入带声调拼音的简短配置记录。"
date: 2024-08-15
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["Linux", "Input Methods", "Rime"]
draft: false
---

目标是从 Linux 输入法直接打出带声调的拼音：

```text
nǐ hǎo
```

我用的是 [rime-lumen-pinyin](https://github.com/williampan/rime-lumen-pinyin/tree/master)，日常中文输入则同时启用小鹤双拼。

本文假设已经安装 `fcitx`。`ibus` 或 `fcitx5` 应当类似，但路径和前端名称可能不同。

安装 [Rime](https://rime.im/) 输入法引擎：

```bash
yay -S fcitx-rime
```

安装配置工具 [Plum](https://github.com/rime/plum)：

```bash
git clone https://github.com/rime/plum.git plum.git
cd plum.git
make
```

这里使用 `fcitx`，所以以 `fcitx-rime` 前端运行 Plum：

```bash
rime_frontend=fcitx-rime bash rime-install
bash rime-install double-pinyin
```

将 GitHub 仓库中的拼音方案复制到：

```text
~/.config/fcitx/rime/
```

再编辑配置文件：

```text
~/.config/fcitx/rime/default.custom.yaml
```

```yaml
patch:
  schema_list:
    - schema: double_pinyin_flypy
    - schema: lumen_pinyi
```

重启输入系统，切换到 Rime，右键打开输入法菜单并部署配置。

使用 Rime 配置快捷键调整简体中文输出等选项：

```text
Ctrl + `
```
