#!/usr/bin/env bash
set -euo pipefail

year="${1:?Usage: read-puzzle.sh <year> <day>}"
day="${2:?Usage: read-puzzle.sh <year> <day>}"

aoc read -y "$year" -d "$day" | grep -v "Your puzzle answer was"
