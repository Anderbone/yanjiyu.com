---
title: "Python String functions for leetcode"
description: "Python string methods useful for LeetCode practice."
date: 2020-08-22
author: "Jiyu"
categories: ["Leetcode"]
tags: ["Python", "String", "Leetcode Summary"]
draft: false
---

- `print(f'best RF score: {grid.best_score_:.3f}')`
- `str.index(sub[,start[,end]])`
- `str.strip()` remove spaces at the beginning and the end
    - `strip(str-not-want)`
- `lower()`
    - print(str.upper())
    - print(str.lower())
    - print(str.capitalize())     # Only first letter big
    - print(str.title())          # This Is A Title
- `s.find(c),  s.rfind(c)`
    - "hello".find("l") -> 2
    - "hello".rfind("l") -> 3
- `s.split('')`
    - `a = ''.join(a.split())`
        - remove blank
- `replace(old, new[, max])`
- `''.join(str(e) for e in list)`
    - list to str
- `s.isdigit()`, `s.isalpha`
    - `s.isalnum()`  # is num or alpha
    - if i.lstrip('-').isdigit():  check number<0
- ord , chr
    - `ord('A')`  get 65
    - `chr(65)`  get A
    - `a = (chr(ord('0') + x % 10))`  x:123 get: str type '3'
