---
title: "用 Langfuse 观察 Codex 的 MCP 工具调用"
description: "在本地追踪 Codex MCP 请求、工具执行与评估，不把应用数据发送到云端。"
date: 2026-07-22
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["AI", "Langfuse", "MCP", "Observability", "Self Hosting"]
draft: false
---

假设我有一个小型任务管理应用，提供两个 MCP 工具：

```text
tasks_search     Read matching tasks
task_mark_done   Complete one task after confirmation
```

将 MCP 服务器连接到 Codex 后，我就可以问：

> 找到我标记为“onboarding”、本周到期且尚未完成的任务。

Codex 发现工具、调用 `tasks_search`、接收结果并解释。但出错时，我需要知道更多：选对工具了吗？认证通过了吗？工具是否很慢？返回零条记录，还是执行失败？

[Langfuse](https://langfuse.com/) 提供了这部分运行视图。

## 三个独立部分

1. **Codex** 是 AI 客户端，决定何时调用 MCP 工具。
2. **应用** 负责 MCP 端点、权限、工具和数据库。
3. **Langfuse** 接收应用允许导出的遥测，并显示追踪。

它们仍然是三个独立应用：

[![Codex 通过 MCP 调用应用，应用则异步导出允许的观测元数据到独立自托管 Langfuse 实例](/images/dev/langfuse-mcp-observability-flow.zh.svg)](/images/dev/langfuse-mcp-observability-flow.zh.svg)

工具结果返回 Codex；另一条尽力而为的遥测路径，只将批准的元数据发送给 Langfuse。

Langfuse 不位于 Codex 与应用之间，不代理请求、不调用工具、不读取应用数据库。它停止运行时，MCP 请求仍应正常工作。

另一个限制是：应用侧集成只能观察到达 MCP 服务器的内容，能记录 JSON-RPC 方法与工具执行，却不能自动看到 Codex 中的对话或模型内部过程。应用自己调用模型时，可以单独记录 generation。

## 一次请求是什么样

1. Codex 连接应用的 MCP 端点。
2. 发送 `initialize` 和 `tools/list`。
3. 选择 `tasks_search`。
4. 应用认证请求并校验 JSON-RPC 载荷。
5. MCP 运行时执行只读工具。
6. 应用将结果返回 Codex。
7. 异步向 Langfuse 导出允许的观测信息。
8. 打开追踪，检查状态、耗时和工具元数据。

追踪可以使用简单层级：

```text
mcp.request
└── mcp.json_rpc
    └── tool.execute
```

`tool.execute` 中可能看到：

```json
{
  "toolName": "tasks_search",
  "surface": "mcp",
  "status": "success",
  "durationMs": 42,
  "resultCount": 3
}
```

不应看到原始查询、任务标题和描述、用户身份、API Key 或完整工具结果。追踪应足以解释执行过程，而不成为应用数据的副本。

相关术语：**trace** 是完整请求；**observation/span** 是计时步骤；**generation** 是模型调用观测；**dataset** 是可复用测试集；**score** 记录输出是否符合预期。

## 需要修改代码吗

| 部分                  | 是否修改                  |
| --------------------- | ------------------------- |
| Langfuse 源码         | 不需要                    |
| Codex 的 MCP 使用方式 | 不需要                    |
| 工具业务逻辑          | 通常不需要                |
| 主应用服务器          | 需要，加入 SDK 与观测边界 |
| 云服务                | 本地自托管试点不需要      |

不要在 Langfuse 仓库中加入应用专属代码，正常启动服务并配置项目即可。改动属于应用，因为只有应用知道请求起点、工具执行位置和哪些元数据安全。

一些框架提供[自动集成](https://langfuse.com/docs/observability/sdk/instrumentation)。对于自定义 MCP 服务器，我更愿意在 MCP 路由和共用工具执行器两个边界手动埋点，从而覆盖所有工具，无需逐个修改业务逻辑。

## 最小本地启动

[Langfuse 开源核心](https://langfuse.com/pricing-self-host)可以自托管，不使用 Langfuse Cloud。本地试点没有 Langfuse 使用账单，真实共享部署仍有计算、存储、备份和维护成本。

在 Langfuse 自己的检出目录中启动：

```bash
docker compose up -d
docker compose ps
curl -fsS http://localhost:3000/api/public/ready
```

打开 `http://localhost:3000`，创建项目和项目公钥、私钥，放入应用未被 Git 跟踪的环境文件：

```dotenv
LANGFUSE_ENABLED=1
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=http://localhost:3000
```

`LANGFUSE_ENABLED` 是应用自己的关闭开关，并非 Langfuse 必填设置。

TypeScript 服务端的[官方 SDK 配置](https://langfuse.com/docs/observability/sdk/overview)使用 tracing 与 OpenTelemetry 包：

```bash
pnpm add @langfuse/tracing @langfuse/otel @opentelemetry/sdk-node
```

在仅服务端运行的代码中初始化一次导出器：

```ts
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { NodeSDK } from "@opentelemetry/sdk-node";

const processor = new LangfuseSpanProcessor({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_BASE_URL,
  environment: "development",
  mediaUploadEnabled: false,
});

new NodeSDK({
  spanProcessors: [processor],
}).start();
```

然后包裹共用 MCP 边界。具体框架代码不同，结构如下：

```ts
import { startActiveObservation } from "@langfuse/tracing";

export async function handleMcp(request: Request) {
  return startActiveObservation(
    "mcp.request",
    async (observation) => {
      observation.update({
        metadata: { route: "/mcp", surface: "mcp" },
      });

      return dispatchJsonRpc(request);
    },
    { asType: "span" },
  );
}
```

共用工具执行器创建嵌套子观测：

```ts
export async function executeTool(name: string, args: unknown) {
  return startActiveObservation(
    "tool.execute",
    async (observation) => {
      const result = await toolRegistry[name](args);

      observation.update({
        metadata: {
          toolName: name,
          status: "success",
          resultCount: safeResultCount(result),
        },
      });

      return result;
    },
    { asType: "span" },
  );
}
```

`args` 和 `result` 由工具使用，但不发送给 Langfuse。生产代码还应记录安全的错误类别，正确关闭流式观测，在短命脚本退出前 flush，并保证遥测初始化或导出失败不会导致业务操作执行两次。

## 第一次冒烟测试

先使用合成任务，不使用真实用户数据：

```text
itest-onboarding-1  Write welcome checklist  open
itest-onboarding-2  Review access guide      open
```

让 Codex 搜索合成标签，然后验证：有一个近期 `mcp.request` trace；包含 `mcp.json_rpc` 和 `tool.execute`；工具名、状态、耗时及有界结果数量有用；不包含 API Key、原始参数、任务内容和原始结果；禁用 Langfuse 或停止容器后，MCP 调用仍正常。

最后一点很重要：可观测性描述应用，不应变成使用应用的新前提。

## 从追踪到可重复评估

追踪用于排查一次请求，数据集用于避免问题再次出现。

假设只要求搜索，Codex 却选择 `task_mark_done`。先用合成任务复现，再把请求加入固定评估集。修改模型、提示词或工具说明前，保存确定性预期：

```text
expected tool: tasks_search
write operations: 0
confirmation required: false
result count: 2
```

改进循环变为：

```text
bad trace
→ synthetic reproduction
→ fixed dataset item
→ run current implementation
→ run candidate implementation
→ compare correctness, failures, and latency
```

软件能判断的规则应由软件检查。LLM 评审可以辅助评价清晰度，却不能推翻权限、确认要求和数据库回读结果。

## 实践检查

- 在共享服务端边界埋点，不是每个函数都埋点。
- 追踪名称稳定，避免高基数名称。
- 元数据使用允许列表。
- 默认不记录密钥、原始 MCP 参数和工具结果。
- 区分环境，最初使用合成数据。
- 遥测尽力而为，并提供关闭开关。
- 将重复失败变为固定数据集案例。
- 优先使用确定性评估，再考虑主观模型评分。
- 追踪重要时，备份 PostgreSQL、ClickHouse 与对象存储。

Langfuse 本身不会让 MCP 集成安全。认证、授权、schema 校验、确认与工具行为仍由应用负责。它带来的是一份可读的执行历史，以及把难懂的失败转化为回归测试的路径。
