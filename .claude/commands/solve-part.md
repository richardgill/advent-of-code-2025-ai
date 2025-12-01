Args: $ARGUMENTS (year day part)

1. Run /prep-day if input doesn't exist
2. Solve the part per CLAUDE.md approach (create example files, implement solution)
3. Check answer: `./scripts/check-answer.sh $ARGUMENTS <answer>`
4. Review solution for readability without compromising approach / performance, add minimal comments for non obvious code. 
5. Run `bun local-ci` and fix any issues
