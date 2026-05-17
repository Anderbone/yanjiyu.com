---
title: "How to configure deft pro track ball on Linux"
description: "Linux Xorg configuration notes for the Elecom DEFT Pro trackball."
date: 2022-05-10
author: "Jiyu Yan"
categories: ["Tools"]
tags: ["Linux", "Trackball", "Xorg"]
draft: false
---

I use manjaro here.

 Create a conf file, put it in
 `/usr/share/X11/xorg.conf.d/99-trackball.conf`

Notice the button mapping, instead of number 10, it's 1, which means I use Fn1 button as Left button;
then 2, means at 11 Fn2 button will be used as Middle button.

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
        Option		"MiddleEmulation" "on"
        Option "ButtonMapping" "1 2 3 4 5 6 7 8 9 1 2 12"
EndSection
```

I also found a way to use button lock, so forward button gonna trigger whether we use the ball as a scroll button.
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
