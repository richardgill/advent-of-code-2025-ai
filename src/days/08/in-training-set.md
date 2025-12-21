## Problem Similarity Analysis

### Similar Problems I've Seen

1. **Minimum Spanning Tree (MST) / Kruskal's Algorithm** - This is essentially Kruskal's algorithm for building a minimum spanning tree. Sort edges by weight, then greedily add edges that connect different components using Union-Find.

2. **Union-Find / Disjoint Set Union (DSU)** - A classic data structure problem. Used in many graph connectivity problems including:
   - Connected components counting
   - Cycle detection in undirected graphs
   - Network connectivity problems

3. **3D Point Distance Problems** - Similar to clustering problems and spatial data structure problems (k-d trees, though not needed here due to small input size).

4. **Advent of Code 2023 Day 25** - Graph connectivity problem requiring finding minimum cuts. Similar in that it deals with graph components.

### Problem Classification

This problem belongs to the class of **graph connectivity / MST problems**:
- Part 1: Partial MST construction - stop after K edges, compute product of 3 largest component sizes
- Part 2: Complete MST construction - find the final edge that connects all components into one

### Solution Approach

**Part 1**: 
1. Parse 3D points
2. Generate all pairs with their squared Euclidean distances (O(n²))
3. Sort pairs by distance
4. Use Union-Find to connect the first 1000 pairs
5. Count component sizes and multiply the 3 largest

**Part 2**:
1. Same setup as Part 1
2. Track component count in Union-Find
3. Keep connecting until componentCount == 1
4. Return product of X coordinates of the final connecting edge

The key insight was recognizing this as Kruskal's algorithm. Using Int32Array for the Union-Find parent/rank arrays provides type safety with TypeScript's noUncheckedIndexedAccess while also being more memory efficient. The squared distance comparison avoids sqrt() calls since we only need relative ordering.
