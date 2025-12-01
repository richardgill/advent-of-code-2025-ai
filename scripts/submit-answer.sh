#!/usr/bin/env bash
set -euo pipefail

year="${1:?Usage: submit-answer.sh <year> <day> <part> <answer>}"
day="${2:?Usage: submit-answer.sh <year> <day> <part> <answer>}"
part="${3:?Usage: submit-answer.sh <year> <day> <part> <answer>}"
answer="${4:?Usage: submit-answer.sh <year> <day> <part> <answer>}"

aoc submit -y "$year" -d "$day" "$part" "$answer"
