#!/usr/bin/env bash
set -e

if [[ -n $(git status --porcelain) ]]; then
  echo "Error: Git working directory is not clean. Commit or stash changes first."
  exit 1
fi

START_DAY=${1:-1}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Stop hook that auto-exits Claude 2s after task completion (kills parent process)
SETTINGS='{"hooks":{"Stop":[{"hooks":[{"type":"command","command":"sleep 2; kill $PPID"}]}]}}'

for day in $(seq $START_DAY 12); do
  echo "=== Solving Day $day ==="
  day_padded=$(printf "%02d" "$day")
  claude --settings "$SETTINGS" "/solve-day $day" || true

  "$SCRIPT_DIR/process-conversation.sh" "src/days/${day_padded}/conversation.md" "$day_padded"
  echo ""
done
