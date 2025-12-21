## Problem Similarity Analysis

### Similar Problems I've Seen

1. **Grid Parsing / 2D Text Processing** - This is a common pattern where you parse a 2D grid of characters and extract structured data. Similar to reading ASCII art representations or parsing tables.

2. **Column-based Data Extraction** - Reading data vertically from columns rather than horizontally from rows. This appears in problems involving rotated or transposed data.

3. **Delimiter-based Grouping** - Identifying groups separated by empty columns/rows. Similar to parsing paragraph-separated text or finding connected components.

### Problem Classification

This problem belongs to the class of **2D grid parsing with custom interpretation**:
- Part 1: Traditional row-based number extraction, where each row contributes one number per problem
- Part 2: Column-based number extraction, where each column contributes one number (digits read top-to-bottom)

### Solution Approach

**Part 1**: 
- Parse the grid into rows
- Identify problem boundaries by finding all-space columns
- For each problem, extract numbers from rows by reading the characters in each column range
- Apply the operator and sum results

**Part 2**: 
- Same grid parsing
- Process columns right-to-left instead of left-to-right
- Each column becomes a number (digits concatenated top-to-bottom)
- The twist was understanding that 'cephalopod math' means each column is a complete number, not each row

The key insight for Part 2 was recognizing that the interpretation of the grid completely changes - instead of numbers spanning multiple columns horizontally, each column IS a number read vertically. This required restructuring the extraction logic from 'collect characters from columns into row-numbers' to 'collect characters from rows into column-numbers'.
