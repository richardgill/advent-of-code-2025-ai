## Problem Similarity Analysis

### Similar Problems I've Seen

1. **Lights Out Puzzle** - Part 1 is essentially the classic Lights Out puzzle, where pressing a button toggles certain lights. The goal is to reach a target state with minimum presses. This is a well-known problem that reduces to linear algebra over GF(2) (binary field).

2. **AoC 2015 Day 18 (Game of Life with Lights)** - Similar grid-based light toggling, though that was cellular automata rather than button-based.

3. **Integer Linear Programming (ILP)** - Part 2 is a classic ILP problem: minimize sum of non-negative integer variables subject to linear equality constraints (Ax = b).

4. **Coin Change Problem** - Part 2 has similarities to the coin change problem where you need to make exact change with minimum coins, except here each "coin" (button) affects multiple "denominations" (counters) simultaneously.

### Problem Classification

- **Part 1**: Linear algebra over GF(2) / XOR-based toggle problem. The key insight is that pressing a button twice is equivalent to not pressing it, so each button is either pressed 0 or 1 times. This makes it a subset-sum problem over GF(2).

- **Part 2**: Integer Linear Programming with minimum L1-norm objective. We need to find non-negative integer solutions to a system of linear equations that minimize the total sum.

### Solution Approach

**Part 1**: Recursive search with memoization. For each button, try either pressing it or not pressing it. Since each button affects the state via XOR, pressing twice cancels out. The search space is 2^n where n is the number of buttons, but with good pruning it's fast enough.

**Part 2**: Gaussian elimination to Reduced Row Echelon Form (RREF) over rationals, then iterate over free variables. The RREF gives us a parameterized solution space. For each assignment of free variables (within bounds), we can compute the basic variables and check if they're non-negative integers. The key insight is that the number of free variables is typically small (difference between number of buttons and rank of the coefficient matrix), so even with large target values, the iteration is tractable.
