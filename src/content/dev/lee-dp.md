---
title: "leetcode questions: dynamic programming"
description: "Dynamic programming notes, templates, and LeetCode examples."
date: 2021-10-11
author: "Jiyu Yan"
categories: ["Leetcode"]
tags: ["DP", "Leetcode Summary"]
draft: true
---

### Intro

Good video: [Dynamic Programming - Learn to Solve Algorithmic Problems & Coding Challenges - YouTube](https://www.youtube.com/watch?v=oBt53YbR9Kk)

DP is a style of coding where you store the results of your algorithm in a data structure while it runs.

[dynamic programming - What is the difference between bottom-up and top-down? - Stack Overflow](https://stackoverflow.com/questions/6164629/what-is-the-difference-between-bottom-up-and-top-down)

**Code:**

```py
function dp(dp_state, memo_dict) {
    // check if we have seen this dp_state
    if dp_state in memo_dict
        return memo_dict[dp_state]

    // base case (a case that we know the answer for already) such as dp_state is empty
    if dp_state is the base cases
        return things like 0 or null

    calculate dp(dp_state) from dp(other_state)

    save dp_state and the result into memo_dict
}
function answerToProblem(input) {
    return dp(start_state, empty_memo_dict)
}
```

The same subproblem may reoccur compared to divide-and-conquer, a key to solve is to break the problem into **subproblems** such that

1. the original problem can be solved relatively easily once solutions to the subproblems are available
2. these subproblem solutions are **cached**, caching the results of intermediate computations

e.g. fibonacci
Naive solution complexity analysis:

code0 O(n) time and O(n) space

```py
def fibonacci(n, cache={}):
    if n <= 1:
        return n
    elif n not in cache:
        cache[n] = fibonacci(n-1) + fibonacci(n-2)
    return cache[n]
```

code1 O(n) time and O(1) space

```py
def fibonacci(n):
    if n <= 1:
        return n
    fmin2, fmin1 = 0, 1
    for _ in range(1, n):
        f = fmin2 + fmin1
        fmin2, fmin1 = fmin1, f
    return fmin1
```

### [53 Maximum subarray](https://yanjiyu.com/leetcode/53/)

> Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.
> Example:
> Input: [-2,1,-3,4,-1,2,1,-5,4], Output: 6 Explanation: [4,-1,2,1] has the largest sum = 6

```py
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        curSum = res = nums[0]
        for i in range(1, len(nums)):
            curSum = max(curSum+nums[i], nums[i])
            res = max(res, curSum)
        return res

```

**Code:**

```java
class Solution {
    public int maxSubArray(int[] nums) {
        // Initialize our variables using the first element.
        int currentSubarray = nums[0];
        int maxSubarray = nums[0];

        // Start with the 2nd element since we already used the first one.
        for (int i = 1; i < nums.length; i++) {
            int num = nums[i];
            // If current_subarray is negative, throw it away. Otherwise, keep adding to it.
            currentSubarray = Math.max(num, currentSubarray + num);
            maxSubarray = Math.max(maxSubarray, currentSubarray);
        }

        return maxSubarray;
    }
}
```

### [70 climbing stairs](https://yanjiyu.com/leetcode/733/)

> You are climbing a staircase. It takes n steps to reach the top.
> Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?
> Input: 2
> Output: 2 Explanation: There are two ways to climb to the top.
>
> 1. 1 step + 1 step
> 2. 2 steps
>
> Example 2:
> Input: 3
> Output: 3
> Explanation: There are three ways to climb to the top.
>
> 1. 1 step + 1 step + 1 step
> 2. 1 step + 2 steps
> 3. 2 steps + 1 step

```py
class Solution:
    def climbStairs(self, n: int) -> int:
        dp = [0]*(n+1)
        dp[0] = 1
        for i in range(1, n+1):
            for j in [1, 2]:
                if j <= n:
                    dp[i] += dp[i-j]
        return dp[-1]

```

---

```py
class Solution:

    def climbStairs(self, n: int) -> int:
        if  n<= 3:
            return n
        pre = 1
        cur = 2
        for i in range(n-2):
            temp = cur
            cur = pre+cur
            pre = temp
        return cur
```

**Code:**

```java
public class Solution {
    public int climbStairs(int n) {
        if (n == 1) {
            return 1;
        }
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
}
```

### [121 Best Time to Buy and Sell Stock](https://yanjiyu.com/leetcode/121-best-time-to-buy-and-sell-stock/)

> You are given an array prices where prices[i] is the price of a given stock on the ith day.
> You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.
> Return **the maximum profit you can achieve from this transaction**. If you cannot achieve any profit, return 0.
> Example 1:
> Input: [7,1,5,3,6,4] Output: 5 Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.

```py
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        cur = maxProfit = 0
        for i in range(1, len(prices)):
            if cur == 0 and prices[i] < prices[i - 1]:
                continue
            cur += prices[i] - prices[i - 1]
            if cur <= 0: cur = 0
            else: maxProfit = max(maxProfit, cur)

        return maxProfit
```

---

```py
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        minday = prices[0]
        maxprofit = 0
        for v in prices:
            if v < minday:
                minday = v
            else:
                maxprofit = max(maxprofit, v - minday)

        return maxprofit
```

**Code:**

```java
public class Solution {
    public int maxProfit(int prices[]) {
        int minprice = Integer.MAX_VALUE;
        int maxprofit = 0;
        for (int i = 0; i < prices.length; i++) {
            if (prices[i] < minprice)
                minprice = prices[i];
            else if (prices[i] - minprice > maxprofit)
                maxprofit = prices[i] - minprice;
        }
        return maxprofit;
    }
}
```

### [198 House Robber](https://yanjiyu.com/leetcode/198/)

> You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security system connected and it will automatically contact the police if two adjacent houses were broken into on the same night.
> Given a list of non-negative integers representing the amount of money of each house, determine the maximum amount of money you can rob tonight without alerting the police.
> Example 1:
> Input: [1,2,3,1] Output: 4
> Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.

**Code:**

```py
class Solution:
    def rob(self, nums: List[int]) -> int:
        if len(nums) == 1:
            return nums[0]
        dp = len(nums) * [0]
        dp[0] = nums[0]
        dp[1] = max(nums[1], nums[0])
        for i in range(2, len(nums)):
            dp[i] = max(dp[i-2] + nums[i], dp[i-1])
        return dp[-1]

```

**Code: with dictionary**

```py
class Solution:
    def rob(self, nums: List[int]) -> int:
        if not nums:
            return 0
        if len(nums) == 1:
            return nums[0]
        profit = {0: nums[0], 1: max(nums[0], nums[1])}
        for i in range(2, len(nums)):
            profit[i] = max(profit[i-2]+nums[i], profit[i-1])
        return profit[len(nums)-1]

```

**Code[Python DP solution, 4 line, O(n) time, O(1) space, easy to understand with detailed explanation - LeetCode Discuss](https://leetcode.com/problems/house-robber/discuss/55977):**

```py
class Solution:
    # @param num, a list of integer
    # @return an integer
    def rob(self, num):
        max_3_house_before, max_2_house_before, adjacent = 0, 0, 0
        for cur in num:
            max_3_house_before, max_2_house_before, adjacent = \
            max_2_house_before, adjacent, max(max_3_house_before+cur, max_2_house_before+cur)
        return max(max_2_house_before, adjacent)

```

---

```py
class Solution:
    def rob(self, nums: List[int]) -> int:
        if not nums:
            return 0
        if len(nums) < 3:
            return max(nums)

        pre = 0
        # a = nums[0]
        cur = nums[0]

        for i in range(1, len(nums)):
            temp = cur
            cur = max(nums[i]+pre,cur)
            pre = temp
        return cur
```

**Code:**

```java
class Solution {

    public int rob(int[] nums) {

        int N = nums.length;
        // Special handling for empty array case.
        if (N == 0) {
            return 0;
        }

        int[] maxRobbedAmount = new int[nums.length + 1];
        // Base case initializations.
        maxRobbedAmount[N] = 0;
        maxRobbedAmount[N - 1] = nums[N - 1];

        // DP table calculations.
        for (int i = N - 2; i >= 0; --i) {
            // Same as the recursive solution.
            maxRobbedAmount[i] = Math.max(maxRobbedAmount[i + 1], maxRobbedAmount[i + 2] + nums[i]);
        }

        return maxRobbedAmount[0];
    }
}
```

### [55. Jump Game](https://yanjiyu.com/leetcode/55/)

> Given an array of non-negative integers, you are initially positioned at the first index of the array.
> Each element in the array represents your maximum jump length at that position.
> Determine if you are able to reach the last index.
> Example 1:
> Input: [2,3,1,1,4] Output: true Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
> Example 2:
> Input: [3,2,1,0,4] Output: false Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.

**Code:**

```py
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        need_step = 1
        for i in range(len(nums)-2, -1, -1):
            if nums[i] < need_step:
               need_step += 1
            else:
                need_step = 1
        # return nums[0] >= need_step
        return need_step ==  1

```

**Code:**

```py
class Solution:
   def canJump(self, nums: List[int]) -> bool:
        need = 1
        for i in reversed(range(len(nums)-1)):
            need = need + 1 if nums[i] < need else 1
        return need == 1

```

**Code:**

```java
public class Solution {
    public boolean canJump(int[] nums) {
        int lastPos = nums.length - 1;
        for (int i = nums.length - 1; i >= 0; i--) {
            if (i + nums[i] >= lastPos) {
                lastPos = i;
            }
        }
        return lastPos == 0;
    }
}
```

### [62 Unique Paths](https://yanjiyu.com/leetcode/62/)

> A robot is located at the top-left corner of a m x n grid (marked 'Start' in the diagram below).
> The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).
> How many possible unique paths are there?
> Input: m = 3, n = 2
> Output: 3
> Explanation:
> From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
>
> 1. Right -> Right -> Down
> 2. Right -> Down -> Right
> 3. Down -> Right -> Right

Naive solution, TLE

```py
class Solution:
    def uniquePaths(self, m, n):
        if m == 1 or n == 1: return 1
        return self.uniquePaths(m-1, n) + self.uniquePaths(m, n-1)
```

**Code:**

```py
class Solution:
    def uniquePaths(self, m, n):
        cur = [1] * n
        for _ in range(1, m):
            for j in range(1, n):
                cur[j] += cur[j-1]
        return cur[-1]

```

**Code:**

```py
class Solution:
    def uniquePaths(self, m, n):
        dp = {(0,1):1, (1,0):1}
        for row in range(m):
            for col in range(n):
                if row == 0 or col == 0:
                    dp[(row, col)] = 1
                else:
                    dp[(row, col)] = dp[(row-1, col)] + dp[(row, col-1)]
        return dp[(m-1, n-1)]

```

**Code:**

```py
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        grid = [[1 for _ in range(n)] for _ in range(m)]
        for i in range(1, m):
            for j in range(1, n):
                grid[i][j] = grid[i][j-1]+grid[i-1][j]

        return grid[-1][-1]

```

**Code:**

```java
class Solution {
  public int uniquePaths(int m, int n) {
    int[][] d = new int[m][n];

    for(int[] arr : d) {
      Arrays.fill(arr, 1);
    }
    for(int col = 1; col < m; ++col) {
      for(int row = 1; row < n; ++row) {
        d[col][row] = d[col - 1][row] + d[col][row - 1];
      }
    }
    return d[m - 1][n - 1];
  }
}
```

### [322. Coin Change](https://yanjiyu.com/leetcode/322/)

> You are given coins of different denominations and a total amount of money amount. Write a function to compute the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.
> You may assume that you have an infinite number of each kind of coin.
> Example 1:
> Input: coins = [1, 2, 5], amount = 11
> Output: 3 Explanation: 11 = 5 + 5 + 1
> Example 2:
> Input: coins = [2], amount = 3 Output: -1

F(S)=F(S−C)+1, S is the amount, C is the denomination(value of each coin)

```py
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [0] + amount*[amount+1]  # amount + 1 is the same as infinite big here
        for coin in coins:
            for i in range(coin, amount+1):
                dp[i] = min(dp[i], dp[i-coin]+1)
        return dp[amount] if dp[amount] <= amount else -1

```

**Code:**

```java
public class Solution {
  public int coinChange(int[] coins, int amount) {
    int max = amount + 1;
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, max);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
      for (int j = 0; j < coins.length; j++) {
        if (coins[j] <= i) {
          dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
        }
      }
    }
    return dp[amount] > amount ? -1 : dp[amount];
  }
}
```

### [279. Perfect squares](https://yanjiyu.com/leetcode/279/)

> Given an integer n, return **the least number of perfect square numbers that sum to** n.
> A perfect square is an integer that is the square of an integer; in other words, it is the product of some integer with itself. For example, 1, 4, 9, and 16 are perfect squares while 3 and 11 are not.
> Example 1:
> Input: n = 12 Output: 3 Explanation: 12 = 4 + 4 + 4.
> Example 2:
> Input: n = 13 Output: 2 Explanation: 13 = 4 + 9.

```py
class Solution(object):
    def numSquares(self, n):
        dp = [0] + [float('inf')]*n
        for i in range(1, n+1):
            dp[i] = min(dp[i-j*j] for j in range(1, int(i**0.5)+1)) + 1
        return dp[n]

```

**Code: dp**

```java
class Solution {

  public int numSquares(int n) {
    int dp[] = new int[n + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    // bottom case
    dp[0] = 0;

    // pre-calculate the square numbers.
    int max_square_index = (int) Math.sqrt(n) + 1;
    int square_nums[] = new int[max_square_index];
    for (int i = 1; i < max_square_index; ++i) {
      square_nums[i] = i * i;
    }

    for (int i = 1; i <= n; ++i) {
      for (int s = 1; s < max_square_index; ++s) {
        if (i < square_nums[s])
          break;
        dp[i] = Math.min(dp[i], dp[i - square_nums[s]] + 1);
      }
    }
    return dp[n];
  }
}
```
