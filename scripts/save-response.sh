#!/bin/bash
set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <day> <filename> <content>" >&2
  exit 1
fi

DAY=$1
FILENAME=$2
CONTENT=$3

DEST="src/days/${DAY}/${FILENAME}"
mkdir -p "src/days/${DAY}"
printf '%s\n' "$CONTENT" > "$DEST"
echo "Saved to $DEST"
