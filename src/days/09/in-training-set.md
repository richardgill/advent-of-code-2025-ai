## Problem Similarity Analysis

### Similar Problems I've Seen

1. **Maximum Rectangle in Grid** - Part 1 is essentially finding the maximum area rectangle where two points define opposite corners. Classic O(n^2) pair iteration problem.

2. **Polygon Fill / Scanline Algorithms** - Part 2 is closely related to rectilinear polygon fill algorithms used in computer graphics. The scanline algorithm for determining which pixels are inside a polygon is a standard technique.

3. **Advent of Code 2023 Day 18 (Lavaduct Lagoon)** - Similar rectilinear polygon problem involving computing area and filling interior points.

4. **Point-in-Polygon Testing** - The core challenge in Part 2 was determining if a rectangle lies entirely within a rectilinear polygon, which relates to ray casting and even-odd fill rules.

### Problem Classification

- **Part 1**: Brute force geometry - O(n^2) point pair enumeration with simple area calculation
- **Part 2**: Computational geometry with polygon fill - required understanding of:
  - Rectilinear polygon representation (vertical/horizontal edges)
  - Scanline algorithm with proper endpoint handling (minY < y <= maxY convention)
  - Range merging for efficient row coverage checking

### Solution Approach

**Part 1**: Simple - iterate all point pairs, compute rectangle area as (|dx|+1)*(|dy|+1).

**Part 2**: The key insight was that checking every tile individually would be too slow for coordinates up to 100k. Instead:
1. Build edge representation (vertical/horizontal edges)
2. Identify critical y-values where polygon structure changes
3. For each critical y, compute valid x-ranges using scanline with proper endpoint convention
4. Store ranges with nextY pointers for efficient rectangle validation
5. To validate a rectangle, jump between critical y-values checking if each row is covered

The trickiest part was the endpoint handling for the scanline - using minY < y <= maxY convention to properly count crossings at corners.
