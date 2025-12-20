#!/usr/bin/env bash
set -euo pipefail

STATS_FILE="${1:-src/days/stats.jsonl}"
REPO_URL=$(gh repo view --json url -q '.url')

jq -rs --arg repo "$REPO_URL" '
def pad($n): tostring | if length < $n then (([range($n - length)] | map(" ") | add) + .) else . end;

def format_duration:
  if . >= 3600 then
    "\(. / 3600 | floor):\(((. % 3600) / 60 | floor) | tostring | if length == 1 then "0" + . else . end):\(. % 60 | tostring | if length == 1 then "0" + . else . end)"
  else
    "\(. / 60 | floor):\(. % 60 | tostring | if length == 1 then "0" + . else . end)"
  end;

def format_num:
  def go: if length <= 3 then [.] else [.[-3:]] + (.[:-3] | go) end;
  tostring | explode | go | map(implode) | reverse | join(",");

def make_link($day):
  "[View](\($repo)/tree/solved/src/days/\($day).2)";

def row($day; $dur; $msgs; $tokens; $tools; $link):
  "| \($day | pad(3)) | \($dur | tostring | pad(8)) | \($msgs | tostring | pad(8)) | \($tokens | tostring | pad(7)) | \($tools | tostring | pad(5)) | \($link) |";

def summary_row($label; $dur; $msgs; $tokens; $tools):
  "| \($label | pad(3)) | \($dur | tostring | pad(8)) | \($msgs | tostring | pad(8)) | \($tokens | tostring | pad(7)) | \($tools | tostring | pad(5)) |        |";

# Calculate summaries
(map(.duration_secs) | add) as $tot_dur |
(map(.turns) | add) as $tot_msgs |
(map(.output_tokens) | add) as $tot_tokens |
(map(.tool_calls) | add) as $tot_tools |
length as $count |

# Header
"| Day | Duration | Messages |  Tokens | Tools | Link   |",
"|-----|----------|----------|---------|-------|--------|",

# Data rows
(.[] | row(.day; (.duration_secs | format_duration); .turns; (.output_tokens | format_num); .tool_calls; make_link(.day))),

# Separator
"|-----|----------|----------|---------|-------|--------|",

# Summary rows
summary_row("TOT"; ($tot_dur | format_duration); $tot_msgs; ($tot_tokens | format_num); $tot_tools),
summary_row("AVG"; (($tot_dur / $count) | floor | format_duration); (($tot_msgs / $count) | floor); (($tot_tokens / $count) | floor | format_num); (($tot_tools / $count) | floor)),
summary_row("MIN"; (map(.duration_secs) | min | format_duration); (map(.turns) | min); (map(.output_tokens) | min | format_num); (map(.tool_calls) | min)),
summary_row("MAX"; (map(.duration_secs) | max | format_duration); (map(.turns) | max); (map(.output_tokens) | max | format_num); (map(.tool_calls) | max))
' "$STATS_FILE"
