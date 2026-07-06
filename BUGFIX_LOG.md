# BUGFIX_LOG

项目修复日志，记录本轮代码审计发现的 Bug 及修复情况。

> 审计工具: ZCode + Senior Developer / Code Reviewer
> 审计期间: 2026-06 ~ 2026-07

---

## 第一批 (2026-07-06)

| ID | 文件 | 严重度 | 问题 | 修复 |
|----|------|--------|------|------|
| B1 | `workflow.ts:684-687` | 🔴 高 | maxRevisionRounds 被 Math.min(2, ...)硬编码上限为2 | 移除硬编码，直接使用用户配置值 |
| B2 | `http-client.ts:84-130` | 🔴 高 | HTTP 4xx 客户端错误被同等重试 | 加入 `>=400 && <500` 判断直接抛出 |
| B3 | `server.ts:622` | 🔴 高 | API Key 被明文打印到 logger.info | 删除日志打印 |
| B4 | `workflow-step.ts:173-176` | 🟡 中 | 无效 delay 格式返回 0ms，无延迟重试 | 改为 1000ms 默认值 |
| B5 | `weixin-relay-publisher.ts:180-188` | 🟡 中 | bytesToBase64 spread 大数组栈溢出风险 | 改用循环逐字符拼接 |
| B6 | `content-dedup.service.ts:70-91` | 🟡 中 | Promise.all + ProgressBar 渲染竞态 | 改为串行执行 |
| B7 | `image-processor.ts:93-97` | 🟢 低 | console.error 改为 Logger | 全局替换 |
| B8 | `local-matrix-runner.ts:121-128` | 🟡 中 | finally 中过早同步父批次状态 | 移出 finally，统一后同步 |
| B9 | `weixin-api-client.ts:109` | 🟢 低 | errcode 检查 if(x && x!==0) 不严谨 | 改为 `!== undefined && !== 0` |
| B10 | `retry.util.ts:67-135` | 🟢 低 | attempts 语义首次为 0 | 首次执行算 1 次 |
| B11 | `define-config.ts:1042` | 🟢 低 | normalizePositiveInteger 对 0 返回 1 | 改为允许 0 |

## 第二批 (2026-07-06)

| ID | 文件 | 严重度 | 问题 | 修复 |
|----|------|--------|------|------|
| B12 | `server.ts:127-155` | 🟡 中 | verifyRequestAuth 字符串 !== 比较非时序安全 | 改为 timingSafeEqual |
| B13 | `redact.ts:3-11` | 🟡 中 | 缺失 refresh_token 等脱敏模式 | 补全正则 |
| B14 | `weixin-publisher.ts:77-111` | 🔴 高 | ensureAccessToken 无并发锁，浪费 token 限额 | 添加 tokenPromise 去重 |
| B15 | `retry.util.ts` | 🟡 中 | 缺 jitter 导致惊群效应 | 添加 ±25% jitter 与 maxDelay |
| B16 | `http-client.ts:128-131` | 🔴 高 | 不 honor Retry-After header | 读取 Retry-After + jitter |
| B17 | `observability.ts:100-102` | 🟢 低 | sanitizeEvent 双重序列化 | 先 stringify 再 redact |
| B18 | `image-processor.ts:54-55` | 🟡 中 | 硬编码 deno.land URL import | 改为 @imagescript 别名 |
