## Problem Similarity Analysis

**Have I seen similar problems before?**
Yes, this is a well-known problem pattern.

**Specific similar problems:**
- **LeetCode 321 "Create Maximum Number"** - Nearly identical: select k digits from array(s) to form largest number
- **LeetCode 402 "Remove K Digits"** - Inverse problem: remove k digits to form smallest number  
- **LeetCode 1673 "Find the Most Competitive Subsequence"** - Select k elements to form lexicographically smallest subsequence

**Problem class:**
This belongs to the **greedy subsequence selection** class. These problems share a common pattern:
1. Select exactly k elements from a sequence
2. Maintain relative order (can't rearrange)
3. Optimize for some ordering (largest/smallest)

**Solution approach:**
The greedy insight is: for each position i in the result, pick the largest digit from the valid range [startIdx, length - (k - i - 1)]. The upper bound ensures enough digits remain for the remaining positions.

**How I arrived at the solution:**
- Part 1: With only 2 digits to pick, O(n²) brute force is simple and fast
- Part 2: Recognized the greedy pattern from LeetCode problems - iterate through result positions, greedily selecting the best valid digit each time

**Confidence this is in training data:** High - LeetCode 321 and 402 are popular interview questions with many online solutions.
