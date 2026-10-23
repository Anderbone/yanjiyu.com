---
title: "Pi Edge：让 Pi 待在 Obsidian 笔记旁"
description: "我开发的 Obsidian 插件：从手机连接电脑上的 Pi，支持笔记和图片附件、配对及对话历史。"
date: 2026-10-22
author: "Jiyu Yan"
categories: ["Projects"]
tags: ["Obsidian", "Pi", "TypeScript", "Tailscale", "Developer Tools"]
pinned: true
draft: false
---

Pi Edge 将 [Pi 编程智能体](https://pi.dev) 带到手机和桌面端 Obsidian。我可以阅读项目笔记，把它附到对话中，直接与电脑上的 Pi 工作，无需离开笔记。

[安装 Pi Edge](https://community.obsidian.md/plugins/pi-edge) · [源码](https://github.com/Anderbone/pi-obsidian-edge) · [使用指南](https://github.com/Anderbone/pi-obsidian-edge/blob/main/docs/guide.md)

![Galaxy Fold 上 Obsidian 笔记旁的 Pi Edge 对话，已附上笔记](/images/pi-edge-obsidian.webp)

## 为什么做它

我的项目上下文存在 Obsidian：想法、计划、决定和工作笔记。开发工具运行在电脑上。用手机时，把笔记移进终端提示词，再找到结果，会增加不少摩擦。

Pi Edge 把对话放在笔记旁。我可以附上当前笔记、选中文字、其他 Markdown 文件或图片。消息与历史中的笔记附件都可点击，方便回到原文。

## 手机客户端与电脑桥接服务

插件通过 WebSocket 连接电脑上的小型桥接服务。桥接服务在指定工作目录启动 Pi，使用电脑上已配置的模型提供方。电脑端 Obsidian 无需打开。

手机和电脑可以在同一局域网。我出门时用 Tailscale 访问桥接服务。Pi Edge 没有托管中继，也不捆绑模型账号；提示词和附件经过电脑，发送给已配置的模型提供方。

## 每台设备分别配对一次

电脑需要 Node.js 22 或更新版本，以及已安装、完成认证的 Pi CLI。用笔记库目录启动桥接服务：

```sh
npx --yes https://github.com/Anderbone/pi-obsidian-edge/releases/latest/download/pi-edge-bridge.tgz --cwd "/path/to/your/vault"
```

桥接服务会输出私密配对码和二维码。在 Obsidian 1.7.2 或更新版本中安装并启用 Pi Edge，运行 **Pi Edge: Pair computer**，然后运行 **Pi Edge: Open chat**。每台设备独立配对，电脑必须保持唤醒且网络可达。

## 方便回到工作现场

我可以切换 Pi 中配置的模型，在支持时选择推理强度，并重新打开保存的对话。本地历史默认上限为 500 个对话或 50 MB，两者均可调整。

输入区提供 **Read only（只读）**、**Read & write（读写）**和 **Full access（完全访问）**。默认是完全访问，包含 shell 命令。桥接服务可设定工具权限上限；这些选项并不是文件系统沙箱。

短暂断线后，可以重新连接到保留的 Pi 进程。超过保留时间后，桥接服务可以重新打开保存的会话。但这不保证中断的操作已经完成，重复执行前我会检查结果。

## 日常工作区的一部分

我用 [Terminal Spike](/zh/dev/terminal-spike) 访问 Herdr 和远程终端，用 code-server 在浏览器查看代码，用带 Pi Edge 的 Obsidian 处理从笔记开始的工作。链接串起这些视图，Tailscale 让其他设备能访问电脑。

[完整工作流](/zh/dev/workflow-anywhere)介绍了我如何在它们之间切换。
