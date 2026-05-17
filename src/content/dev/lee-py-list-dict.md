---
title: "Python list/dict functions for leetcode"
description: "Python list and dictionary methods useful for LeetCode practice."
date: 2020-08-22
author: "Jiyu"
categories: ["Leetcode"]
tags: ["Python", "Array", "Hash Table", "Leetcode Summary"]
draft: false
---

### List
- `len(array)` : length of array
    - `list.indexof(obj)`
- `enumerate(array)` : adds counter at the beginning.
    - `for count, item in enumberate(['x','y','z'])` # 0x 1y 2z
- `range(0,len(mylist)1,2)`
    - range(0,3), is 0,1,2
    - `for i in reversed(range(len(A)))`
- `nums.append(val), nums.remove(val), nums.reverse()`
    - `nums.extend(nums2)`
    - `list.insert(index, obj)`
    - `list.pop()` default pop index is -1, remove the last one
- `nums[:]`
    - copy the value within function: b[:]=a
        - .copy is equals to b[:]
        - temp = self.original[:]
        - copy.deepcopy could copy nested list
        - import copy , copy.deepcopy(a)
- `min(a,b)`
- `nums.sort()`
    - list.sort() change in place
    - sorted() return a  new sorted list, leving original unaffected
        - a.sort(key=lambda: x: str(x), reverse = False)
- `zip(alist,blist)` : return a zip object which is an iterator of tuples, paird together. Lengths depends on the shorter input list.
    - usually use tuple(), list(), set() on result.
    - `list(zip(['x','y','z'], [3,4,5])) = [('x', 3), ('y', 4), ('z', 5)];`
    - `letter, number =  zip(*result_list)`  # unzip
- matrix
    - test = [[0 for i in range(m)] for j in range(n)]
        - watch out , 3*2, m*n,  then the corner is test[n-1][m-1]
        - lee62
    - make one: dp = [[0] * n for _ in range(n)]
    - transpose a two dimension list
        - `Trans = [[row[i] for row in board] for i in range(len(board[0]))]`

### dict
- for k, v in dic.items()
    - dict = {'a': 1, 'b': 2, 'b': '3'}
    - dic1 == dic2
    - dic.values()
- `d = dict(collections.Counter(s))` :   s 3 times, a 1 time
    - c.most_common(3),  according to frequency, first 3 value,count 's list
    - c.items() , a list with  value,count
    - c.elements:  ['a', 'a', 'a', 'a', 'b', 'b']
- `collections.defaultdict(int)` # default 0
    - `senti_dic = collections.defaultdict(lambda: 0)`
    - `defaultdict(lambda: 'Vanilla')`
    - `dict(collections.Counter(nums1))`: key is item in num1, value is the count.


### e.g.1 with zip, enumerate

134 !(2019-05-28) Gas station  2  #array #2lee

> There are N gas stations along a circular route, where the amount of gas at station i is gas[i].
> You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from station i to its next station (i+1). You begin the journey with an empty tank at one of the gas stations.
> Return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.

Note:
If there exists a solution, it is guaranteed to be unique.
Both input arrays are non-empty and have the same length.
Each element in the input arrays is a non-negative integer.

Example 1:

Input:
gas = [1,2,3,4,5]
cost = [3,4,5,1,2]
Output: 3

Explanation:
Start at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
Travel to station 4. Your tank = 4 - 1 + 5 = 8
Travel to station 0. Your tank = 8 - 2 + 1 = 7
Travel to station 1. Your tank = 7 - 3 + 2 = 6
Travel to station 2. Your tank = 6 - 4 + 3 = 5
Travel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.
Therefore, return 3 as the starting index.

code
```python
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
```


### e.g.2 with dict(collection.Counter(array))


> Given a non-empty array of integers, every element appears twice except for one. Find that single one.
Note:
Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?
Example 1:
Input: [2,2,1] Output: 1

```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        dic = dict(collections.Counter(nums))
        for i in dic:
            if dic[i] == 1:
                return i
```
