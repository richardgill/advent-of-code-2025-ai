#!/usr/bin/env bash
# Shared functions for scripts

get_latest_session_file() {
  local project_root project_dir jsonl_file
  project_root="$(cd "$(dirname "${BASH_SOURCE[1]}")/.." && pwd)"
  project_dir="$HOME/.claude/projects/$(echo "$project_root" | sed 's|/|-|g')"
  jsonl_file=$(command ls -t "$project_dir"/*.jsonl 2>/dev/null | head -1)
  if [[ -z "$jsonl_file" ]]; then
    echo "No session files found in $project_dir" >&2
    exit 1
  fi
  echo "$jsonl_file"
}
