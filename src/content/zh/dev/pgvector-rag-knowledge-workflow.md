---
title: "通过真实知识工作流理解 pgvector 与 RAG"
description: "从 Markdown 到可检索的 AI 上下文，逐步解释嵌入、pgvector、HNSW 与检索评估。"
date: 2026-06-17
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["AI", "RAG", "PostgreSQL", "pgvector", "Embeddings"]
draft: false
---

RAG 没有听起来那么神秘。

它的全称是 Retrieval-Augmented Generation，即检索增强生成：在让 AI 回答前，先检索相关材料，再将材料交给模型作为上下文。

普通聊天模型依赖训练所得和提示词中的文字。RAG 在中间加入搜索：检索你自己的文档，找到有用片段，再传给回答步骤。

我实现的一套流程，以经过审阅的 `knowledge/` 文件夹为事实来源，包含应用工作流、架构、数据配置和 AI 工具指南。有些页面手写，有些由智能体阅读源码或公开文档后整理。关键是知识先成为经过审核的 Markdown，不能让 AI 凭记忆编造操作手册。

系统将 Markdown 同步为可搜索的数据库记录，拆分片段，为片段生成向量，通过 `pgvector` 存入 PostgreSQL，再运行评估查询，证明重要页面确实能找到。

本文从头解释这个流程，不要求预先了解 AI、数据库、向量或 RAG。

## RAG 解决什么问题

假设向助手提问：

```text
引用表发生变化时，应当如何更新应用规则？
```

助手可能了解一般编程概念，却不会自动知道本地项目的具体约定：哪份 Markdown 负责这个流程、属于哪个知识命名空间、编辑前必须读哪个工具指南、哪些表保存受控值、哪个评估用例证明能检索到页面，以及宣称系统健康前要运行什么命令。

没有检索时，助手只能依据通用训练猜测。有了 RAG，就可以先搜索项目知识库，再引用相关工作流页面作答。这关系到产品信任：流畅的泛泛回答仍可能错误，基于本地材料的回答则能引用来源并遵循本地流程。

## 理解整个流程

1. 撰写或收集知识。
2. 将知识拆成较小片段。
3. 将片段转换为向量。
4. 存储并搜索向量。
5. 评估是否返回正确来源。

片段就是一段文本。这里通常按 Markdown 的 `##` 标题拆分页面，让一个问题能命中相关章节，而不只是整篇长文。

向量是表示含义的一组数字。例如：

```text
database migration drift recovery
```

可能变成：

```text
[0.021, -0.104, 0.337, ...]
```

实际向量更长，当前使用的 `bge-m3` 为每段文字产生 1024 个数字。数字不供人阅读，价值在于意思接近的文字应产生距离较近的向量。因此“恢复被修改的迁移”可能找到写着“migration drift”的页面，即使字面不同。

## PostgreSQL 的职责

PostgreSQL 同时保存普通应用数据与知识索引。普通知识表由 ORM 管理：

```text
app_knowledge_source
app_knowledge_page
app_knowledge_chunk
```

它们记录来源、Markdown 路径、标题、描述、frontmatter、正文、标签、概念键、章节片段、校验和及提取词。

向量则有意单独存储：

```text
public.app_knowledge_chunk_embedding
```

这是一张由 SQL 管理的附属表，每个片段对应一行：

```sql
CREATE TABLE IF NOT EXISTS public.app_knowledge_chunk_embedding (
  chunk_id INTEGER PRIMARY KEY
    REFERENCES public.app_knowledge_chunk(id)
    ON DELETE CASCADE,
  hash_embedding DOUBLE PRECISION[] NOT NULL DEFAULT ARRAY[]::DOUBLE PRECISION[],
  hash_embedding_model TEXT,
  hash_embedding_dimensions INTEGER,
  bge_m3_embedding vector(1024),
  bge_m3_model TEXT NOT NULL DEFAULT 'bge-m3',
  bge_m3_dimensions INTEGER NOT NULL DEFAULT 1024,
  bge_m3_embedded_at TIMESTAMP(3),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

ORM 适合普通应用表，特殊向量索引和扩展 SQL 则未必适合放进 ORM schema。这里让 ORM 管理关系数据，PostgreSQL 与 pgvector 管理向量，应用通过明确的 repository 函数访问，迁移和验证脚本负责检查 SQL 对象。

## pgvector 是什么

[`pgvector`](https://github.com/pgvector/pgvector) 是 PostgreSQL 扩展，添加向量类型及比较运算符。关键列是：

```sql
bge_m3_embedding vector(1024)
```

`1024` 表示每个向量必须有 1024 维，即 1024 个数字。模型输出 768 个数，数据库却要求 1024，说明模型与存储不匹配，不能只当成小警告。

搜索使用余弦距离运算符：

```sql
e.bge_m3_embedding <=> $1::vector
```

意思是将片段向量与查询向量比较，返回距离。距离越小，语义越接近。应用再将距离转成分数，与词法得分合并。

## HNSW 是什么

只有十个片段时可以逐一比较，数十万或数百万个片段时就太慢了。

HNSW 是近似最近邻索引算法，全称 Hierarchical Navigable Small World。可以理解为：先建立向量邻近关系图，搜索时就不必逐个比较全部向量。

```sql
CREATE INDEX IF NOT EXISTS app_knowledge_chunk_embedding_bge_m3_hnsw_idx
ON public.app_knowledge_chunk_embedding
USING hnsw (bge_m3_embedding vector_cosine_ops);
```

`USING hnsw` 指定最近邻索引，`bge_m3_embedding` 是列，`vector_cosine_ops` 指定余弦距离运算。

它是近似搜索：目标是快速找到足够好的邻近项，而不是检查所有行以证明严格数学排序。对交互式 RAG 来说，快速找回有用片段通常是合理取舍。

## 为什么不只用关键词搜索

关键词仍然重要。知识修改后，词法检索也是很好的快速检查。

查询包含 `bge-m3`、`schema.prisma`、`scopeType` 或 `db:verify` 时，精确词语很重要，不该被模糊语义替代。因此系统提供几种模式：

```text
lexical
pgvector_hash
hybrid_bge_m3
auto
all
```

- `lexical`：依据标题、章节、概念键、提取词和正文进行词法评分。
- `pgvector_hash`：旧的确定性哈希向量模式，可验证数据库向量路径，但不是真正的语义模型。
- `hybrid_bge_m3`：用 `bge-m3` 编码查询，搜索向量列，再合并词法分数。
- `auto`：运行时自动选择。神经检索就绪时用混合模式，否则降级；短而精确的查询可优先词法结果。
- `all`：评估时比较所有模式。

不要让向量搜索取代关键词搜索，让两者补足彼此的不足。

## 知识的事实来源

流程从以下目录开始：

```text
knowledge/
```

页面按归属组织：

```text
knowledge/app/rag
knowledge/app/workflows
knowledge/domain/reference
knowledge/data-config
```

维护指南可能在：

```text
knowledge/app/rag/knowledge-maintenance-and-rag-evaluation.md
```

它定义维护契约：选择正确命名空间，补充 YAML 元数据，从相邻索引和工作流建立链接，将受控值保留在审阅过的数据表而非复制到文档；需要可检索时添加评估用例，格式化 Markdown 与 JSON，运行结构检查和词法评估；若涉及神经检索，再回填嵌入并比较各模式。

这是把知识当产品数据维护，而不是一堆散乱笔记。

## Frontmatter 是机器可读元数据

知识页不仅供人阅读，开头还有 YAML：

```yaml
---
title: "Knowledge Maintenance And RAG Evaluation"
description: "Knowledge maintenance and RAG evaluation workflow."
knowledge_type: "app_workflow"
audience: "maintainer"
stability: "workflow"
source_of_truth: "app_documentation"
last_verified_at: 2026-06-16
rag_include: true
rag_namespace: "app"
concept_keys:
  - knowledge_maintenance_workflow
  - rag_evaluation_workflow
---
```

它像文件夹标签，说明页面叫什么、给谁看、是否进入 RAG、所属命名空间和覆盖哪些稳定概念。

`rag_include: true` 表示允许进入检索索引。`rag_namespace` 决定检索范围：应用维护查工作流，领域问题查领域文档，应用配置查数据配置。问题有明确范围时，助手无需搜索整个世界。

## 第一步：收集或撰写知识

第一步仍是高质量写作。无论智能体整理网络材料、维护者阅读代码，还是依据领域知识手写，结果都应成为经过审阅的 Markdown。

RAG 无法把错误内容变正确，它改善的是回答依据。好页面通常包含摘要、适用场景、准确命令、预期证据、常见失败、关联链接、稳定概念键，以及符合应用的术语。

从相邻索引建立链接，也能帮助人导航，并让维护者理解页面归属。

## 第二步：同步到数据库

同步函数扫描 `knowledge/`，读取 Markdown、解析 frontmatter，并存储页面与片段。解析器用 `gray-matter` 读取元数据，识别标题、描述、摘要、`knowledge_type`、标签和概念键；按 `##` 拆分正文，为片段计算校验和，从概念键和反引号代码中提取术语。

每个片段上限为 3200 字符，兼顾聚焦检索与解释完整性。页面写入 `app_knowledge_page`，片段写入 `app_knowledge_chunk`。已移动或删除的页面会标为过期，避免旧记录继续假装有效。

## 第三步：确定性哈希向量

同步时可以本地生成确定性哈希向量：分词、哈希、放入固定长度数组，再归一化。这不是神经嵌入模型，模型名和维度为：

```text
local-hash-embedding-v1
```

```text
64
```

保留它是为了无需调用外部模型，就能稳定测试向量存储、类型转换、比较和排序。它验证基础管道；真正语义检索仍依赖 `bge-m3`。

## 第四步：生成 bge-m3 神经嵌入

这里使用本地 [Ollama](https://ollama.com/)：

```text
KNOWLEDGE_EMBEDDING_PROVIDER=ollama
KNOWLEDGE_EMBEDDING_MODEL=bge-m3
OLLAMA_HOST=http://localhost:11434
KNOWLEDGE_EMBEDDING_DIMENSIONS=1024
```

安装模型：

```sh
ollama pull bge-m3
```

回填命令：

```sh
pnpm run knowledge:backfill-embeddings
```

回填前检查 SQL 对象：

```sh
pnpm run db:verify-managed-sql
```

回填会同步 Markdown、检查向量就绪状态、寻找需要生成嵌入的片段、规范化输入、批量调用 Ollama `/api/embed`、验证每个返回向量有 1024 维、写入附属表，并报告前后状态。

输入会包含页面标题、描述、概念键、章节标题、提取词与正文。孤立段落可能缺乏上下文，例如只写“回填”的小节标题，加入页面标题和概念键后才能表达回填什么。

## 为什么选择 bge-m3

聊天模型生成回答，嵌入模型把文字转成向量。常见选择包括 OpenAI 的 [`text-embedding-3-small`](https://developers.openai.com/api/docs/models/text-embedding-3-small) 与 [`text-embedding-3-large`](https://developers.openai.com/api/docs/models/text-embedding-3-large)、Cohere Embed、Voyage、Google 嵌入、E5，以及 BGE 系列的 small、base、large、[`bge-m3`](https://bge-model.com/bge/bge_m3.html)。

此流程通过 Ollama 本地使用 [`bge-m3`](https://ollama.com/library/bge-m3)，因为私有开发材料无需发送外部 API，模型适合检索，支持密集、稀疏与多向量用途，1024 维也便于在 PostgreSQL 中管理，安装简单。

维度来自模型文档，与数据库 `vector(1024)` 必须匹配。这不是宣称它永远最好，而是适合私有知识库本地、可重复生成嵌入的需求。未来若需托管规模、不同多语言能力或托管监控，可以更换提供方；数据库仍必须记录模型与维度，以发现过期向量。

## 第五步：写入附属表

生成后通过原始 SQL 保存：

```sql
insert into public.app_knowledge_chunk_embedding (
  chunk_id,
  bge_m3_embedding,
  bge_m3_model,
  bge_m3_dimensions,
  bge_m3_embedded_at
)
values ($4, $1::vector, $2, $3, current_timestamp)
on conflict (chunk_id)
do update set
  bge_m3_embedding = excluded.bge_m3_embedding,
  bge_m3_model = excluded.bge_m3_model,
  bge_m3_dimensions = excluded.bge_m3_dimensions,
  bge_m3_embedded_at = excluded.bge_m3_embedded_at,
  updated_at = current_timestamp
```

`on conflict` 表示 upsert，存在则更新，不存在则创建。模型名、维度和实际生成时间与向量同样重要，否则可能混用旧向量、错误模型或错误维度。

## 第六步：运行时搜索

搜索具有范围：

```text
all
app
domain
data_config
```

每个范围映射到一个或多个 `knowledge_type`：

```text
app -> app_workflow, app_codebase
domain -> domain_reference
data_config -> app_config
```

运行时先检查向量就绪状态。通常使用 `hybrid_bge_m3`，短精确查询可优先词法；神经搜索失败时降级到哈希或词法。

本地 Ollama 可能停机，嵌入可能过期，扩展存在也不代表神经向量列已经就绪。产品应尽可能通过词法检索回答，而不是完全失败。

## 混合评分怎样工作

词法评分会分词、去掉小型停用词，比较标题、章节、概念键、提取词和正文。标题及章节命中权重较高，概念键最高，提取词也有帮助。

向量搜索按语义距离排序：

```sql
order by e.bge_m3_embedding <=> $1::vector
```

服务合并两组候选。普通语义查询侧重 `bge-m3`，大量精确术语的查询则侧重词法，例如：

```text
schema.prisma scopeType migration drift bge-m3
```

真实产品文档既要处理自然语言问题，也要处理系统键名查询，两者都很重要。

## 第七步：给 AI 引用，不只是文字

结果包含：

```text
pageId
chunkId
path
title
sectionHeading
```

回答因此能定位到具体页面和章节。引用也方便调试：回答错误时可以检查到底检索了什么。这比向 AI 粘贴巨大提示词更容易维护，因为来源可见。

## 第八步：评估检索

新页面可能挤掉旧页面，移动产生过期路径，同义词缺失、切片边界不佳或模型维度变化，也都可能让 RAG 悄悄退化。检索需要测试。

评估用例可以放在：

```text
app/features/knowledge/test/fixtures/rag-evaluation-cases.json
```

每例包含稳定 `id`、类别、贴近用户的查询、知识类型范围、预期来源路径及可选章节要求：

```json
{
  "id": "migration-drift-recovery",
  "category": "workflow_lookup",
  "query": "recover from modified Prisma migration",
  "knowledgeType": "app_workflow",
  "expectedPaths": [
    "knowledge/app/workflows/prisma-migration-drift.md",
    "knowledge/app/rag/knowledge-maintenance-and-rag-evaluation.md"
  ]
}
```

运行器检查预期页面的位置：

```text
pass_top1
pass_top3
pass_top8
miss
error
```

同时报告平均倒数排名，预期页面越靠前，分数越高。

普通快速检查：

```sh
pnpm run eval:rag -- --mode=lexical --limit=8
```

要声称神经检索有效，则运行：

```sh
pnpm run eval:rag -- --mode=all --limit=8
```

## 如何阅读就绪输出

```text
vector: neuralReady=<bool> model=<model> dimensions=<n> embedded=<n> stale=<n>
```

这一行帮助避免含糊结论。`neuralReady=false` 表示神经路径未就绪；`embedded=0` 表示没有活跃片段具备可用的 `bge-m3` 向量；`stale>0` 表示存在缺失嵌入，或模型、维度不匹配。

“词法检索通过”和“神经嵌入索引就绪”是不同结论，必须分别报告。

## 完整维护流程

知识页或评估用例变化后：

```sh
pnpm exec prettier --write <touched-md-and-json-files>
pnpm run typecheck
pnpm run eval:rag -- --mode=lexical --limit=8
```

需要验证神经检索时：

```sh
pnpm run db:verify-managed-sql
pnpm run knowledge:backfill-embeddings
pnpm run eval:rag -- --mode=all --limit=8
```

回填脚本输出以下 JSON 字段：

```text
synced
before
backfilled
after
```

`backfilled.failed` 大于零表示神经刷新失败。还应扫描 `knowledge/app`、`knowledge/domain` 和 `knowledge/data-config` 的本地链接，检查已移动路径和旧命名空间。断链与过期路径也是检索质量问题。

## 可能出什么错

常见失败往往是普通数据质量问题：一页包办十个流程，导致什么都能命中却答不清；标题太弱，无法形成合理切片；缺少用户实际使用的同义词；知识位于错误命名空间；Markdown 更新但向量仍基于旧文本；模型与数据库维度漂移；评估只期待索引页，真正的流程页始终藏着。

维度不匹配必须明确失败。防线是将 RAG 当作需要维护的索引，而不是魔法。

## 对 AI 产品工作的意义

我更愿意将 RAG 看成产品知识系统。AI 只是最终读者，难点是清楚的来源、归属、元数据、可靠刷新及贴近真实问题的评估。

我会复用这些做法：Markdown 作为人工可编辑事实来源，明确 frontmatter，按真实章节切片，普通内容进入关系表，pgvector 有明确 SQL 边界；私有数据需要留本地时使用本地嵌入；保留词法检索；用 HNSW 扩展最近邻搜索；用用户式查询评估，并将神经就绪与词法成功分别报告。

结果不只是“AI 能回答问题”，而是一套能添加知识、刷新数据库、证明重要查询有效，并知道向量路径是否真正就绪的工作流。散落文档因此成为人和智能体都可搜索、引用与测试的上下文。
