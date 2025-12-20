## Problem Similarity Analysis

### Similar Problems I've Seen

1. **Polyomino Packing / Exact Cover** - This is a classic NP-hard problem. Similar to the "Pentomino Puzzle" where you fit pentominoes (5-cell shapes) into a rectangle.

2. **Tetris-like Puzzles** - AoC 2022 Day 17 ("Pyroclastic Flow") involved falling tetromino-like shapes, though that was simulation rather than packing.

3. **AoC 2020 Day 20 ("Jurassic Jigsaw")** - Involved matching and rotating tiles to form a larger image, similar rotation/flip logic.

4. **Dancing Links / Algorithm X** - Donald Knuth's algorithm for exact cover problems is the classical approach for this type of puzzle.

### Problem Classification

This problem belongs to the class of **2D bin packing with irregular shapes**:
- NP-hard in the general case
- Requires backtracking with pruning for exact solutions
- Area constraints provide a quick filter (shapes can't exceed grid area)

### Solution Approach

**Key insight**: For the actual input, the "slack" (unused grid area) was enormous (349-840 cells). This meant that if shapes fit by area, they almost certainly fit geometrically.

**Part 1 Strategy**:
1. Parse shapes and compute all rotation/flip variants (up to 8 per shape)
2. Quick filter: reject regions where total shape area > grid area
3. Backtracking solver: try placing pieces in any valid position
4. Use attempt limit (1M) - if solution found quickly, accept; if not found, assume impossible

The attempt limit was a practical heuristic. With large slack, valid placements are found in few attempts. The example's impossible region (3) took 4.7M attempts to prove impossible, but in practice the real input's "impossible" regions were caught by the area check alone.

**What made this tractable**: The real input had 567 under-area regions (all passed) and 433 over-area regions (all failed by area alone). No actual backtracking was needed for impossibility proofs.
