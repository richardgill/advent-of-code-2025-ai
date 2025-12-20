Args: $ARGUMENTS (day part)

Do these steps in order:

1. Use the SlashCommand tool to invoke `/prep-day $ARGUMENTS` 
2. Solve the part per CLAUDE.md approach (create example files, implement solution). Check if answer is correct: `./scripts/check-answer.sh $ARGUMENTS`
3. Use the SlashCommand tool to invoke `/review-part $ARGUMENTS`
4. Run `bun local-ci` and fix any issues
