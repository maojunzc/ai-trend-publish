# 代码图谱 — TrendPublish

> 自动生成于 2026-07-06。包含项目结构、模块依赖关系和核心文件映射。

## 总览

| 指标 | 值 |
|------|-----|
| 总文件数 | 271 个 TypeScript 文件 |
| 总代码量 | ~1.38 MB |
| 主要语言 | TypeScript (100%) |
| 运行时 | Deno v2.7+ |

---

## 分层架构

项目采用 **modular monolith** 架构，从底向上分为 7 层：

```
┌──────────────────────────────────────────┐
│          app / (应用组装层)               │
│  weixin-article / weixin-relay           │
├──────────────────────────────────────────┤
│       features / (业务特征层)             │
│        weixin-article (唯一 feature)      │
├──────────────────────────────────────────┤
│   integrations / (外部服务适配层)          │
│  fetch / image / llm / publish / notify  │
├──────────────────────────────────────────┤
│    core / (核心基础设施与端口定义)          │
│   ports / storage / workflow / logger    │
├──────────────────────────────────────────┤
│   modules / (内部可复用能力)               │
│  md-converter / content-rank / summarizer│
├──────────────────────────────────────────┤
│ platform / (部署平台适配)                 │
│   local / cloudflare (shims)             │
├──────────────────────────────────────────┤
│     utils / config / security / http     │
└──────────────────────────────────────────┘
```

---

## 目录文件分布

### src/ 顶层目录（按文件数降序）

| 目录 | 文件数 | 职责 |
|------|--------|------|
| `features/weixin-article/` | ~60 | 微信文章业务：服务、领域模型、渲染、模板 |
| `integrations/` | ~50 | 外部服务 adapter：LLM / Fetch / Image / Publish / Notify / Vector |
| `modules/` | ~45 | 内部可复用模块：Markdown 转换、内容排序、摘要 |
| `app/weixin-article/` | ~22 | 应用组装：工作流、依赖注入、运行时配置 |
| `core/` | ~30 | 核心基础设施：workflow、ports、storage、logger |
| `utils/` | ~12 | 工具函数：配置解析、HTTP 客户端、安全脱敏、并发控制 |
| `platform/` | ~12 | 平台适配：Cloudflare Workers / 本地 JSON 文件存储 |
| `prompts/` | ~9 | AI prompt 模板：审稿、标题、修订等 |
| `api/` | ~1 | LiveBench API 评级查询 |

### 详细文件树

```
src/
├── index.ts                          # 应用入口
├── server.ts                         # HTTP 服务 (API + Dashboard)
├── release-readiness.test.ts
├── architecture-boundaries.test.ts
│
├── api/
│   └── livebench.api.ts              # LiveBench 评级查询
│
├── app/
│   └── weixin-article/               # 应用组装层 (22 文件)
│       ├── create-weixin-article-dependencies.ts
│       ├── create-local-weixin-article-dependencies.ts
│       ├── local-matrix-runner.ts
│       ├── local-runtime-stores.ts
│       ├── local-workflow.definition.ts
│       ├── notifications.ts
│       ├── weixin-account-relay-check.ts
│       ├── workflow.definition.ts
│       ├── dashboard-*.ts            # Dashboard 相关（3 文件）
│       ├── fetch/                    # 抓取规划 (4 文件)
│       │   ├── article-fetch-planner.ts
│       │   ├── article-fetch-router.ts
│       │   └── ...
│       └── runtime/                  # 运行时配置 API (6 文件)
│           ├── article-runtime-config.service.ts
│           ├── runtime-config-api.ts
│           └── ...
│
├── apps/
│   └── weixin-relay/                 # 微信发布 relay 服务
│       └── server.ts
│
├── controllers/
│   └── cron.ts                       # 定时任务调度器
│
├── core/
│   ├── errors/                       # 错误类型
│   ├── logger/                       # Logger 系统 (4 文件)
│   │   ├── logger.ts
│   │   ├── logger-context.ts
│   │   └── configure-logger-observability.ts
│   ├── observability/                # 可观测性 (2 文件)
│   ├── ports/                        # 接口定义 (15 文件)
│   │   ├── artifact-store.ts
│   │   ├── content-scraper.ts
│   │   ├── editorial-memory-store.ts
│   │   ├── image-generator.ts
│   │   ├── llm.ts
│   │   ├── notifier.ts
│   │   ├── observability.ts
│   │   ├── publish.ts
│   │   ├── run-state-store.ts
│   │   ├── runtime-config-store.ts
│   │   └── vector-store.ts
│   ├── storage/                      # 存储实现 (6 文件)
│   │   ├── memory-artifact-store.ts
│   │   └── article-workflow-schema.ts
│   └── workflow/                     # 工作流引擎 (6 文件)
│       ├── workflow-runtime.ts
│       ├── workflow-step.ts
│       ├── workflow-error.ts
│       ├── workflow-metrics.ts
│       └── local-workflow-runtime.ts
│
├── experiments/
│   └── article-quality/              # 文章质量 A/B 实验 (6 文件)
│       ├── run.ts
│       ├── quality-evaluator.ts
│       ├── research.service.ts
│       └── ...
│
├── features/
│   └── weixin-article/               # 微信文章业务层 (60+ 文件)
│       ├── domain/                   # 领域模型 (10 文件)
│       │   ├── article-source.ts
│       │   ├── article-revision.ts
│       │   ├── quality-review.ts
│       │   └── ...
│       ├── services/                 # 业务服务 (35 文件)
│       │   ├── content-scrape.service.ts
│       │   ├── content-dedup.service.ts
│       │   ├── content-process.service.ts
│       │   ├── article-plan.service.ts
│       │   ├── article-revision.service.ts
│       │   ├── article-cover.service.ts
│       │   ├── article-render.service.ts
│       │   ├── quality-review.service.ts
│       │   ├── quality-gate.service.ts
│       │   ├── editorial-*.service.ts
│       │   ├── dry-run-output.service.ts
│       │   └── ...
│       └── rendering/                # 渲染引擎 (15 文件)
│           ├── article.renderer.ts
│           ├── base.renderer.ts
│           ├── dynamic/              # 动态模板 (5 文件)
│           │   └── dynamic-html.generator.ts
│           └── templates/            # 微信 HTML 模板
│
├── integrations/                     # 外部服务适配 (50 文件)
│   ├── fetch/                        # 数据源抓取
│   │   ├── fetch-provider-registry.ts
│   │   └── providers/                # 15+ 个 provider
│   │       ├── jina/
│   │       ├── firecrawl-scraper.ts
│   │       ├── rsshub-scraper.ts
│   │       ├── hackernews-scraper.ts
│   │       ├── arxiv-search-scraper.ts
│   │       ├── gdelt-scraper.ts
│   │       ├── brave-search-scraper.ts
│   │       ├── twitter-scraper.ts
│   │       └── ...
│   ├── image/                        # 图片生成
│   │   ├── image-generator-resolver.ts
│   │   └── providers/
│   │       ├── aliyun/
│   │       ├── minimax/
│   │       └── text-logo-generator.ts
│   ├── llm/                          # 大语言模型
│   │   ├── llm-provider-resolver.ts
│   │   └── providers/
│   │       └── openai-compatible-llm.ts
│   ├── notify/                       # 通知
│   │   └── providers/
│   │       ├── bark-notifier.ts
│   │       ├── dingding-notify.ts
│   │       └── feishu-notifier.ts
│   ├── publish/                      # 发布
│   │   └── providers/
│   │       ├── weixin-publisher.ts
│   │       └── weixin-relay-publisher.ts
│   └── vector/                       # 向量去重
│       ├── embedding-provider-resolver.ts
│       └── providers/
│           ├── jina/
│           └── openai-compatible-embedding.ts
│
├── modules/                          # 内部可复用模块 (45 文件)
│   ├── content-rank/                 # 内容排序
│   ├── md-converter/                 # Markdown → 微信 HTML
│   │   ├── renderer/
│   │   │   ├── BaseRenderer/
│   │   │   ├── WXRenderer/          # 微信渲染 (12 文件)
│   │   │   └── RednoteRenderer/     # 小红书渲染 (11 文件)
│   │   ├── themes/
│   │   ├── types/
│   │   └── utils/
│   └── summarizer/                   # AI 摘要
│
├── platform/                         # 部署适配
│   ├── cloudflare/                   # Cloudflare Workers
│   │   └── shims/                    # Logger shim (3 文件)
│   └── local/                        # 本地存储 (8 文件)
│       ├── local-artifact-store.ts
│       ├── local-json-run-state-store.ts
│       ├── sqlite-runtime-config-store.ts
│       └── sqlite-editorial-memory-store.ts
│
├── prompts/                          # AI Prompt 模板 (9 文件)
│   ├── article-plan.prompt.ts
│   ├── article-revision.prompt.ts
│   ├── quality-review.prompt.ts
│   ├── title-generator.prompt.ts
│   └── editorial-*.prompt.ts
│
└── utils/                            # 工具函数
    ├── config/                       # TypeScript 配置系统
    │   ├── app-config.ts
    │   └── define-config.ts
    ├── http/
    │   └── http-client.ts
    ├── image/
    │   └── safe-image-downloader.ts
    ├── security/
    │   └── redact.ts
    └── concurrency/
        └── concurrency-limiter.ts
```

---

## 核心依赖关系

### 数据流方向

```
用户输入 (CLI / API / Cron)
    │
    ▼
app/weixin-article/ (工作流编排)
    │
    ▼
features/weixin-article/services/ (业务服务)
    │
    ├──▶ integrations/fetch/ (内容抓取)
    ├──▶ core/ports/ (接口适配)
    │       └── integrations/llm/ (LLM 调用)
    │       └── integrations/image/ (图片生成)
    │       └── integrations/vector/ (向量去重)
    └──▶ modules/md-converter/ (Markdown 渲染)
    │
    ▼
integrations/publish/ (微信发布)
    │
    ▼
platform/local/ 或 platform/cloudflare/ (部署层)
```

### 关键模块依赖

| 模块 | 依赖 | 被依赖 |
|------|------|--------|
| `core/ports/` | 无（纯接口） | 所有上层模块 |
| `core/workflow/` | `core/logger/`, `core/ports/` | `features/`, `app/` |
| `integrations/llm/` | `core/ports/`, `utils/config/` | `features/`, `controllers/` |
| `integrations/fetch/` | `core/ports/`, `utils/config/` | `features/weixin-article/` |
| `features/weixin-article/` | `core/`, `integrations/`, `modules/` | `app/weixin-article/` |
| `app/weixin-article/` | `features/`, `integrations/` | `index.ts`, `cron.ts`, `server.ts` |
| `modules/md-converter/` | `core/logger/` | `features/weixin-article/rendering/` |

---

## 外部服务集成

| 服务类型 | Provider | 是否需要 API Key |
|---------|----------|:---------------:|
| **LLM** | OpenAI-compatible (DeepSeek, 通义, 等) | ✅ 必填 |
| **网页抓取** | FireCrawl | ✅ |
| **网页抓取** | Jina Reader | ✅ |
| **网页搜索** | Brave / Tavily / Exa / Serper / NewsAPI | ✅ |
| **网页抓取** | RSS / RSSHub | ❌ 免费 |
| **网页抓取** | Hacker News / GDELT / arXiv | ❌ 免费 |
| **Twitter/X** | Bearer Token / Xquik | ✅ |
| **图片生成** | 阿里云 DashScope / MiniMax | ✅ |
| **图片生成** | Text Logo Generator | ❌ 内置 |
| **向量去重** | DashScope Embedding / Jina / OpenAI-compatible | ✅ |
| **发布** | 微信公众号 (直连) | ✅ AppID + AppSecret |
| **发布** | 微信 Relay (代理) | ❌ 仅需 Relay Token |
| **通知** | Bark / 钉钉 / 飞书 | ✅ Webhook URL |
| **存储** | 本地文件 / SQLite | ❌ 内置 |
| **存储** | Cloudflare R2 / D1 / KV | ❌ 平台自带 |

---

## CI/CD 流程

```
Git Push / Schedule / Release
    │
    ├── ci-deploy.yml
    │   ├── deno check (类型检查)
    │   ├── Docker build → SCP → SSH deploy
    │   └── Health check verify
    │
    ├── scheduled-article.yml
    │   ├── deno check → config → run workflow
    │   ├── Upload artifact (7天保留)
    │   └── gh release create (自动发布 Release)
    │
    ├── docker-image.yml
    │   └── Docker buildx → Push to GHCR
    │
    └── docs-pages.yml
        └── VitePress build → GitHub Pages
```

---

## 入口文件快速索引

| 功能 | 文件 | 命令 |
|------|------|------|
| 应用入口 | `src/index.ts` | `deno run -A src/index.ts` |
| HTTP 服务 | `src/server.ts` | 含 `/api/health`, `/api/runs`, Dashboard |
| 定时调度 | `src/controllers/cron.ts` | 每 5 分钟检查到期工作流 |
| CLI 入口 | `scripts/task-runner.ts` | `deno task [dev\|article\|doctor\|...]` |
| 工作流运行 | `scripts/run.workflow.ts` | 单次 / matrix / sources-only |
| 微信 Relay | `src/apps/weixin-relay/server.ts` | 固定 IP 微信发布代理 |
| 配置文件 | `trendpublish.config.docker.example.ts` | `cp ... config/trendpublish.config.ts` |
| GitHub Actions | `.github/workflows/` | 5 个工作流 |

---

## 数据存储

| 存储类型 | 本地实现 | Cloudflare 实现 |
|---------|---------|----------------|
| Artifact (HTML/JSON/图片) | 文件系统 (src/temp/) | R2 |
| 运行状态 | JSON 文件 | KV |
| 运行时配置 | SQLite | D1 |
| 编辑记忆 | SQLite | D1 |
| 向量数据 | SQLite | D1 |
