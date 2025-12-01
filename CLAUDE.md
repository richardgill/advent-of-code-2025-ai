
## Runtime

Use Bun instead of Node.js.

- `bun <file>` to run a file 
- Run `bun local-ci` to run lint, tsc and tests to check your work

Part 1 and part 2 solutions are in separate folders (e.g., `src/days/01.1/`, `src/days/01.2/`).


## Approach for solving

Create a todolist: 

1. Download the input e.g. `./scripts/download-input.sh 2025 1`
2. Read the puzzle `./scripts/read-puzzle.sh 2025 1`
3. Solve day 1.
    a. Confirm answer is correct: `./scripts/submit-answer.sh <year> <day> <part> <answer>`
    b. Review your solution. Add very minimal / brief comments for anything magic / not easily understandable. Modify the code for maximum readability without compromising performance / the solution.
    c. Run `bun local-ci` and fix the code.
4. Solve day 2
    a. Confirm answer is correct: `./scripts/submit-answer.sh <year> <day> <part> <answer>`
    b. Review your solution. Add very minimal / brief comments for anything magic / not easily understandable. Modify the code for maximum readability without compromising performance / the solution.
    c. Run `bun local-ci` and fix the code.

Solve part 1 and part 2 separately. 

Create example1.txt/example2.txt from the problem's examples.

Be persistent and solve problems autonomously without human intervention. If a solution doesn't work, keep trying different approaches. Debug failures, fix errors, and iterate until the problem is solved. Don't give up or ask for help unless truly stuck after exhausting multiple strategies.


