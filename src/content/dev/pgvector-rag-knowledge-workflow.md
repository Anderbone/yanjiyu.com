---
title: "pgvector and RAG, Explained Through a Real Knowledge Workflow"
description: "A plain-English walkthrough of how Markdown knowledge pages become searchable AI context using embeddings, pgvector, HNSW, and evaluation checks."
date: 2026-06-17
author: "Jiyu Yan"
categories: ["Engineering"]
tags: ["AI", "RAG", "PostgreSQL", "pgvector", "Embeddings"]
draft: false
---

RAG sounds more mysterious than it is.

The name means Retrieval-Augmented Generation. That is a long way to say: before asking an AI model to answer, first retrieve the most relevant source material, then give that material to the model as context.

A normal chat model answers from what it already learned during training, plus whatever text you paste into the prompt. RAG adds a search step in the middle. The system searches your own documents, finds the most useful pieces, and passes those pieces into the answer step.

One workflow I built uses a reviewed `knowledge/` folder as the source of truth. It contains app workflow notes, architecture notes, data configuration docs, and AI tool guides. Some pages are manually written. Some are gathered and drafted with an agent after reading source code or public documentation. The important part is that the knowledge is reviewed and stored as Markdown first. The AI does not get to invent the operating manual from memory.

The system then turns those Markdown pages into searchable database records, splits each page into chunks, creates vectors for those chunks, stores them in PostgreSQL through `pgvector`, and runs evaluation queries to make sure important pages can actually be found.

This post explains the whole workflow from the beginning, assuming you know nothing about AI, databases, vectors, or RAG.

## The Problem RAG Solves

Imagine asking an assistant:

```text
How should I update an application rule when a reference table changes?
```

The assistant might know general programming concepts, but it does not automatically know the local project rules:

- which Markdown page owns that workflow
- which namespace the knowledge belongs to
- which tool guide must be read before editing
- which database tables hold controlled values
- which evaluation fixture proves the page is findable
- which commands must run before saying the RAG system is healthy

Without retrieval, the assistant is guessing from general training. With RAG, the assistant can first search the project's own knowledge base, retrieve the relevant workflow page, and answer from that source.

The difference is product trust. A generic answer may sound polished but still be wrong. A retrieved answer can cite the local page and follow the local process.

## The Mental Model

The RAG workflow has five main stages:

1. Write or gather knowledge.
2. Break the knowledge into smaller chunks.
3. Convert each chunk into a vector.
4. Store and search those vectors.
5. Evaluate whether search returns the right sources.

A chunk is just a piece of text. In this workflow, a Markdown page is usually split by `##` headings. A long page becomes several searchable sections. That matters because a user question may only match one section of a page, not the whole page.

A vector is a list of numbers that represents meaning. For example, a model may turn this text:

```text
database migration drift recovery
```

into something like this:

```text
[0.021, -0.104, 0.337, ...]
```

The real vector is much longer. The current neural embedding model, `bge-m3`, produces 1024 numbers per text. The exact numbers are not meant for humans to read. They are useful because similar text should produce nearby vectors.

So if the user asks about "recovering from a modified migration", the system may still find a page that says "migration drift". The words are not identical, but the meaning is close.

## What PostgreSQL Does Here

PostgreSQL stores the normal application data, and it also stores the knowledge index.

The normal knowledge tables are ORM-managed:

```text
app_knowledge_source
app_knowledge_page
app_knowledge_chunk
```

Those tables store human-readable information:

- where a knowledge page came from
- the Markdown path
- title and description
- frontmatter
- body text
- tags and concept keys
- section chunks
- checksums
- extracted terms

The vector storage is intentionally separate:

```text
public.app_knowledge_chunk_embedding
```

That table is a SQL-owned sidecar table. It has one row per chunk and stores embedding data:

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

This boundary is important. An ORM is excellent for normal app tables, but special vector indexes and extension-owned SQL can be awkward to keep inside an ORM-managed schema. A practical pattern is to keep the normal content model in the ORM and put the pgvector-specific storage behind raw SQL.

That is a deliberate engineering trade-off:

- the ORM owns ordinary relational data
- PostgreSQL and pgvector own vector search storage
- app services call the vector table through explicit repository functions
- migrations and verification scripts check the SQL objects

## What pgvector Is

[`pgvector`](https://github.com/pgvector/pgvector) is a PostgreSQL extension. PostgreSQL does not normally have a "vector of 1024 floating point numbers" type for semantic search. `pgvector` adds that type and the operators needed to compare vectors.

The important column looks like this:

```sql
bge_m3_embedding vector(1024)
```

The `1024` means every stored vector must have 1024 dimensions. A dimension is one number in the list. If a model returns 768 numbers and the database expects 1024, that is not a small warning. It means the model and database do not match.

The search query uses pgvector's cosine-distance operator:

```sql
e.bge_m3_embedding <=> $1::vector
```

In plain English, that means:

```text
Compare the stored chunk vector with the query vector and return the distance.
```

Lower distance means closer meaning. The app then turns distance into a score and merges it with lexical scoring.

## What HNSW Is

If there are only ten chunks, PostgreSQL can compare the query vector with every chunk. If there are hundreds of thousands or millions of chunks, that becomes slow.

HNSW is an index algorithm for approximate nearest-neighbor search. The name stands for Hierarchical Navigable Small World. The name is not helpful at first, so the simpler mental model is this:

```text
HNSW builds a map of nearby vectors so the database does not have to compare every vector one by one.
```

An HNSW index can be created like this:

```sql
CREATE INDEX IF NOT EXISTS app_knowledge_chunk_embedding_bge_m3_hnsw_idx
ON public.app_knowledge_chunk_embedding
USING hnsw (bge_m3_embedding vector_cosine_ops);
```

The important pieces are:

- `USING hnsw` says to build an HNSW nearest-neighbor index.
- `bge_m3_embedding` is the vector column being indexed.
- `vector_cosine_ops` says the index is for cosine-style similarity.

HNSW is approximate. That means it is designed to find very good nearest neighbors quickly, not to prove an exact mathematical ordering by checking every possible row. For a RAG system, that is usually the right trade-off. The goal is to retrieve useful source chunks quickly enough for an interactive assistant.

## Why Not Just Use Keyword Search?

Keyword search is still useful. In fact, lexical retrieval is a good required fast gate for knowledge changes.

Lexical search means searching by words and terms. If the query says `bge-m3`, `schema.prisma`, `scopeType`, or `db:verify`, exact words matter. A vector model may understand semantic similarity, but exact product terms, table keys, and code identifiers should not be blurred away.

That is why the workflow uses several retrieval modes:

```text
lexical
pgvector_hash
hybrid_bge_m3
auto
all
```

`lexical` is term-based chunk retrieval. It scores matches in the title, section heading, concept keys, extracted terms, and chunk text.

`pgvector_hash` is a legacy deterministic hash-vector mode. It is useful for checking that the database vector path works, but it is not a real semantic embedding model.

`hybrid_bge_m3` is the meaningful neural retrieval mode. It embeds the user's query with `bge-m3`, searches the `pgvector` column, then merges those semantic hits with lexical scores.

`auto` is the runtime behavior. It uses neural hybrid retrieval when the system is ready, but falls back when it is not ready. For very short exact lookups, it can prefer lexical results.

`all` is an evaluation mode that compares all the modes.

This is a good pattern: do not make vector search replace keyword search. Let each method cover the other's weakness.

## The Knowledge Source of Truth

The workflow starts with Markdown files under:

```text
knowledge/
```

The pages are grouped by ownership:

```text
knowledge/app/rag
knowledge/app/workflows
knowledge/domain/reference
knowledge/data-config
```

A maintenance page might live at:

```text
knowledge/app/rag/knowledge-maintenance-and-rag-evaluation.md
```

That page defines the maintenance contract. When knowledge changes, the maintainer must:

1. Choose the correct namespace.
2. Add or update YAML frontmatter.
3. Link the page from nearby index and workflow pages.
4. Keep controlled values in reviewed data tables, not copied into Markdown.
5. Add or adjust RAG evaluation cases when the page should be findable.
6. Format Markdown and JSON.
7. Run local structural checks and lexical RAG evaluation.
8. Backfill embeddings and compare modes if neural retrieval is part of the claim.

This is boring in the best way. It treats knowledge as product data, not as a loose pile of notes.

## Frontmatter Is Metadata for Machines

A knowledge page is not only text for humans. It has YAML frontmatter before the title:

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

For a non-technical reader, think of frontmatter as the label on a folder. It tells the system:

- what the page is called
- who it is for
- whether it should be included in RAG
- what knowledge namespace it belongs to
- which stable concepts it covers

The `rag_include: true` field matters. It says this page is allowed into the retrieval index.

The `rag_namespace` matters too. A question about app maintenance should search app workflow docs. A question about domain reference data should search domain docs. A question about app-specific data configuration should search data config docs.

This reduces noise. The assistant does not need to search the whole world when the user is asking a scoped question.

## Step 1: Gather or Write the Knowledge

The first step is still human-quality writing.

Sometimes an agent gathers information from online sources. Sometimes the maintainer reads product code. Sometimes the maintainer writes a page manually from domain knowledge. In all cases, the output should become a reviewed Markdown page.

That review step matters because RAG does not make bad content good. If the source page is wrong, the retrieved answer will still be wrong. RAG improves grounding, not truth itself.

The best knowledge pages usually include:

- a summary
- when to use the workflow
- exact commands
- expected evidence
- common failure modes
- cross-links to related pages
- stable concept keys
- local terminology that matches the app

This is why the knowledge maintenance page says to link the page from nearby index and workflow pages. Links help humans navigate, and they also help maintainers understand where a page belongs.

## Step 2: Sync Markdown Into the Database

The sync function scans the `knowledge/` directory, reads Markdown files, parses the frontmatter, and stores searchable pages and chunks.

The parser does a few key things:

- reads frontmatter with `gray-matter`
- finds the page title and description
- extracts a summary
- reads `knowledge_type`, `tags`, and `concept_keys`
- splits the body into chunks by `##` headings
- calculates a checksum for each chunk
- extracts useful terms from concept keys and backticked code terms

The chunk size cap is 3200 characters. That is small enough to retrieve focused sections, but large enough to keep a useful explanation together.

The sync step stores each page in `app_knowledge_page` and its chunks in `app_knowledge_chunk`.

It also marks missing pages as stale. That means if a Markdown page is moved or removed, the old database row should not keep pretending to be active.

## Step 3: Build a Deterministic Hash Vector

The workflow can create a local deterministic hash vector for each chunk during Markdown sync.

This is not the same as a neural AI embedding. It tokenizes the text, hashes each token, places it into a fixed-length numeric array, and normalizes the numbers. The model name is:

```text
local-hash-embedding-v1
```

The dimension count is:

```text
64
```

Why keep this if `bge-m3` exists?

Because it gives the database vector path a stable local test mode without calling an external embedding model. It is useful plumbing. It can prove that vectors can be stored, cast, compared, and ranked through PostgreSQL.

But for semantic search, the important path is `bge-m3`.

## Step 4: Generate Neural Embeddings With bge-m3

The neural embedding provider uses local [Ollama](https://ollama.com/):

```text
KNOWLEDGE_EMBEDDING_PROVIDER=ollama
KNOWLEDGE_EMBEDDING_MODEL=bge-m3
OLLAMA_HOST=http://localhost:11434
KNOWLEDGE_EMBEDDING_DIMENSIONS=1024
```

The local setup command is:

```sh
ollama pull bge-m3
```

The backfill command is:

```sh
pnpm run knowledge:backfill-embeddings
```

Before backfill, the verification command checks the SQL objects:

```sh
pnpm run db:verify-managed-sql
```

The backfill process does this:

1. Sync Markdown into the database.
2. Check current vector readiness.
3. Find chunks that need embeddings.
4. Normalize each chunk into embedding text.
5. Send batches to Ollama's `/api/embed` endpoint.
6. Validate that each returned vector has 1024 numbers.
7. Store the vector in `public.app_knowledge_chunk_embedding`.
8. Report before and after status.

The normalized embedding text includes:

- page title
- description
- concept keys
- section heading
- extracted terms
- chunk text

That is intentional. A bare paragraph may not contain enough context. If a chunk only says "Backfill" as a heading, adding the title and concept keys helps the embedding model understand what kind of backfill it is.

## Why bge-m3?

Embedding models are not the same as chat models. A chat model writes answers. An embedding model turns text into vectors.

Common embedding choices in modern RAG systems include:

- OpenAI [`text-embedding-3-small`](https://developers.openai.com/api/docs/models/text-embedding-3-small) or [`text-embedding-3-large`](https://developers.openai.com/api/docs/models/text-embedding-3-large)
- Cohere Embed
- Voyage embeddings
- Google text embeddings
- E5-family open models
- BGE-family open models such as `bge-small`, `bge-base`, `bge-large`, and [`bge-m3`](https://bge-model.com/bge/bge_m3.html)

This workflow uses [`bge-m3`](https://ollama.com/library/bge-m3) locally through Ollama because it is practical for private development data:

- it runs locally
- it avoids sending internal knowledge pages to an external API
- it is designed for retrieval work across dense, sparse, and multi-vector use cases
- it returns 1024-dimensional vectors, which are manageable in PostgreSQL
- it is easy to install with Ollama

The 1024-dimensional output is also documented by BGE model references, which matters because the database column is defined as `vector(1024)`.

This is not a claim that `bge-m3` is always the best model. It is the right kind of model for this workflow because the system needs local, repeatable embedding generation for a private knowledge base.

If the system later needed hosted scale, stronger multilingual behavior, or managed monitoring, the provider boundary could be changed. The database would still need to know the model name and dimension count so stale embeddings can be detected.

## Step 5: Store Embeddings in the Sidecar Table

When a chunk embedding is ready, the service writes it with raw SQL:

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

The `on conflict` part means the operation is an upsert. If the chunk already has an embedding row, update it. If not, create it.

The metadata is as important as the vector:

- `bge_m3_model` records which model generated it.
- `bge_m3_dimensions` records vector length.
- `bge_m3_embedded_at` records that the chunk was actually embedded.

Without this metadata, the system could accidentally mix old vectors, wrong models, or wrong dimensions.

## Step 6: Search at Runtime

When a user or tool asks a knowledge question, the app runs a search.

The search has a scope:

```text
all
app
domain
data_config
```

Each scope maps to one or more `knowledge_type` values. For example:

```text
app -> app_workflow, app_codebase
domain -> domain_reference
data_config -> app_config
```

The runtime search checks vector readiness first.

If neural search is ready, it usually uses `hybrid_bge_m3`. For short exact lookups, lexical can win first. If neural search fails, the system falls back to pgvector hash search or lexical search.

That fallback behavior is important. A local Ollama service may be down. Embeddings may be stale. The pgvector extension may be available but the neural column may not be ready. The product should still answer from lexical retrieval where possible instead of failing completely.

## How Hybrid Scoring Works

Hybrid scoring means the final result is not only vector distance and not only keyword score.

The lexical scorer tokenizes the query, removes small stop words, and checks:

- page title
- section heading
- concept keys
- extracted terms
- chunk text

Matches get extra weight when they appear in important places:

- title matches are strong
- heading matches are strong
- concept key matches are strongest
- extracted term matches also help

The vector search returns chunks ordered by semantic distance:

```sql
order by e.bge_m3_embedding <=> $1::vector
```

Then the service merges the two candidate lists. For normal semantic queries, the `bge-m3` score gets more weight. For exact-term-heavy queries, lexical score gets more weight.

An exact-term-heavy query is something like:

```text
schema.prisma scopeType migration drift bge-m3
```

Those terms should not be smoothed into vague semantic similarity. Exact text matters.

This hybrid behavior is one of the most important lessons from the implementation. In real product docs, users ask both human-language questions and exact system-key questions. A good retrieval system must handle both.

## Step 7: Give the AI Citations, Not Just Text

Search results include citations:

```text
pageId
chunkId
path
title
sectionHeading
```

That means the answer can be grounded in a specific page and section. A citation is not only for display. It is also useful for debugging. If the assistant gives a bad answer, the maintainer can inspect which chunks were retrieved.

This is the main reason RAG is more maintainable than pasting a giant prompt into the AI. The system can show which source material influenced the answer.

## Step 8: Evaluate Retrieval

A RAG system can silently get worse. New pages can compete with old pages. A moved page can leave a stale path behind. A synonym can be missing. A chunk boundary can hide the useful paragraph. A vector model can change dimensions.

Retrieval should be tested.

The evaluation fixture can live at:

```text
app/features/knowledge/test/fixtures/rag-evaluation-cases.json
```

Each case has:

- a stable `id`
- a `category`
- a user-like `query`
- a `knowledgeType` scope
- expected source paths
- optional section expectations

A simple example shape is:

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

The evaluation runner searches each query and checks where the expected page appears:

```text
pass_top1
pass_top3
pass_top8
miss
error
```

It also reports mean reciprocal rank. In plain English, that number rewards expected pages appearing near the top.

The normal fast gate is:

```sh
pnpm run eval:rag -- --mode=lexical --limit=8
```

If neural retrieval is part of the claim, run:

```sh
pnpm run eval:rag -- --mode=all --limit=8
```

## Reading the Readiness Output

The evaluation output includes a vector status line:

```text
vector: neuralReady=<bool> model=<model> dimensions=<n> embedded=<n> stale=<n>
```

This line prevents vague claims.

If it says:

```text
neuralReady=false
```

then the neural path is not ready. You can still say lexical evaluation passed, but you cannot say neural RAG is healthy.

If it says:

```text
embedded=0
```

then no active chunks have usable `bge-m3` vectors.

If it says:

```text
stale>0
```

then some chunks are missing embeddings or were embedded with a different model or dimension count.

This distinction matters. "The docs are searchable by lexical matching" and "the neural embedding index is ready" are different claims.

## The Full Maintenance Workflow

After changing knowledge pages or RAG fixtures, the expected workflow is:

```sh
pnpm exec prettier --write <touched-md-and-json-files>
pnpm run typecheck
pnpm run eval:rag -- --mode=lexical --limit=8
```

If neural retrieval must be verified:

```sh
pnpm run db:verify-managed-sql
pnpm run knowledge:backfill-embeddings
pnpm run eval:rag -- --mode=all --limit=8
```

The backfill script prints JSON with:

```text
synced
before
backfilled
after
```

If `backfilled.failed` is greater than zero, the neural refresh failed.

There are also local Markdown checks:

- scan local links under `knowledge/app`, `knowledge/domain`, and `knowledge/data-config`
- scan for stale moved paths and old namespace references

Those checks sound ordinary, but they are part of RAG quality. Broken links and stale paths make the knowledge system harder to maintain, and eventually they show up as bad retrieval.

## What Can Go Wrong

The most common RAG failures are not exotic AI failures. They are normal data quality failures.

A page may be too broad. If one page covers ten workflows, search may retrieve it for everything but answer nothing directly.

A page may have weak headings. Since this workflow chunks by `##` headings, headings affect retrieval boundaries.

A page may miss important synonyms. If users say "migration drift" but the page only says "modified migration", the vector model may help, but a direct synonym in the text or concept keys is still useful.

A page may be in the wrong namespace. A data config workflow stored as app codebase knowledge may be harder to retrieve through the right scoped tool.

Embeddings may be stale. If the Markdown changed but the vector row still comes from old text, semantic retrieval can point to the wrong chunk.

The model and database dimensions may drift. If the model returns 1024 dimensions and the database expects 768, backfill must fail loudly.

Evaluation can be too weak. If every expected path is an index page, the test may pass while the direct workflow page remains hidden.

The guardrail is to treat RAG as a maintained index, not as magic.

## Why This Matters for AI Product Work

RAG is often presented as an AI feature. I think of it more as a product knowledge system.

The AI part is only the final reader. The harder work is making sure the organization has clear source pages, good ownership, correct metadata, reliable refresh steps, and evaluation cases that reflect real user questions.

The implementation has a few lessons I would reuse:

- keep Markdown as the human-editable source of truth
- make frontmatter explicit enough for machines
- split pages into chunks that match real sections
- store normal content in normal relational tables
- keep pgvector storage behind a deliberate SQL boundary
- use local embeddings when private development data should stay local
- keep lexical search even after adding semantic search
- use HNSW for scalable nearest-neighbor search
- test retrieval with user-like queries
- report neural readiness separately from lexical success

The result is not just "AI can answer questions". The result is a workflow where maintainers can add knowledge, refresh the database, prove important queries still work, and know whether the neural vector path is genuinely ready.

That is the real value of RAG in a product app. It turns scattered documentation into searchable, cited, testable context for both humans and AI agents.
