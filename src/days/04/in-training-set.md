## Reflection on Day 4

**Have I seen similar problems before?**

Yes, this is a classic **cellular automata / Game of Life style** problem. The pattern of checking neighbors in a grid and making decisions based on neighbor counts is very common in:

1. **Conway's Game of Life** - the most famous example where cells live/die based on neighbor counts
2. **Minesweeper** - counting adjacent mines
3. **Image processing** - convolution kernels that examine neighboring pixels
4. **Flood fill algorithms** - though those typically use 4-connectivity rather than 8

**Problem class:**

This falls into the **grid traversal with neighbor counting** category. Part 2 adds an **iterative simulation** aspect where the grid state changes and we repeat until a fixed point (no more changes possible).

**How I arrived at the solution:**

1. **Part 1**: Straightforward - iterate through grid, for each '@', count adjacent '@' symbols using 8-directional neighbors, increment count if < 4 neighbors.

2. **Part 2**: Recognized this as a **fixed-point iteration** problem. Keep removing accessible rolls until none remain. The key insight is that removing rolls can make previously inaccessible rolls accessible, so we need to repeat until convergence.

**Key implementation decisions:**
- Used a mutable grid (string[][]) for Part 2 since we need to modify state
- Collected all accessible rolls in each round, then removed them all at once (batch removal)
- Used a while loop with the accessible count as the termination condition

The problem is simple conceptually but requires careful attention to grid boundaries and the 8-directional neighbor check.
