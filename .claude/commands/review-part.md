Args: $ARGUMENTS (day part)

Review `src/days/<day>/part-<part>/*.ts` for clarity and readability.
Day is zero-padded (e.g., day 1 part 1 → `src/days/01/part-1/`).

## Guidelines

- Write clean, idiomatic code
- Don't use unusual syntax to work around style rules
- If it helps readiblity, extract small helper functions when:
  - Logic is reused
  - A function exceeds ~15 lines
  - It makes the main function's intent clearer
- Prefer declarative patterns (`.filter().length`) over imperative loops when equally readable
- Only add comments for non-obvious logic

Check your work with `bun local-ci`
