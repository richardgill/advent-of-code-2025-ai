#!/usr/bin/env bash
set -euo pipefail

year=2025
day="${1:?Usage: read-puzzle.sh <day>}"

aoc read -y "$year" -d "$day" | grep -v "Your puzzle answer was" | grep -v "Both parts of this puzzle are complete"
