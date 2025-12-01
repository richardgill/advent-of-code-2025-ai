#!/usr/bin/env bash
set -euo pipefail

year="${1:?Usage: download-input.sh <year> <day>}"
day="${2:?Usage: download-input.sh <year> <day>}"

day_padded=$(printf "%02d" "$day")

mkdir -p "src/days/${day_padded}.1/data"
mkdir -p "src/days/${day_padded}.2/data"

aoc download -y "$year" -d "$day" --input-only -o -i "src/days/${day_padded}.1/data/input.txt"
cp "src/days/${day_padded}.1/data/input.txt" "src/days/${day_padded}.2/data/input.txt"

echo "Downloaded input to src/days/${day_padded}.1/data/input.txt and src/days/${day_padded}.2/data/input.txt"
