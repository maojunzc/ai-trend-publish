#!/usr/bin/env bash
# TrendPublish 文章自动生成入口（服务器 cron 用）
# 由系统 crontab  每天 UTC 0/6/12/18 触发

set -euo pipefail

# deno PATH
export PATH="/home/ubuntu/.local/bin:/home/ubuntu/.deno/bin:/usr/bin:/bin"

# 工作目录
cd /home/ubuntu/ai-trend-publish

# 加载 .env 变量
set -a
[ -f .env ] && source .env
set +a

# 日志
LOG_DIR="src/temp/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/cron-$(date +%Y%m%d-%H%M%S).log"

{
  echo "[cron] Start at $(date -Iseconds)"
  echo "[cron] PWD: $(pwd)"
  
  # git pull 最新代码
  git pull --rebase origin master 2>&1 || echo "[cron] git pull skipped or failed"
  
  # 当前 commit
  HEAD=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
  echo "[cron] Commit: $HEAD"
  
  # 运行 dry-run 工作流
  /home/ubuntu/.local/bin/deno run -A scripts/run.workflow.ts --dry-run 2>&1
  
  EC=$?
  echo "[cron] Exit code: $EC at $(date -Iseconds)"
} | tee "$LOG_FILE"

# 清理 30 天前的日志
find "$LOG_DIR" -name "cron-*.log" -mtime +30 -delete 2>/dev/null || true

exit $EC
