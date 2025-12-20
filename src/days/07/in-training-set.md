## Problem Similarity Analysis

### Similar Problems I've Seen

1. **Binary Tree Path Counting** - This problem is structurally similar to counting paths through a binary tree where each splitter creates a binary choice (left/right).

2. **Grid Simulation with Beam Propagation** - Similar to Advent of Code 2023 Day 16 ("The Floor Will Be Lava") which involved simulating beams bouncing around a grid with mirrors and splitters.

3. **Pascal's Triangle / Combinatorics** - The timeline branching pattern resembles Pascal's triangle where each cell is the sum of the two cells above it.

### Problem Classification

This problem belongs to the class of **grid simulation with state propagation**:
- Part 1: Track unique positions (Set-based), count events (splits)
- Part 2: Track multiplicities (Map with counts), sum terminal states (timelines)

### Solution Approach

**Part 1**: Simple simulation using a Set to track unique beam column positions. When a beam hits a splitter, remove it and add left/right positions. Count each split event.

**Part 2**: Instead of tracking just positions, track the *count* of timelines at each position using a Map<column, count>. When timelines branch at a splitter, both children inherit the parent's count. This avoids exponential blowup by aggregating identical states. Used BigInt because the number of timelines can grow very large (2^n for n splitters in the worst case).

The key insight for Part 2 was recognizing that while Part 1 merged beams at the same position (Set behavior), Part 2 needed to preserve the count of distinct paths that led to each position (Map with accumulation).
