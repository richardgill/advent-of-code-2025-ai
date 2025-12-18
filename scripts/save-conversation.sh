#!/bin/bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <day>" >&2
  exit 1
fi

DAY=$1
CONVERSATION_FILE=$(get_latest_session_file)
SESSION_ID=$(basename "$CONVERSATION_FILE" .jsonl)

DAY_DIR="src/days/${DAY}/conversation"
mkdir -p "$DAY_DIR"
DEST="$DAY_DIR/$SESSION_ID.jsonl"
cp "$CONVERSATION_FILE" "$DEST"
echo "Saved conversation to $DEST"
