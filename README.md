# Advent of Code 2025 With AI

An experiment in using Claude Code (AI) to solve Advent of Code 2025 puzzles autonomously.


## How It Works

This project uses [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with custom slash commands to solve AoC puzzles.

The AI interacts with problems through 3 scripts:

- `./scripts/read-puzzle.sh` - fetch the puzzle description (answers omitted)
- `./scripts/download-input.sh` - fetch the problem input
- `./scripts/check-answer.sh` - check solution (throttled to once per minute)

To minimize cheating, the agent cannot read `scripts/*` or this README, and doesn't know about the underlying `aoc` CLI.

## Setup

Create a `.env` file with your Advent of Code session cookie:

```
AOC_SESSION=your_session_cookie_here
```

Get your session cookie from the `session` cookie from the chrome dev tools at adventofcode.com after logging in.

## Commands

See [.claude/commands/](.claude/commands/) for command definitions.

### Prompt for `/solve-day <day>` command

1. Run /prep-day if input doesn't exist
2. Run /solve-part for part 1
3. Run /solve-part for part 2

#### /prep-day

Run `./scripts/download-input.sh <day>` then `./scripts/read-puzzle.sh <day>`

#### /solve-part

Use TodoWrite to create and track progress on these tasks, updating status as each step completes:
1. Run /prep-day if input doesn't exist
2. Solve the part per CLAUDE.md approach (create example files, implement solution). Check if answer is correct: `./scripts/check-answer.sh <day> <part> <answer>`
3. Review solution for readability without compromising approach / performance, add minimal comments for non-obvious code
4. Run `bun local-ci` and fix any issues
