Args: $ARGUMENTS (day part)

Use TodoWrite to create and track progress on these tasks, updating status as each step completes:
1. Run /prep-day if input doesn't exist
2. Solve the part per CLAUDE.md approach (create example files, implement solution). Check if answer is correct: `./scripts/check-answer.sh $ARGUMENTS <answer>`
3. Review solution for readability without compromising approach / performance, add minimal comments for non-obvious code
4. Run `bun local-ci` and fix any issues
