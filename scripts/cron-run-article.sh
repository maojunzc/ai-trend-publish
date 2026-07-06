#!/usr/bin/env bash
set -euo pipefail
export PATH="/home/ubuntu/.local/bin:/home/ubuntu/.deno/bin:/usr/bin:/bin"
cd /home/ubuntu/ai-trend-publish
set -a; [ -f .env ] && source .env; set +a
LOG_DIR="src/temp/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/cron-$(date +%Y%m%d-%H%M%S).log"
{
  echo "[cron] Start at $(date -Iseconds)"
  echo "[cron] PWD: $(pwd)"
  git pull --rebase origin master 2>&1 || echo "[cron] git pull skipped or failed"
  HEAD=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
  echo "[cron] Commit: $HEAD"
  /home/ubuntu/.local/bin/deno run -A scripts/run.workflow.ts --dry-run 2>&1
  EC=$?
  echo "[cron] Exit code: $EC at $(date -Iseconds)"
} | tee "$LOG_FILE"
find "$LOG_DIR" -name "cron-*.log" -mtime +30 -delete 2>/dev/null || true
exit $EC
