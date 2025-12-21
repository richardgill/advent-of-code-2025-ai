## Problem Similarity Analysis

### Similar Problems I've Seen

1. **Maximum Number by Selecting K Digits** - This is a classic greedy algorithm problem. Part 2 is essentially 'Create Maximum Number' (LeetCode 321 variant) where you select k digits from a sequence to form the largest number.

2. **Two Sum / Maximum Pair** - Part 1 is related to finding optimal pairs, though simpler since we just need the max two-digit number from selecting any two positions.

3. **Monotonic Stack Problems** - The greedy selection in Part 2 can also be solved using a monotonic stack approach, similar to 'Remove K Digits' (LeetCode 402).

### Problem Classification

- **Part 1**: Brute force O(n²) enumeration of all pairs - find maximum two-digit number from any two ordered positions
- **Part 2**: Greedy selection algorithm O(n*k) - at each step, pick the largest digit that leaves enough remaining digits

### Solution Approach

**Part 1**: Iterate over all pairs (i, j) where i < j, compute digits[i]*10 + digits[j], track maximum. Simple nested loop.

**Part 2**: Greedy algorithm - for each of the 12 positions to fill:
1. Calculate the search window: from current start position to (length - remaining_to_pick + 1)
2. Find the maximum digit in that window
3. Add it to result and update start position to after the selected digit

The key insight is that at each step, we want the largest possible digit, but we must ensure we leave enough digits remaining to complete our selection. The window shrinks as we progress through the selection.

Used BigInt for Part 2 because 12-digit numbers exceed JavaScript's safe integer range (2^53 - 1 ≈ 9 quadrillion, but 12 nines = 999,999,999,999 which fits, though safer to use BigInt for sums).
