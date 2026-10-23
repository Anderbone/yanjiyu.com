---
title: "在 Linux 上配置 DEFT Pro 轨迹球"
description: "Elecom DEFT Pro 轨迹球在 Linux Xorg 下的配置记录。"
date: 2022-05-10
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["Linux", "Trackball", "Xorg"]
draft: false
---

这是我在 Manjaro 上使用的 Elecom DEFT Pro 轨迹球 Xorg 配置。

创建配置文件：

```text
/usr/share/X11/xorg.conf.d/99-trackball.conf
```

关键是 `ButtonMapping`。第一版把按钮 `10` 映射为 `1`，让 `Fn1` 充当左键；按钮 `11` 映射为 `2`，让 `Fn2` 充当中键。

```text
Section "InputClass"
        # DEFT PRO Buttons:
        #    1: Left button
        #    2: Middle button (wheel click)
        #    3: Right button
        #    4: Wheel scroll up
        #    5: Wheel scroll down
        #    6: Wheel tilt left
        #    7: Wheel tilt right
        #    8: Back button
        #    9: Forward button
        #   10: Fn1 (button on the left of the ball)
        #   11: Fn2 (button on right most)
        #   12: Fn3 (button on the above of the slide switch)
        Identifier      "Elecom DEFT Pro Trackball"
        MatchProduct    "DEFT Pro TrackBall"
    Driver          "libinput"
        Option          "ScrollMethod" "button"
        Option          "ScrollButton" "9"
        Option        "MiddleEmulation" "on"
        Option          "ButtonMapping" "1 2 3 4 5 6 7 8 9 1 2 12"
EndSection
```

我还用过带滚动按钮锁定的第二版。前进按钮用于切换滚动模式，再通过转动轨迹球滚动。

```text
Section "InputClass"
# DEFT PRO Buttons:
# 1: Left button
# 2: Middle button (wheel click)
# 3: Right button
# 4: Wheel scroll up
# 5: Wheel scroll down
# 6: Wheel tilt left
# 7: Wheel tilt right
# 8: Back button
# 9: Forward button
# 10: Fn1 (button on the left of the ball)
# 11: Fn2 (button on right most)
# 12: Fn3 (button on the above of the slide switch)
Identifier "Elecom DEFT Pro Trackball"
MatchProduct "DEFT Pro TrackBall"
Driver "libinput"
Option "ScrollMethod" "button"
Option "ScrollButton" "9"
Option "ScrollButtonLock" "true"
Option "MiddleEmulation" "on"
Option "ButtonMapping" "1 2 3 4 5 6 7 8 12 1 2 9"
EndSection
```
