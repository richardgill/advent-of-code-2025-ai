#!/usr/bin/env bash
# Process Claude Code JSONL session file into human-readable markdown
# Usage: process-conversation.sh <output_file> <day> [jsonl_file]
# If jsonl_file is omitted, uses the most recent session from the project directory
set -eu

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

output_file="${1:?Usage: $0 <output_file> <day> [jsonl_file]}"
day="${2:?Usage: $0 <output_file> <day> [jsonl_file]}"
jsonl_file="${3:-$(get_latest_session_file)}"

# Get first and last timestamps for duration
timestamps=$(jq -rs '[.[] | select(.timestamp) | .timestamp]' "$jsonl_file")
first_ts=$(echo "$timestamps" | jq -r 'first')
last_ts=$(echo "$timestamps" | jq -r 'last')

start_epoch=$(date -d "$first_ts" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S" "${first_ts%%.*}" +%s)
end_epoch=$(date -d "$last_ts" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S" "${last_ts%%.*}" +%s)
duration_secs=$((end_epoch - start_epoch))

# Sum token usage from assistant messages
input_tokens=$(jq -s '[.[] | select(.type == "assistant") | .message.usage.input_tokens // 0] | add' "$jsonl_file")
output_tokens=$(jq -s '[.[] | select(.type == "assistant") | .message.usage.output_tokens // 0] | add' "$jsonl_file")
cache_read=$(jq -s '[.[] | select(.type == "assistant") | .message.usage.cache_read_input_tokens // 0] | add' "$jsonl_file")
cache_create=$(jq -s '[.[] | select(.type == "assistant") | .message.usage.cache_creation_input_tokens // 0] | add' "$jsonl_file")

# Get message counts
user_msgs=$(jq -s '[.[] | select(.type == "user")] | length' "$jsonl_file")
assistant_msgs=$(jq -s '[.[] | select(.type == "assistant")] | length' "$jsonl_file")
tool_calls=$(jq -s '[.[] | select(.type == "assistant") | .message.content[]? | select(.type == "tool_use")] | length' "$jsonl_file")
turns=$user_msgs

# Write stats JSON adjacent to output file
stats_file="$(dirname "$output_file")/stats.json"
total_tokens=$((input_tokens + output_tokens))
stats_json=$(jq -n \
  --arg day "$day" \
  --argjson duration_secs "$duration_secs" \
  --argjson user_msgs "$user_msgs" \
  --argjson assistant_msgs "$assistant_msgs" \
  --argjson tool_calls "$tool_calls" \
  --argjson turns "$turns" \
  --argjson input_tokens "$input_tokens" \
  --argjson output_tokens "$output_tokens" \
  --argjson total_tokens "$total_tokens" \
  --argjson cache_read "$cache_read" \
  --argjson cache_create "$cache_create" \
  '{
    day: $day,
    duration_secs: $duration_secs,
    user_msgs: $user_msgs,
    assistant_msgs: $assistant_msgs,
    tool_calls: $tool_calls,
    turns: $turns,
    input_tokens: $input_tokens,
    output_tokens: $output_tokens,
    total_tokens: $total_tokens,
    cache_read_tokens: $cache_read,
    cache_create_tokens: $cache_create
  }')
echo "$stats_json" > "$stats_file"

# Append to project-level stats.jsonl
stats_jsonl="$(dirname "$output_file")/../stats.jsonl"
echo "$stats_json" >> "$stats_jsonl"

{
  echo "# Conversation"
  echo ""
  printf "**Duration:** %dm %ds | **Messages:** %d user, %d assistant | **Tokens:** %d in, %d out (cache: %d read, %d created)\n\n" \
    $((duration_secs / 60)) $((duration_secs % 60)) \
    "$user_msgs" "$assistant_msgs" \
    "$input_tokens" "$output_tokens" "$cache_read" "$cache_create"
  echo "---"
  echo ""
  jq -r '
    select(.type == "user" or .type == "assistant") |
    .type as $msg_type |
    (
      if $msg_type == "user" then
        if .message.content | type == "string" then
          {content: .message.content, has_tool_result: false}
        else
          (.message.content // []) as $items |
          ($items | map(select(.type == "text") | .text) | join("\n")) as $text |
          ($items | map(select(.type == "tool_result") | .content | tostring) | join("\n\n")) as $tool_output |
          if ($text | length) > 0 and ($tool_output | length) > 0 then
            {content: ($text + "\n\n```\n" + $tool_output + "\n```"), has_tool_result: false}
          elif ($tool_output | length) > 0 then
            {content: $tool_output, has_tool_result: true}
          else
            {content: $text, has_tool_result: false}
          end
        end
      else
        {content: ([.message.content[] |
          if .type == "text" then .text
          elif .type == "tool_use" then
            "```bash\n# " + .name + "\n" + (.input | tostring) + "\n```"
          else empty
          end
        ] | join("\n\n")), has_tool_result: false}
      end
    ) |
    .content |= gsub("^\\s+|\\s+$"; "") |
    if (.content | length) == 0 then empty
    elif (.content | startswith("Caveat:")) then empty
    elif (.content | startswith("<command-name>")) then empty
    elif (.content | startswith("<local-command")) then empty
    elif (.content | startswith("Todos have been modified")) then empty
    elif (.content | startswith("Launching command:")) then empty
    else
      (if $msg_type == "assistant" then "## Assistant"
       elif .has_tool_result then "## Tool Output"
       else "## User" end) + "\n\n" + .content + "\n"
    end
  ' "$jsonl_file" | sed '/<system-reminder>/,/<\/system-reminder>/d'
} > "$output_file"

echo "Wrote $output_file, $stats_file, and appended to $stats_jsonl"
