---
title: "How to configure the DEFT Pro trackball on Linux"
description: "Linux Xorg configuration notes for the Elecom DEFT Pro trackball."
date: 2022-05-10
author: "Jiyu"
categories: ["Tools"]
tags: ["Linux", "Trackball", "Xorg"]
draft: false
---

This is my Xorg configuration for the Elecom DEFT Pro trackball on Manjaro.

Create this configuration file:

```text
/usr/share/X11/xorg.conf.d/99-trackball.conf
```

The important part is `ButtonMapping`. In the first mapping, button `10` is remapped to `1`, so `Fn1` acts as the left button. Button `11` is remapped to `2`, so `Fn2` acts as the middle button.

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

I also use a second version with scroll-button lock. This makes the forward button toggle scroll mode while the ball handles scrolling.

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
