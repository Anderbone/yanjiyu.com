---
title: "leetcode: Trie"
description: "Trie concepts, Java implementations, and LeetCode examples."
date: 2022-06-18
author: "Jiyu"
categories: ["Leetcode"]
tags: ["Trie", "Leetcode Summary"]
draft: false
---

### Basic

A Trie is a special form of a Nary tree. Typically, a trie is used to store strings. Each Trie node represents a string (a prefix). Each node might have several children nodes while the paths to different children nodes represent different characters. And the strings the child nodes represent will be the origin string represented by the node itself plus the character on the path.

Here is an example of a trie:

In the example, the value we mark in each node is the string the node represents. For instance, we start from the root node and choose the second path 'b', then choose the first child 'a', and choose child 'd', finally we arrived at the node "bad". The value of the node is exactly formed by the letters in the path from the root to the node sequentially.

It is worth noting that the root node is associated with the empty string.

One important property of Trie is that all the descendants of a node have a common prefix of the string associated with that node. That's why Trie is also called prefix tree.

Let's look at the example again. For example, the strings represented by nodes in the subtree rooted at node "b" have a common prefix "b". And vice versa. The strings which have the common prefix "b" are all in the subtree rooted at node "b" while the strings with different prefixes will come to different branches.

Trie is widely used in various applications, such as autocomplete, spell checker, etc.

### Representation

```java
class TrieNode {
    public Map<Character, TrieNode> children = new HashMap<>();

    // you might need some extra values according to different cases
};

/** Usage:
 *  Initialization: TrieNode root = new TrieNode();
 *  Return a specific child node with char c: root.children.get(c)
 */
```

1.  Initialize: cur = root
2.  for each char c in target string S:
3.        if cur does not have a child c:
4.            cur.children[c] = new Trie node
5.        cur = cur.children[c]
6.  cur is the node which represents the string S

```py
        d = self.dic
        for c in word:
            if c not in d:
                d[c] = {}
            d = d[c]
        d['$'] = True
```

Search

```
1. Initialize: cur = root
2. for each char c in target string S:
3.   if cur does not have a child c:
4.     search fails
5.   cur = cur.children[c]
6. search successes
```

### [208. Implement Trie (Prefix Tree)](https://yanjiyu.com/leetcode/208/)

**Code:**

```java
class Trie {
    class TrieNode {
        public boolean isWord;
        public Map<Character, TrieNode> childrenMap = new HashMap<>();
    }

    private TrieNode root;

    /** Initialize your data structure here. */
    public Trie() {
        root = new TrieNode();
    }

    /** Inserts a word into the trie. */
    public void insert(String word) {
        TrieNode cur = root;
        for(int i = 0; i < word.length(); i++){
            char c = word.charAt(i);
            if(cur.childrenMap.get(c) == null){
                // insert a new node if the path does not exist
                cur.childrenMap.put(c, new TrieNode());
            }
            cur = cur.childrenMap.get(c);
        }
        cur.isWord = true;
    }

    /** Returns if the word is in the trie. */
    public boolean search(String word) {
        TrieNode cur = root;
        for(int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            if(cur.childrenMap.get(c) == null) {
                return false;
            }
            cur = cur.childrenMap.get(c);
        }
        return cur.isWord;
    }

    /** Returns if there is any word in the trie that starts with the given prefix. */
    public boolean startsWith(String prefix) {
        TrieNode cur = root;
        for(int i = 0;i < prefix.length(); i++){
            char c = prefix.charAt(i);
            if(cur.childrenMap.get(c) == null) {
                return false;
            }
            cur = cur.childrenMap.get(c);
        }
        return true;
    }
}
```

**Code:**

```py
class Trie:

    def __init__(self):
        self.m = {}


    def insert(self, word: str) -> None:
        node = self.m
        for c in word:
            if c not in node:
                node[c] = {}
            node = node[c]
        node['$'] = True

    def searchPrefix(self, prefix: str):
        node = self.m
        for c in prefix:
            if c not in node:
                return False
            node = node[c]
        return node

    def search(self, word: str) -> bool:
        node = self.searchPrefix(word)
        return False if node is False else '$' in node

    def startsWith(self, prefix: str) -> bool:
        node = self.searchPrefix(prefix)
        return False if node is False else True
```

If the longest length of the word is N, the height of Trie will be N + 1. Therefore, the time complexity of all insert, search and startsWith methods will be O(N).

If we have M words to insert in total and the length of words is at most N, there will be at most M \* N nodes in the worst case (any two words don't have a common prefix).Let's assume that there are maximum K different characters (K is equal to 26 in this problem, but might differs in different cases). So each node will maintain a map whose size is at most K.Therefore, the space complexity will be O(M\*N\*K).

It seems that Trie is really space consuming, however, the real space complexity of Trie is much smaller than our estimation, especially when the distribution of words is dense.

### [1166. Design File System](https://yanjiyu.com/leetcode/1166/)

You are asked to design a file system that allows you to create new paths and associate them with different values.
The format of a path is one or more concatenated strings of the form: / followed by one or more lowercase English letters. For example, "/leetcode" and "/leetcode/problems" are valid paths while an empty string "" and "/" are not.
Implement the FileSystem class:

    bool createPath(string path, int value) Creates a new path and associates a value to it if possible and returns true. Returns false if the path already exists or its parent path doesn't exist.
    int get(string path) Returns the value associated with path or returns -1 if the path doesn't exist.

Example 1:
Input: ["FileSystem","createPath","get"] [[],["/a",1],["/a"]] Output: [null,true,1] Explanation: FileSystem fileSystem = new FileSystem(); fileSystem.createPath("/a", 1); // return true fileSystem.get("/a"); // return 1
Example 2:
Input: ["FileSystem","createPath","createPath","get","createPath","get"] [[],["/leet",1],["/leet/code",2],["/leet/code"],["/c/d",1],["/c"]] Output: [null,true,true,2,false,-1] Explanation: FileSystem fileSystem = new FileSystem(); fileSystem.createPath("/leet", 1); // return true fileSystem.createPath("/leet/code", 2); // return true fileSystem.get("/leet/code"); // return 2 fileSystem.createPath("/c/d", 1); // return false because the parent path "/c" doesn't exist. fileSystem.get("/c"); // return -1 because this path doesn't exist.

Constraints:

    The number of calls to the two functions is less than or equal to 104 in total.
    2 <= path.length <= 100
    1 <= value <= 109

---

**Code:**

```py
class TrieNode:
    def __init__(self):
        self.map = defaultdict(TrieNode)
        self.value = -1

class FileSystem:

    def __init__(self):
        self.root = TrieNode()

    def createPath(self, path: str, value: int) -> bool:
        cur_node = self.root
        path_list = path[1:].split("/")
        for idx, path in enumerate(path_list):
            if path not in cur_node.map:
                if idx != len(path_list) - 1: return False
                cur_node.map[path] = TrieNode()
            cur_node = cur_node.map[path]

        if cur_node.value != -1: return False
        cur_node.value = value
        return True

    def get(self, path: str) -> int:
        cur_node = self.root
        path_list = path.split("/")
        for i in range(1, len(path_list)):
            if path_list[i] not in cur_node.map: return -1
            cur_node = cur_node.map[path_list[i]]
        return cur_node.value
```

### [211. Design Add and Search Words Data Structure](https://yanjiyu.com/leetcode/211/)

Design a data structure that supports adding new words and finding if a string matches any previously added string.
Implement the WordDictionary class:

WordDictionary() Initializes the object.
void addWord(word) Adds word to the data structure, it can be matched later.
bool search(word) Returns true if there is any string in the data structure that matches word or false

otherwise. word may contain dots '.' where dots can be matched with any letter.

Example:
Input ["WordDictionary","addWord","addWord","addWord","search","search","search","search"] [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]] Output [null,null,null,null,false,true,true,true] Explanation WordDictionary wordDictionary = new WordDictionary(); wordDictionary.addWord("bad"); wordDictionary.addWord("dad"); wordDictionary.addWord("mad"); wordDictionary.search("pad"); // return False wordDictionary.search("bad"); // return True wordDictionary.search(".ad"); // return True wordDictionary.search("b.."); // return True

Constraints:

    1 <= word.length <= 500
    word in addWord consists lower-case English letters.
    word in search consist of  '.' or lower-case English letters.
    At most 50000 calls will be made to addWord and search.

---

**Code: #trie**

```py
class WordDictionary:

    def __init__(self):
        self.dic = {}


    def addWord(self, word: str) -> None:
        d = self.dic
        for c in word:
            if c not in d:
                d[c] = {}
            d = d[c]
        d['$'] = True

    def search(self, word: str) -> bool:
        def helper(word, d):
            for i, c in enumerate(word):
                if c in d: d = d[c]
                elif c != ".": return False
                else: ## "."
                    for nex in d:
                        if nex != '$' and helper(word[i + 1:], d[nex]): return True
                    return False
            return '$' in d

        return helper(word, self.dic)
```

### [421. Maximum XOR of Two Numbers in an Array](https://yanjiyu.com/leetcode/421/)

Given an integer array nums, return **the maximum result of **nums[i] XOR nums[j], where 0 <= i <= j < n.

Example 1:
Input: nums = [3,10,5,25,2,8] Output: 28 Explanation: The maximum result is 5 XOR 25 = 28.

Example 2:
Input: nums = [14,70,53,83,49,91,36,80,92,51,66,70] Output: 127

Constraints:

1 <= nums.length <= 2 \* 105
0 <= nums[i] <= 231 - 1

---

**Code: #trie**

```py
class Solution:
    def findMaximumXOR(self, nums: List[int]) -> int:
        # Compute length L of max number in a binary representation
        L = len(bin(max(nums))) - 2
        # zero left-padding to ensure L bits for each number
        nums = [[(x >> i) & 1 for i in range(L)][::-1] for x in nums]

        max_xor = 0
        trie = {}
        for num in nums:
            node = trie
            xor_node = trie
            curr_xor = 0
            for bit in num:
                # insert new number in trie
                if not bit in node:
                    node[bit] = {}
                node = node[bit]

                # to compute max xor of that new number
                # with all previously inserted
                toggled_bit = 1 - bit
                if toggled_bit in xor_node:
                    curr_xor = (curr_xor << 1) | 1
                    xor_node = xor_node[toggled_bit]
                else:
                    curr_xor = curr_xor << 1
                    xor_node = xor_node[bit]

            max_xor = max(max_xor, curr_xor)

        return max_xor
```

**Code: #trie**

```java
class TrieNode {
  TrieNode[] children;
  public TrieNode() {
    children = new TrieNode[2];
  }
}

class Solution {
  public int findMaximumXOR(int[] nums) {
    if (null == nums || 0 == nums.length)
      return 0;

    // get the longest binary representation.
    int maxLen = 0;
    for (int x : nums)
      maxLen = Math.max(maxLen, Integer.toBinaryString(x).length());

    // construct binary representation for each number.
    String[] strs = new String[nums.length];
    int padding = (1 << maxLen);
    for (int i = 0; i < nums.length; ++i)
      strs[i] = (Integer.toBinaryString(padding | nums[i]).substring(1));

    // construct trie first, and then get the max from the trie.
    TrieNode root = new TrieNode();
    for (String x : strs) {
      TrieNode curr = root;
      for (char c : x.toCharArray()) {
        int bit = c - '0';
        if (null == curr.children[bit])
          curr.children[bit] = new TrieNode();
        curr = curr.children[bit];
      }
    }

    int result = 0;
    for (String x : strs) {
      TrieNode curr = root;
      int currRes = 0;
      for (char c : x.toCharArray()) {
        int bit = c - '0';
        if (null != curr.children[1 - bit]) {
          currRes = (currRes << 1) | 1;
          curr = curr.children[1 - bit];
        } else {
          currRes <<= 1;
          curr = curr.children[bit];
        }
      }

      result = Math.max(result, currRes);
    }

    return result;
  }
}
```

### [745. Prefix and Suffix Search](https://yanjiyu.com/leetcode/745/)

Design a special dictionary with some words that searchs the words in it by a prefix and a suffix.
Implement the WordFilter class:

    WordFilter(string[] words) Initializes the object with the words in the dictionary.
    f(string prefix, string suffix) Returns __the index of the word in the dictionary,__ which has the prefix prefix and the suffix suffix. If there is more than one valid index, return **the largest** of them. If there is no such word in the dictionary, return -1.

**Example 1:**
**Input** ["WordFilter", "f"] [[["apple"]], ["a", "e"]] **Output** [null, 0] **Explanation** WordFilter wordFilter = new WordFilter(["apple"]); wordFilter.f("a", "e"); // return 0, because the word at index 0 has prefix = "a" and suffix = 'e".

**Constraints:**

    1 <= words.length <= 15000
    1 <= words[i].length <= 10
    1 <= prefix.length, suffix.length <= 10
    words[i], prefix and suffix consist of lower-case English letters only.
    At most 15000 calls will be made to the function f.

---

**Code:**

```py
class WordFilter:

    def __init__(self, words: List[str]):
        self.trie = {}

        for index, word in enumerate(words):
            for i in range(len(word) + 1):
                node = self.trie
                word_to_insert = word[i:] + '#' + word
                for c in word_to_insert:
                    if c not in node:
                        node[c] = {}
                    node = node[c]
                    node['res'] = index


    def f(self, prefix: str, suffix: str) -> int:
        node = self.trie
        for c in suffix + '#' + prefix:
            if c not in node:
                return -1
            node = node[c]
        return node['res']
```
