# Advent of Code 2025 With AI

An experiment in using Claude Code (AI) to solve Advent of Code 2025 puzzles autonomously.

## How It Works

This project uses [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with custom slash commands to solve AoC puzzles.

The AI interacts with problems through 3 scripts:

- `./scripts/read-puzzle.sh` - fetch the puzzle description (answers omitted)
- `./scripts/download-input.sh` - fetch the problem input
- `./scripts/check-answer.sh` - check solution (throttled to once per minute)

To minimize cheating, the agent cannot read `scripts/*` or this README, and doesn't know about the underlying `aoc` CLI.

## Commands

See [.claude/commands/](.claude/commands/) for command definitions.

### Prompt for `/solve-day <year> <day>` command

1. **Prep** (if input doesn't exist)
   - `./scripts/download-input.sh <year> <day>`
   - `./scripts/read-puzzle.sh <year> <day>`

2. **Solve Part 1**
   - Create example files from puzzle examples
   - Implement solution
   - `./scripts/check-answer.sh <year> <day> 1 <answer>`
   - Review solution for readability
   - `bun local-ci` and fix issues

3. **Solve Part 2**
   - Create example files from puzzle examples
   - Implement solution
   - `./scripts/check-answer.sh <year> <day> 2 <answer>`
   - Review solution for readability
   - `bun local-ci` and fix issues
