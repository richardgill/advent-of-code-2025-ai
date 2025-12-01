## Approach

Be persistent and solve problems autonomously without human intervention. If a solution doesn't work, keep trying different approaches. Debug failures, fix errors, and iterate until the problem is solved. Don't give up or ask for help unless truly stuck after exhausting multiple strategies.

## Runtime

Use Bun instead of Node.js.

- `bun <file>` to run a file
- `bun test` to run tests
- `bun install` to install dependencies

Part 1 and part 2 solutions are in separate folders (e.g., `src/days/01.1/`, `src/days/01.2/`).

Problems: https://adventofcode.com/2025/day/{day}. Read the problem first. Solve part 1 and part 2 separately. Create example1.txt/example2.txt from the problem's examples. I will provide input.txt.

## aoc-cli

Download puzzles and submit answers via `aoc` (installed via mise).

```bash
# Read puzzle directly in terminal
./scripts/read-puzzle.sh 2025 1

# Download input to both part 1 and part 2 folders
./scripts/download-input.sh 2025 1

# Submit answer (part 1 or 2)
aoc submit -d 1 -y 2025 1 <answer>
aoc submit -d 1 -y 2025 2 <answer>
```
