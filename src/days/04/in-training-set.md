## Problem Similarity Analysis

### Similar Problems I've Seen

1. **Game of Life / Cellular Automata** - This problem shares the core mechanic of counting neighbors in a grid using the 8-directional adjacency pattern. The threshold-based rule (fewer than 4 neighbors) is reminiscent of Conway's Game of Life rules.

2. **Flood Fill / Connected Components** - Part 2's iterative removal process is conceptually similar to peeling layers from a shape, like reverse flood fill or erosion in image processing.

3. **Grid-based Neighbor Counting** - Many AoC problems involve 2D grids with 4 or 8 directional neighbors (day counting, mine detection patterns).

### Problem Classification

This problem belongs to the class of **grid simulation with neighbor counting**:
- Part 1: Static analysis - count cells meeting a neighbor threshold
- Part 2: Iterative simulation - repeatedly apply a removal rule until fixpoint

### Solution Approach

**Part 1**: Simple grid traversal. For each '@' cell, count the 8 adjacent '@' neighbors. If count < 4, it's accessible. Sum all accessible cells.

**Part 2**: Iterative removal simulation. Convert the grid to a mutable 2D array. In each iteration:
1. Find all currently accessible rolls (< 4 neighbors)
2. Remove them all simultaneously (mark as '.')
3. Repeat until no more accessible rolls exist
4. Sum all removed counts

The key insight for Part 2 was recognizing that removal must happen in batches - all accessible rolls at a given step are removed before recalculating. This creates a cascading effect where removing outer layers exposes inner cells that become accessible in subsequent rounds.
