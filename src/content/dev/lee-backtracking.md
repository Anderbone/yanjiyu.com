---
title: "leetcode questions: Backtracking"
description: "Backtracking templates and LeetCode examples."
date: 2021-10-11
author: "Jiyu"
categories: ["Leetcode"]
tags: ["Backtracking", "DFS", "Leetcode Summary"]
draft: false
---

### Template

```py
def backtrack(candidate):
    if find_solution(candidate):
        output(candidate)
        return

    # iterate all possible candidates.
    for next_candidate in list_of_candidates:
        if is_valid(next_candidate):
            # try this partial candidate solution
            place(next_candidate)
            # given the candidate, explore further.
            backtrack(next_candidate)
            # backtrack
            remove(next_candidate)
```

### [17. Letter Combinations of a Phone Number ](https://yanjiyu.com/leetcode/17-letter-combinations-of-a-phone/)

> Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.
> A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.
> Input: "23"
> Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].

```py
class Solution(object):
    def letterCombinations(self, digits):
        def backTracking(digits, carry):
            if digits == []:
                res.append(carry)
                return

            number = digits[0]
            for j in dic[number]:
                backTracking(digits[1:], carry + j)

        if not digits:
            return []
        digits = list(digits)
        res = []
        dic = {'2': "abc", '3': "def", '4': "ghi", '5': "jkl", '6': "mno", '7': "pqrs", '8': "tuv", '9': "wxyz"}
        backTracking(digits, '')
        return res
```

**Code:**

```java
class Solution {
    private List<String> combinations = new ArrayList<>();
    private Map<Character, String> letters = Map.of(
        '2', "abc", '3', "def", '4', "ghi", '5', "jkl",
        '6', "mno", '7', "pqrs", '8', "tuv", '9', "wxyz");
    private String phoneDigits;

    public List<String> letterCombinations(String digits) {
        // If the input is empty, immediately return an empty answer array
        if (digits.length() == 0) {
            return combinations;
        }

        // Initiate backtracking with an empty path and starting index of 0
        phoneDigits = digits;
        backtrack(0, new StringBuilder());
        return combinations;
    }

    private void backtrack(int index, StringBuilder path) {
        // If the path is the same length as digits, we have a complete combination
        if (path.length() == phoneDigits.length()) {
            combinations.add(path.toString());
            return; // Backtrack
        }

        // Get the letters that the current digit maps to, and loop through them
        String possibleLetters = letters.get(phoneDigits.charAt(index));
        for (char letter: possibleLetters.toCharArray()) {
            // Add the letter to our current path
            path.append(letter);
            // Move on to the next digit
            backtrack(index + 1, path);
            // Backtrack by removing the letter before moving onto the next
            path.deleteCharAt(path.length() - 1);
        }
    }
}
```

### [22. Generate Parentheses](https://yanjiyu.com/leetcode/22/)

> Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.
> For example, given n = 3, a solution set is:
> [ "((()))", "(()())", "(())()", "()(())", "()()()" ]

```py
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        def backtracking(temp, left, right):
            if len(temp) == 2 * n:
                ans.append(temp)
                return

            if left < n:
                backtracking(temp+'(', left+1, right)
            if right < left:
                backtracking(temp+')', left, right+1)

        ans = []
        backtracking('', 0, 0)
        return ans
```

**Code:**

```java
class Solution {
    private List<String> ans = new ArrayList();

    public List<String> generateParenthesis(int n) {
        backtrack(new StringBuilder(), 0, 0, n);
        return ans;
    }

    public void backtrack(StringBuilder cur, int open, int close, int max){
        if (cur.length() == max * 2) {
            ans.add(cur.toString());
            return;
        }

        if (open < max) {
            cur.append("(");
            backtrack(cur, open+1, close, max);
            cur.deleteCharAt(cur.length() - 1);
        }
        if (close < open) {
            cur.append(")");
            backtrack(cur, open, close+1, max);
            cur.deleteCharAt(cur.length() - 1);
        }
    }
}

```

### [46 Permutations](https://yanjiyu.com/leetcode/46/)

> Given an array nums of distinct integers, return **all the possible permutations**. You can return the answer in **any order**.
> Input: [1,2,3]
> Output:
> [
> [1,2,3],
> [1,3,2],
> [2,1,3],
> [2,3,1],
> [3,1,2],
> [3,2,1]
> ]

```py
  def permute(self, nums: List[int]) -> List[List[int]]:
       def dfs(nums, permutation, result):
           if nums == []:
               result.append(permutation)
           for i,x in enumerate(nums):
               dfs(nums[:i] + nums[i+1:], permutation + [x], result)

       result = []
       dfs(nums, [], result)
       return result
```

**Code:**

```java
class Solution {
  public void backtrack(int n,
                        List<Integer> nums,
                        List<List<Integer>> output,
                        int first) {
    // if all integers are used up
    if (first == n)
      output.add(new ArrayList<Integer>(nums));
    for (int i = first; i < n; i++) {
      // place i-th integer first
      // in the current permutation
      Collections.swap(nums, first, i);
      // use next integers to complete the permutations
      backtrack(n, nums, output, first + 1);
      // backtrack
      Collections.swap(nums, first, i);
    }
  }

  public List<List<Integer>> permute(int[] nums) {
    // init output list
    List<List<Integer>> output = new LinkedList();

    // convert nums into list since the output is a list of lists
    List<Integer> nums_lst = Arrays.stream(nums).boxed().collect(Collectors.toList());

    int n = nums.length;
    backtrack(n, nums_lst, output, 0);
    return output;
  }
}
```

### [78. subsets](https://yanjiyu.com/leetcode/78-subset/)

> Given a set of distinct integers, nums, return all possible subsets (the power set).
> Note: The solution set must not contain duplicate subsets.
> Example:
> Input: nums = [1,2,3] Output: [ [3], [1], [2], [1,2,3], [1,3], [2,3], [1,2], [] ]

```py
class Solution:
    def subsets(self, nums):
        res = []
        def dfs(nums, path, res):
            res.append(path)
            for i,v in enumerate(nums):
                # dfs(nums[:i]+nums[i+1:], res, path+[v]) no duplicate
                dfs(nums[i+1:], path+[v], res)
        dfs(nums, [], res)
        return res
```

**Code:**

```java
class Solution {
  List<List<Integer>> output = new ArrayList();
  int n, k;

  public void backtrack(int first, ArrayList<Integer> curr, int[] nums) {
    // if the combination is done
    output.add(new ArrayList(curr));
    for (int i = first; i < n; ++i) {
      // add i into the current combination
      curr.add(nums[i]);
      // use next integers to complete the combination
      backtrack(i + 1, curr, nums);
      // backtrack
      curr.remove(curr.size() - 1);
    }
  }

  public List<List<Integer>> subsets(int[] nums) {
    n = nums.length;
    backtrack(0, new ArrayList<Integer>(), nums);
    return output;
  }
}
```

### [79. Word Search](https://yanjiyu.com/leetcode/79/)

> Given a 2D board and a word, find if the word exists in the grid.
> The word can be constructed from letters of sequentially adjacent cell, where "adjacent" cells are those horizontally or vertically neighboring. The same letter cell may not be used more than once.
> Example:
> board = [ ['A','B','C','E'], ['S','F','C','S'], ['A','D','E','E'] ] Given word = "ABCCED", return true. Given word = "SEE", return true. Given word = "ABCB", return false

**Code: backtracking will return True or False**

```py
class Solution:

    def exist(self, board: List[List[str]], word: str) -> bool:

        board_count = Counter(char for rows in board for char in rows)
        for word_char, need in Counter(word).items():
            if need > board_count[word_char]: return False

        m = len(board)
        n = len(board[0])

        def backtracking(x, y, index):
            if board[x][y] != word[index]: return False
            if index == len(word) - 1: return True

            pre = board[x][y]
            board[x][y] = ""

            for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < m and 0 <= ny < n:
                    if backtracking(nx, ny, index + 1): return True

            board[x][y] = pre
            return False

        return any(backtracking(x, y, 0) for x in range(m) for y in range(n))

```

**Code: use self.res to return, backtracking has no return value**

```py
class Solution:

    def exist(self, board: List[List[str]], word: str) -> bool:

        board_count = Counter(char for rows in board for char in rows)
        for word_char, need in Counter(word).items():
            if need > board_count[word_char]: return False

        m = len(board)
        n = len(board[0])

        self.res = False
        def backtracking(x, y, index):
            if board[x][y] != word[index]: return
            if index == len(word) - 1:
                self.res = True
                return

            pre = board[x][y]
            board[x][y] = ""

            for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < m and 0 <= ny < n:
                    backtracking(nx, ny, index + 1)

            board[x][y] = pre

        for x in range(m):
            for y in range(n):
                backtracking(x, y, 0)

        return self.res
```

**Code:**

```java
class Solution {
    public boolean exist(char[][] board, String word) {
        for(int i = 0; i < board.length; i++)
            for(int j = 0; j < board[0].length; j++){
                if(backtrack(board, i, j, word, 0))
                    return true;
            }
        return false;
    }
    private boolean backtrack(char[][] board, int i, int j, String word, int ind){
        if(ind == word.length()) return true;
        if(i > board.length-1 || i <0 || j<0 || j >board[0].length-1 || board[i][j]!=word.charAt(ind))
            return false;
        board[i][j]='*';
        boolean result =    backtrack(board, i-1, j, word, ind+1) ||
                            backtrack(board, i, j-1, word, ind+1) ||
                            backtrack(board, i, j+1, word, ind+1) ||
                            backtrack(board, i+1, j, word, ind+1);
        board[i][j] = word.charAt(ind);
        return result;
    }
}
```

### [47. Permutations-II](https://yanjiyu.com/leetcode/47/)

> Given a collection of numbers, nums, that might contain duplicates, return **all possible unique permutations **in any order**.**
> **Example 1:**
> Input: nums = [1,1,2] Output: [[1,1,2], [1,2,1], [2,1,1]]
> **Example 2:**
> Input: nums = [1,2,3] Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

```py
class Solution:
    def permuteUnique(self, nums: List[int]) -> List[List[int]]:
        def dfs(nums, cur, res):
            if not nums:
                res.append(cur)
                return

            visited = set()
            for i,num in enumerate(nums):
                if num not in visited:
                    visited.add(num)
                    # cur.append(num) wrong position to update!
                    dfs(nums[:i]+nums[i+1:], cur+[num], res)

        res = []
        dfs(nums, [], res)
        return res

```

**Code:**

```java
class Solution {

    public List<List<Integer>> permuteUnique(int[] nums) {
        List<List<Integer>> results = new ArrayList<>();

        // count the occurrence of each number
        HashMap<Integer, Integer> counter = new HashMap<>();
        for (int num : nums) {
            counter.put(num, counter.getOrDefault(num, 0) + 1);
        }

        LinkedList<Integer> comb = new LinkedList<>();
        this.backtrack(comb, nums.length, counter, results);
        return results;
    }

    protected void backtrack(
            LinkedList<Integer> comb,
            Integer N,
            HashMap<Integer, Integer> counter,
            List<List<Integer>> results) {

        if (comb.size() == N) {
            // make a deep copy of the resulting permutation,
            // since the permutation would be backtracked later.
            results.add(new ArrayList<Integer>(comb));
            return;
        }
        counter.forEach((num, count) -> {
            if (count != 0){
                // add this number into the current combination
                comb.offerLast(num);
                counter.put(num, count - 1);
                // continue the exploration
                backtrack(comb, N, counter, results);
                // revert the choice for the next exploration
                comb.pollLast();
                counter.put(num, count);
            }
        });
    }
}
```
