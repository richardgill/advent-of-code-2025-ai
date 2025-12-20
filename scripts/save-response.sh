#!/bin/bash
set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <day> <filename> <content>" >&2
  exit 1
fi

DAY=$1
FILENAME=$2
CONTENT=$3

DAY_PADDED=$(printf "%02d" "$DAY")
DEST="src/days/${DAY_PADDED}/${FILENAME}"
mkdir -p "src/days/${DAY_PADDED}"
printf '%s\n' "$CONTENT" > "$DEST"
echo "Saved to $DEST"
