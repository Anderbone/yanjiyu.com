---
title: "Leetcode: Array questions with Python"
description: "Array problem patterns and LeetCode examples in Python."
date: 2017-08-09
author: "Jiyu Yan"
categories: ["Leetcode"]
tags: ["Python", "Array", "Leetcode Summary"]
draft: true
---

### 134.Gas Station

> There are N gas stations along a circular route, where the amount of gas at station i is gas[i].
> You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from station i to its next station (i+1). You begin the journey with an empty tank at one of the gas stations.
> Return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.
> Note:
> If there exists a solution, it is guaranteed to be unique.
> Both input arrays are non-empty and have the same length.
> Each element in the input arrays is a non-negative integer.
> Example 1:
> Input:
> gas = [1,2,3,4,5]
> cost = [3,4,5,1,2]
> Output: 3
> Explanation:
> Start at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
> Travel to station 4. Your tank = 4 - 1 + 5 = 8
> Travel to station 0. Your tank = 8 - 2 + 1 = 7
> Travel to station 1. Your tank = 7 - 3 + 2 = 6
> Travel to station 2. Your tank = 6 - 4 + 3 = 5
> Travel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.
> Therefore, return 3 as the starting index.

```python
from typing import List

class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        '''
        time limited exceed...
        '''
        for count, i in enumerate(gas):
            tank = i
            if(tank - cost[count])<0:
                continue
            round = 0
            ini = count
            while tank >= 0:
                if count == len(gas)-1:
                    k = 0
                else: k = count+1
                if tank - cost[count] < 0:
                    break
                tank = tank - cost[count] + gas[k]
                round += 1
                if count == len(gas) -1:
                    count = 0
                else: count += 1
                if round == len(gas) :
                    return ini
        return -1

    def canCompleteCircuit2(self, gas: List[int], cost: List[int]) -> int:
        tmp = [x - y for x, y in zip(gas, cost)]
        print(tmp+tmp)
        cur = 0
        ans = 0
        for i, val in enumerate(tmp + tmp):
            cur += val
            if cur < 0:
                ans = i + 1
                if ans >= len(gas):
                    return -1
                cur = 0
        return ans

if __name__ == "__main__":
    # gas  = [4,5,3,1,4]
    # cost = [5,4,3,4,2]

    gas  = [1,2,3,4,5]
    cost = [3,4,5,1,2]
    # gas  = [3,3,4]
    # cost = [3,4,4]
    s = Solution()
    ans = s.canCompleteCircuit2(gas, cost)
    print(ans)
```

### 299.Bulls and cows

> Input: secret = "1807", guess = "7810"
> Output: "1A3B"
> Explanation: 1 bull and 3 cows. The bull is 8, the cows are 0, 1 and 7.
> Iterate over the secret string, store all the bulls in an array and keep track of the count for each character that isn't a bull in another array
> Iterate over guess string, if the character isn't a bull, then remove the count of that character and increment cows

```python
import collections

class Solution:
    def getHint(self, secret: str, guess: str) -> str:
        bulls = cows = 0
        d = collections.defaultdict(int)
        for i, c in enumerate(secret):
            if c == guess[i]:
                bulls += 1
            else:
                d[c] += 1
        for i, c in enumerate(guess):
            if c != secret[i] and c in d and d[c] > 0:
                cows += 1
                d[c] -= 1
        return str(bulls) + "A" + str(cows) + "B"

```

### 41.First Missing Positive

> Given an unsorted integer array, find the smallest missing positive integer.
> Example 1:
> Input: [1,2,0]
> Output: 3
> Example 2:
> Input: [3,4,-1,1]
> Output: 2

```python
from typing import List
import sys

class Solution:
    def firstMissingPositive(self, nums):
        i = 0
        while (i<len(nums)):
            if nums[i]<=0: nums.pop(i)
            else: i+=1
        for i in range(len(nums)):
            index = nums[i]-1
            if index<len(nums) and nums[index]>0: nums[index] *= -1
        for i in range(len(nums)):
            if nums[i]>0: return i+1
        return len(nums)+1

    def firstMissingPositive(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        for i, x in enumerate(nums):
            while 1 <= nums[i] <= len(nums) and nums[nums[i] - 1] != nums[i]:
                nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]
        for i in range(len(nums)):
            if nums[i] != i + 1:
                return i + 1
        return len(nums) + 1
```

### 561.Array Partition I

> Given an array of 2n integers, your task is to group these integers into n pairs of integer, say (a1, b1), (a2, b2), ..., (an, bn) which makes sum of min(ai, bi) for all i from 1 to n as large as possible.
> Example 1:
> Input: [1,4,3,2]
> Output: 4
> Explanation: n is 2, and the maximum sum of pairs is 4 = min(1, 2) + min(3, 4).

```python
class Solution:
    def arrayPairSum(self, nums: List[int]) -> int:
        total = 0
        nums.sort()
        for i in range(0, len(nums)-1, 2):
            total += nums[i]
        return total


if __name__ == "__main__":
    s = Solution()
    ans = s.arrayPairSum([1,2,3,4])
    print(ans)
```

### 189.Rotate Array

> Given an array, rotate the array to the right by k steps, where k is non-negative.
> Example 1:
> Input: [1,2,3,4,5,6,7] and k = 3
> Output: [5,6,7,1,2,3,4]
> Explanation:
> rotate 1 steps to the right: [7,1,2,3,4,5,6]
> rotate 2 steps to the right: [6,7,1,2,3,4,5]
> rotate 3 steps to the right: [5,6,7,1,2,3,4]

```python
from typing import List
class Solution:
    def rotate(self, nums: List[int], k: int) -> None:

        """
        Do not return anything, modify nums in-place instead.
        """

    def rotate2(self, nums: List[int], k: int) -> None:
        for _ in range(k):
            nums.insert(0,nums.pop())

        # other:
        #  k = k % len(nums)
        #  nums[:] = nums[-k:] + nums[:-k]

        # nums.reverse()
        # k = k % len(nums)
        # nums[:k]=nums[:k][::-1] # [7,6,5] -> [5,6,7]
        # nums[k:]=nums[k:][::-1] #[4,3,2,1] -> [1,2,3,4]
```

### 80.Remove Duplicates from Sorted Array II

> Given a sorted array nums, remove the duplicates in-place such that duplicates appeared at most twice and return the new length.
> Do not allocate extra space for another array, you must do this by modifying the input array in-place with O(1) extra memory.
> Example 1:
> Given nums = [1,1,1,2,2,3],
> Your function should return length = 5, with the first five elements of nums being 1, 1, 2, 2 and 3 respectively.
> It doesn't matter what you leave beyond the returned length.

```python
from typing import List

class Solution:
    def removeDuplicates(self, nums):
        i = 0
        for n in nums:
            if i < 2 or n > nums[i-2]:
                nums[i] = n
                i += 1
        return i
```

### 26.Remove Duplicate

> Given a sorted array nums, remove the duplicates in-place such that each element appear only once and return the new length.
> Do not allocate extra space for another array, you must do this by modifying the input array in-place with O(1) extra memory.
> Example 1:
> Given nums = [1,1,2],
> Your function should return length = 2, with the first two elements of nums being 1 and 2 respectively.
> It doesn't matter what you leave beyond the returned length.

```python
from typing import List
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        if len(nums) == 0:
            return 0
        if len(nums) == 1:
            return 1
        for count, i in enumerate(nums):
            j = count+1
            if j == len(nums):
                print(nums)
                return len(nums)
            while i == nums[j]:
                nums.remove(i)
                # j = j+1
                if j == len(nums):
                    print(nums)
                    return len(nums)
        return len(nums)
    def removeDuplicates2(self, nums: List[int]) -> int:
        left = 0
        if len(nums) == 0:
            return 0
        for i in range(len(nums)):
            if nums[i] != nums[left]:
                left+=1
                nums[left] = nums[i]
        return left + 1

if __name__ == "__main__":
    s = Solution()
    nums = [0,0,1,1,1,2,2,3,3,4]
    a = s.removeDuplicates(nums)
    print('hhhhh'+str(a))
```

### 27.Remove element

> Given an array nums and a value val, remove all instances of that value in-place and return the new length.
> Do not allocate extra space for another array, you must do this by modifying the input array in-place with O(1) extra memory.
> The order of elements can be changed. It doesn't matter what you leave beyond the new length.
> Example 1:
> Given nums = [3,2,2,3], val = 3,
> Your function should return length = 2, with the first two elements of nums being 2.
> It doesn't matter what you leave beyond the returned length.

```python
from typing import List
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        if len(nums) == 0:
            return 0
        k = 0
        for count, i in enumerate(nums):
            if i == val:
                continue
            else:
                nums[k] = nums[count]
                k = k+1
        return k


class Solution2:
    def removeElement(self, nums: List[int], val: int) -> int:
        while (1):
            try:
                nums.remove(val)
            except:
                return len (nums)


if __name__ == "__main__":
    s = Solution2()
    ans = s.removeElement([1,2,2,3,4],2)
    print(ans)
```
