---
title: "Input Chinese pinyin with tones on Linux with fcitx"
description: "A short setup note for typing pinyin with tone marks on Linux using fcitx and Rime."
date: 2024-08-15
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["Linux", "Input Methods", "Rime"]
draft: false
---

The aim is to type pinyin with tones directly like typing Chinese:

nǐ hǎo!

[rime-lumen-pinyin](https://github.com/williampan/rime-lumen-pinyin/tree/master)

I also installed a double pinyin flypy to type Chinese.

Assume you alrady have fcitx on your system. Ibus or fcitx-5 should be similar.

Install [Rime](https://rime.im/). This is the input method.

`yain fcitx-rime`

Install [Plum](https://github.com/rime/plum) to configure Rime.

```
git clone https://github.com/rime/plum.git plum.git
cd plum.git
make
```

As we use fcitx here, we need to run:

`rime_frontend=fcitx-rime bash rime-install`

`bash rime-install double-pinyin`

For the pinyin [github](https://github.com/williampan/rime-lumen-pinyin/tree/master) I copeid the file to
`My home/.config/fcitx/rime/`.

`My home/.config/fcitx/rime/default.custom.yaml`

```yaml
patch:
  schema_list:
    - schema: double_pinyin_flypy
    - schema: lumen_pinyi
```

Restart the input system. Switch to Rime, right click to deploy.

Ctrl + ` to configure the Rime input method, e.g. to use simplified Chinese instead of traditional one.
