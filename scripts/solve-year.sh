#!/usr/bin/env bash
set -e

if [[ -n $(git status --porcelain) ]]; then
  echo "Error: Git working directory is not clean. Commit or stash changes first."
  exit 1
fi

START_DAY=${1:-1}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for day in $(seq $START_DAY 12); do
  echo "=== Solving Day $day ==="
  day_padded=$(printf "%02d" "$day")

  # Stop hook: check if day is fully solved, exit 2 if not, otherwise kill parent after 2s
  SETTINGS="{\"hooks\":{\"Stop\":[{\"hooks\":[{\"type\":\"command\",\"command\":\"$SCRIPT_DIR/check-answer.sh $day 1 >/dev/null 2>&1 && $SCRIPT_DIR/check-answer.sh $day 2 >/dev/null 2>&1 || exit 2; sleep 2; kill \$PPID\"}]}]}}"

  claude --settings "$SETTINGS" "/solve-day $day" || true

  "$SCRIPT_DIR/process-conversation.sh" "src/days/${day_padded}/conversation" "$day_padded"
  echo ""
done
