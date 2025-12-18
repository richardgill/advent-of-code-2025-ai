# Advent of Code 2025 With AI

An experiment in using Claude Code (AI) to solve Advent of Code 2025 puzzles automatically.

> Note: You should solve advent of code yourself by hand. Here are [Eric, the Advent of Code creator's thoughts on solving it with AI](https://adventofcode.com/about#faq_ai).

## Results

See the [solved branch](https://github.com/richardgill/advent-of-code-2025-ai/tree/solved/src/days) for solutions and statistics.

## How It Works

This project uses [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with custom slash commands to solve AoC puzzles.

The AI interacts with problems through 3 scripts:

- `./scripts/read-puzzle.sh` - fetch the puzzle description (answers omitted)
- `./scripts/download-input.sh` - fetch the problem input
- `./scripts/check-answer.sh` - check solution (throttled to once per minute)

To minimize cheating, the agent cannot read `scripts/*` or this README, doesn't know about the underlying `aoc` CLI and cannot use `WebSearch` or `WebFetch` tools.

## Important

**Please be respectful of [adventofcode.com](https://adventofcode.com).** The scripts include rate limiting, but avoid excessive requests. [Eric Wastl](https://was.tl/) creates these puzzles with incredible care and creativity every year - Advent of Code is a gift to the programming community. Don't abuse it.

## Setup

`mise install` which will install [aoc-cli](https://github.com/scarvalhojr/aoc-cli)

Add a `aoc-session.txt` file with your Advent of Code session cookie:

   ```
   echo "your_session_cookie_here" > aoc-session.txt
   ```

   Get your session cookie from adventofcode.com: open browser dev tools → Application → Cookies → copy the `session` value.


You can then solve all the days using `scripts/solve-year.sh`. **warning** this will use a lot of tokens!

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
