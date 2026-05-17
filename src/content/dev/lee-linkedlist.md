---
title: "Leetcode: LinkedList in Python"
description: "Linked-list patterns and LeetCode examples in Python."
date: 2020-08-31
author: "Jiyu"
categories: ["Leetcode"]
tags: ["Linked List", "Python", "Leetcode Summary"]
draft: false
---

### create a dummy node
> Merge two linked lists.
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        pre = ListNode(0)
        ans = pre
        while(l1 != None or l2 != None):
            if l1 == None or (l2 != None and l2.val <= l1.val):
                pre.next = l2
                l2 = l2.next
                pre = pre.next
            else:
                pre.next = l1
                l1 = l1.next
                pre = pre.next
        return ans.next
```
### delete a node
> delete a node
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def deleteNode(self, node):
        """
        :type node: ListNode
        :rtype: void Do not return anything, modify node in-place instead.
        """
        node.val = node.next.val
        node.next = node.next.next
```

### quick and slow node.

> Check if it is palindrome.
> Example 1: Input: 1->2 Output: false
> Example 2:
> Input: 1->2->2->1 Output: true

```python
class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        if head is None:
            return True
        hare = turtle = curr = head
        while hare and hare.next:
            hare = hare.next.next
            turtle = turtle.next
        stack = []
        while turtle:
            stack.append(turtle.val)
            turtle = turtle.next
        while stack:
            if curr.val != stack.pop():
                return False
            curr = curr.next
        return True
```

> Detect cycle.
> Example1:
> Input: head = [3,2,0,-4], pos = 1
> Output: tail connects to node index 1
> Explanation: There is a cycle in the linked list, where tail connects to the second node.

```python
class Solution(object):
    def detectCycle(self, head):
        """
        :type head: ListNode
        :rtype: ListNode
        """
        meet = None
        fast = head
        slow = head
        # must check all 3 here
        while slow and  fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                meet = slow
                break

        if meet:
            p = head
            q = meet
            while p and q:
                if p is q:
                    return p
                p= p.next
                q = q.next
        return None
```
