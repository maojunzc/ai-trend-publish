# Code Graph: ai-trend-publish

> 生成时间: 2026-07-06 | 工具: ZCode CodeGraph

---

## 项目概览

| 指标 | 数值 |
|------|------|
| **项目名称** | TrendPublish (ai-trend-publish) |
| **描述** | 微信公众号自动化选题与发布系统 |
| **框架** | Deno 2.x + TypeScript |
| **源文件** | 290 个 `.ts` 文件 |
| **非测试代码行** | ~38,875 行 |
| **架构模式** | Modular Monolith + Ports & Adapters |
| **运行目标** | Local / Docker / Cloudflare Workers |
| **测试框架** | Deno Test + @std/assert |
| **包管理** | Deno imports (`jsr:` / `npm:` / 路径别名) |

---

## 目录结构

```
src/
├── index.ts                     # 入口
├── server.ts                    # HTTP Server + JSON-RPC (623行)
│
├── app/weixin-article/          # 应用组装层
│   ├── workflow.definition.ts   # 工作流定义
│   ├── local-workflow.definition.ts
│   ├── create-weixin-article-dependencies.ts
│   ├── create-local-weixin-article-dependencies.ts
│   ├── fetch/                   # 文章抓取规划
│   │   ├── article-fetch-planner.ts
│   │   ├── article-fetch-planner.test.ts
│   │   ├── article-fetch-router.ts
│   │   └── article-fetch-router.test.ts
│   ├── runtime/                 # 运行时配置
│   │   ├── article-runtime-config.ts
│   │   ├── article-runtime-config.service.ts
│   │   ├── article-runtime-config.test.ts
│   │   └── runtime-config-api.ts
│   ├── dashboard-summary.ts
│   ├── dashboard.html.ts
│   ├── account-insights.ts
│   ├── local-runtime-stores.ts
│   ├── local-matrix-runner.ts
│   ├── matrix-run-summary.ts
│   └── notifications.ts
│
├── apps/weixin-relay/
│   └── server.ts                # 微信发布中继服务
│
├── controllers/
│   ├── cron.ts                  # 定时调度
│   └── workflow.controller.ts   # 手动触发
│
├── core/                        # 基础设施
│   ├── errors/
│   │   └── provider-error.ts    # 供应商错误类型
│   ├── logger/
│   │   ├── logger.ts            # zillalogger 封装
│   │   ├── logger-context.ts    # AsyncLocalStorage
│   │   └── configure-logger-observability.ts
│   ├── observability/
│   │   └── observability.ts     # 可观测性实现
│   ├── ports/                   # 10+ 端口接口定义
│   │   ├── llm.ts               # LLM 接口
│   │   ├── content-scraper.ts   # 内容抓取接口
│   │   ├── content-ranker.ts    # 内容排序接口
│   │   ├── content-publisher.ts # 内容发布接口
│   │   ├── content-summarizer.ts
│   │   ├── artifact-store.ts    # 产物存储接口
│   │   ├── run-state-store.ts   # 运行状态存储
│   │   ├── runtime-config-store.ts
│   │   ├── editorial-memory-store.ts
│   │   ├── image-generator.ts
│   │   ├── notifier.ts
│   │   ├── embedding.ts
│   │   ├── vector-store.ts
│   │   ├── reranker.ts
│   │   └── observability.ts
│   ├── storage/                 # 存储实现
│   │   ├── memory-artifact-store.ts
│   │   ├── memory-run-state-store.ts
│   │   ├── runtime-config-schema.ts (SQL 建表)
│   │   └── runtime-config-utils.ts (Cron 匹配)
│   └── workflow/                # 工作流运行时
│       ├── workflow-runtime.ts  # 接口
│       ├── local-workflow-runtime.ts
│       ├── workflow-step.ts     # 步骤执行 + 重试
│       ├── workflow-error.ts    # 错误类型
│       └── workflow-metrics.ts  # 指标收集
│
├── experiments/article-quality/ # 质量评估实验
│   ├── quality-evaluator.ts
│   ├── report.ts
│   ├── research.service.ts
│   ├── run.ts
│   └── types.ts
│
├── features/weixin-article/     # 业务层 (~42 文件)
│   ├── dependencies.ts
│   ├── workflow.ts              # 主工作流编排 (1179行)
│   ├── workflow.test.ts
│   │
│   ├── domain/                  # 领域模型
│   │   ├── article.ts
│   │   ├── article-plan.ts
│   │   ├── article-revision.ts
│   │   ├── article-source.ts
│   │   ├── editorial-decision.ts
│   │   ├── editorial-topic.ts
│   │   ├── evidence.ts
│   │   ├── quality-review.ts
│   │   └── renderable-article.ts
│   │
│   ├── services/                # 16+ 业务服务
│   │   ├── content-scrape.service.ts
│   │   ├── content-process.service.ts
│   │   ├── content-dedup.service.ts
│   │   ├── editorial-topic.service.ts
│   │   ├── editorial-decision.service.ts
│   │   ├── article-plan.service.ts
│   │   ├── article-research.service.ts
│   │   ├── article-draft.service.ts
│   │   ├── article-render.service.ts
│   │   ├── article-title.service.ts
│   │   ├── article-cover.service.ts
│   │   ├── article-revision.service.ts
│   │   ├── quality-review.service.ts
│   │   ├── quality-gate.service.ts
│   │   ├── article-image-layout.service.ts
│   │   ├── article-content-alignment.service.ts
│   │   ├── account-learning-snapshot.ts
│   │   └── dry-run-output.service.ts
│   │
│   └── rendering/               # 微信 HTML 渲染
│       ├── base.renderer.ts
│       ├── article.renderer.ts
│       ├── template-registry.ts
│       └── dynamic/
│           ├── dynamic-html.generator.ts
│           ├── dynamic-html.generator.test.ts
│           ├── dynamic-html.prompt.ts
│           ├── html-post-processor.ts
│           └── html-post-processor.test.ts
│
├── integrations/                # 外部服务适配器 (~42 文件)
│   ├── fetch/
│   │   ├── scraper-registry.ts
│   │   ├── scraper-type.ts
│   │   └── providers/           # 15 个抓取提供者
│   │       ├── arxiv-search-scraper.ts
│   │       ├── brave-search-scraper.ts
│   │       ├── exa-search-scraper.ts
│   │       ├── firecrawl-scraper.ts
│   │       ├── gdelt-scraper.ts
│   │       ├── hackernews-search-scraper.ts
│   │       ├── jina-reader-scraper.ts
│   │       ├── jina-search-scraper.ts
│   │       ├── jina-deepsearch-scraper.ts
│   │       ├── newsapi-scraper.ts
│   │       ├── rsshub-scraper.ts
│   │       ├── serper-search-scraper.ts
│   │       ├── tavily-search-scraper.ts
│   │       └── twitter-scraper.ts
│   ├── image/
│   │   ├── image-generator-registry.ts
│   │   ├── image-generator-resolver.ts
│   │   └── providers/
│   │       ├── aliyun-image-generator.ts
│   │       ├── aliyun-poster-image-generator.ts
│   │       ├── base-aliyun-image-generator.ts
│   │       ├── minimax-image-generator.ts
│   │       └── text-logo-generator.ts
│   ├── llm/
│   │   ├── llm-provider-registry.ts
│   │   ├── llm-provider-resolver.ts
│   │   └── providers/
│   │       └── openai-compatible-llm.ts
│   ├── notify/
│   │   └── providers/
│   │       ├── bark-notifier.ts
│   │       ├── dingtalk-notifier.ts
│   │       └── feishu-notifier.ts
│   ├── publish/
│   │   └── providers/
│   │       ├── weixin-api-client.ts
│   │       ├── weixin-publisher.ts
│   │       └── weixin-relay-publisher.ts
│   └── vector/
│       ├── embedding-provider-registry.ts
│       ├── embedding-provider-resolver.ts
│       ├── sqlite-vector-store.ts
│       └── providers/
│           ├── jina-embedding-provider.ts
│           ├── jina-reranker-provider.ts
│           └── openai-compatible-embedding.ts
│
├── modules/                     # 内部可复用模块
│   ├── content-rank/
│   │   └── ai.content-ranker.ts
│   ├── md-converter/            # Markdown → 微信 HTML
│   │   ├── renderer/
│   │   │   ├── BaseRenderer/
│   │   │   ├── WXRenderer/
│   │   │   └── RednoteRenderer/
│   │   ├── themes/
│   │   └── types/
│   └── summarizer/
│       └── ai.summarizer.ts
│
├── platform/
│   ├── cloudflare/              # Cloudflare Workers
│   │   ├── cloudflare-bindings.ts
│   │   ├── d1-editorial-memory-store.ts
│   │   ├── d1-runtime-config-store.ts
│   │   ├── d1-vector-store.ts
│   │   ├── kv-artifact-store.ts
│   │   ├── kv-d1-run-state-store.ts
│   │   ├── r2-artifact-store.ts
│   │   ├── worker.ts
│   │   └── shims/
│   └── local/                   # 本地 SQLite
│       ├── local-artifact-store.ts
│       ├── local-json-run-state-store.ts
│       ├── sqlite-editorial-memory-store.ts
│       └── sqlite-runtime-config-store.ts
│
├── prompts/                     # AI 提示词模板
│   ├── account-brand.ts
│   ├── article-plan.prompt.ts
│   ├── article-revision.prompt.ts
│   ├── content-ranker.prompt.ts
│   ├── editorial-decision.prompt.ts
│   ├── editorial-topic.prompt.ts
│   ├── prompt-profile.ts
│   ├── quality-review.prompt.ts
│   └── summarizer.prompt.ts
│
├── registry/
│   └── provider-registry.ts
│
└── utils/
    ├── common.ts
    ├── concurrency/concurrency-limiter.ts
    ├── config/
    │   ├── define-config.ts     # 配置定义与解析 (1056行)
    │   ├── define-config.test.ts
    │   ├── app-config.ts        # 配置加载与校验
    │   └── app-config.test.ts
    ├── http/
    │   └── http-client.ts       # HTTP 客户端 (超时+重试)
    ├── image/
    │   ├── image-processor.ts
    │   ├── safe-image-downloader.ts
    │   └── tests
    ├── llm-output.ts            # LLM 输出解析/清洗
    ├── llm-structured-output.ts # 结构化 JSON 输出
    ├── retry.util.ts            # 重试工具
    ├── security/redact.ts       # 敏感信息脱敏
    └── VectorSimilarityUtil.ts

test/                            # 测试文件 (~58 个)
scripts/                         # CLI 工具脚本
  ├── task-runner.ts
  ├── doctor.ts
  ├── run.workflow.ts
  ├── preview.weixin.ts
  └── ...

dashboard/                       # 前端 (React + Vite)
  └── src/
      ├── api/client.ts
      ├── api/types.ts
      ├── components/
      ├── pages/
      └── hooks/
```

---

## 依赖关系图

```
index.ts
  └── server.ts
       ├── controllers/cron.ts ──────── LocalWorkflowRuntime
       ├── controllers/workflow.controller.ts
       │
       ├── app/weixin-article/
       │   ├── local-runtime-stores.ts ── 工厂函数
       │   ├── local-workflow.definition.ts
       │   ├── workflow.definition.ts
       │   ├── runtime/article-runtime-config.service.ts
       │   ├── runtime/runtime-config-api.ts
       │   ├── account-insights.ts
       │   ├── dashboard-summary.ts
       │   ├── dashboard.html.ts
       │   ├── local-matrix-runner.ts
       │   ├── matrix-run-summary.ts
       │   └── notifications.ts
       │
       ├── core/workflow/
       │   ├── local-workflow-runtime.ts ── MetricsCollector + WorkflowStep
       │   ├── workflow-step.ts ─────────── retry.util + logger-context
       │   └── workflow-metrics.ts
       │
       └── features/weixin-article/workflow.ts
            ├── services/*.ts  (16个服务)
            ├── domain/*.ts    (领域模型)
            └── rendering/     (渲染引擎)
                 ├── template-registry.ts
                 └── dynamic/dynamic-html.generator.ts → LLM

core/
  ├── ports/ ──── 被 integrations/ 的各 adapter 实现
  └── storage/ ── memory-artifact-store, runtime-config-utils
       └── runtime-config-schema.sql

integrations/
  ├── llm/ ───────── openai-compatible-llm.ts → http-client.ts
  ├── fetch/providers/ ── 15个抓取 adapter
  ├── image/providers/ ── aliyun, minimax
  ├── publish/providers/ ── weixin, weixin-relay
  ├── notify/providers/ ── bark, dingtalk, feishu
  └── vector/providers/ ── jina, openai-compatible

platform/
  ├── cloudflare/ ── D1, KV, R2 adapter 实现
  └── local/ ────── SQLite adapter 实现

utils/
  ├── config/ ───── 被所有模块使用
  ├── http/ ─────── 被 integrations 使用
  ├── image/ ────── 被 rendering 使用
  └── security/ ─── 被 http-client, config 使用
```

---

## 数据流

```
用户配置 (trendpublish.config.ts)
    ↓
initializeAppConfig → resolveTrendPublishConfig
    ↓
startServer / startCronJobs
    ↓
WeixinArticleWorkflow.run()
    ├── 1. validate-ip-whitelist
    ├── 2. fetch-sources ──→ ScrapeService.loadSources
    ├── 3. scrape-contents ──→ ScrapeService.scrapeAllDetailed
    ├── 4. dedup-contents ──→ DedupService.deduplicate
    ├── 5. plan-editorial-topics ──→ EditorialTopicService
    ├── 6. rank-contents ──→ ContentRanker
    ├── 7. decide-editorial-strategy ──→ EditorialDecisionService
    ├── 8. process-contents ──→ ProcessService
    ├── 9. research-evidence ──→ ResearchService
    ├── 10. plan-article ──→ ArticlePlanService
    ├── 11. prepare-template-data ──→ RenderService
    ├── 12. draft-article-content ──→ DraftService
    ├── 13. generate-title ──→ TitleService
    ├── 14. generate-cover ──→ CoverService
    ├── 15. render-article-template ──→ RenderService
    ├── 16. review-article-quality ──→ QualityReviewService
    ├── 17. revise-article (optional) ──→ RevisionService
    └── 18. publish-article ──→ Publisher / DryRunOutput
```

---

## 外部依赖

| 来源 | 依赖 | 用途 |
|------|------|------|
| `jsr:` | `@zilla/logger` | 日志系统（上游 + 本地封装） |
| `jsr:` | `@cliffy/command` | CLI 命令解析 |
| `jsr:` | `@std/assert` | 测试断言 |
| `jsr:` | `@db/sqlite` | SQLite 数据库 |
| `jsr:` | `@sapling/markdown` | Markdown 解析 |
| `jsr:` | `@deno-library/progress` | 进度条 |
| `npm:` | `jsonrepair` | JSON 修复 |
| `npm:` | `vitepress` | 文档网站 |
| `npm:` | `vue` | 文档网站 UI |
| `npm:` | `node-cron` | 定时任务 |

---

## 端口接口 (Ports)

```
LLMProvider          ←  integrations/llm/providers/openai-compatible-llm.ts
ContentScraper       ←  integrations/fetch/scraper-registry.ts
ContentRanker        ←  modules/content-rank/ai.content-ranker.ts
ContentPublisher    ←  integrations/publish/providers/weixin-publisher.ts / weixin-relay
ContentSummarizer    ←  modules/summarizer/ai.summarizer.ts
ArtifactStore        ←  platform/*/memory/local/kv/r2
RunStateStore        ←  platform/*/memory/local-json/kv-d1
RuntimeConfigStore   ←  platform/*/sqlite/d1
EditorialMemoryStore ←  platform/*/sqlite/d1 (local,sqlite-d1)
ImageGenerator       ←  integrations/image/providers/aliyun/minimax
Notifier             ←  integrations/notify/providers/bark/dingtalk/feishu
EmbeddingProvider    ←  integrations/vector/providers/jina/openai-compatible
VectorStore          ←  integrations/vector/sqlite-vector-store.ts
ObservabilitySink    ←  core/observability/observability.ts
```

---

## 测试覆盖率

- **测试文件**: ~58 个 `.test.ts`
- **测试框架**: Deno Test
- **测试覆盖领域**:
  - 配置解析 (define-config, app-config)
  - 核心日志/可观测性
  - 领域模型 (article-source)
  - 业务服务 (quality-gate, editorial-topic, article-cover, etc.)
  - 集成服务 (weixin-api-client, minimax, jina-search, image-processor)
  - 工作流运行时
  - MD 转换器
  - LLM 输出解析
  - SQLite 存储
