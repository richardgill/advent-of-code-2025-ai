#!/usr/bin/env bash
set -euo pipefail

year="${1:?Usage: submit-answer.sh <year> <day> <part> <answer>}"
day="${2:?Usage: submit-answer.sh <year> <day> <part> <answer>}"
part="${3:?Usage: submit-answer.sh <year> <day> <part> <answer>}"
answer="${4:?Usage: submit-answer.sh <year> <day> <part> <answer>}"

# Rate limiting: 1 minute between submissions
lockfile="/tmp/aoc-submit-ratelimit"
now=$(date +%s)

if [[ -f "$lockfile" ]]; then
  last=$(cat "$lockfile")
  elapsed=$((now - last))
  if [[ $elapsed -lt 60 ]]; then
    remaining=$((60 - elapsed))
    echo "Rate limited. Waiting ${remaining}s..." >&2
    sleep "$remaining"
  fi
fi

date +%s > "$lockfile"

# Fetch correct answer from solved puzzle
correct=$(aoc read -y "$year" -d "$day" | grep "Your puzzle answer was" | sed -n "${part}p" | sed 's/.*Your puzzle answer was \(.*\)\..*/\1/')

if [[ -z "$correct" ]]; then
  echo "Error: Could not find answer for part $part. Puzzle may not be solved yet on adventofcode.com" >&2
  exit 1
fi

if [[ "$answer" == "$correct" ]]; then
  echo "Correct!"
  exit 0
else
  echo "Wrong answer."
  exit 1
fi
