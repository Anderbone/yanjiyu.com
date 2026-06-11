---
title: "Java frequently used data structures and methods for leetcode"
description: "Frequently used Java data structures and methods for LeetCode practice."
date: 2022-07-09
author: "Jiyu Yan"
categories: ["Leetcode"]
tags: ["Java", "Leetcode Summary"]
draft: true
---

### Array

Common declarations:

```java
int[] a = new int[100];
int[] b = {4, 1, 5};
int[] c = new int[] {1, 2, 3};
```

Two-dimensional arrays:

```java
int[][] grid = {{1, 2}, {3, 4}};

int[][] jagged = new int[3][];
jagged[0] = new int[3];
jagged[1] = new int[2];
jagged[2] = new int[5];
```

Useful array operations:

- `arr.length` is an array field, not a method.
- `Arrays.toString(arr)` prints a one-dimensional array.
- `Arrays.stream(arr).sum()` sums an `int[]`.
- `Arrays.stream(arr).min().getAsInt()` returns the minimum.
- `Arrays.fill(arr, -1)` fills every slot with `-1`.
- `System.arraycopy(nums, 0, newNums, 1, n - 2)` copies a range.
- `Arrays.copyOf(original, 5)` returns a new array of length `5`.
- `Arrays.copyOfRange(original, from, to)` copies a half-open range.

Sorting:

```java
Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

Arrays.sort(points, (a, b) -> {
    if (a[1] == b[1]) return 0;
    if (a[1] < b[1]) return -1;
    return 1;
});
```

Array/list conversion:

```java
String[] a = new String[] {"A", "B", "C", "D"};
List<String> list = Arrays.asList(a);

List<List<Integer>> rows = new ArrayList<>();
for (int[] row : res) {
    rows.add(Arrays.stream(row).boxed().collect(Collectors.toList()));
}

int[] arr = list.stream().mapToInt(i -> i).toArray();
List<Integer> boxed = Arrays.stream(arr).boxed().collect(Collectors.toList());
```

Convert a list of arrays back to a two-dimensional array:

```java
LinkedList<int[]> merged = new LinkedList<>();
return merged.toArray(new int[merged.size()][]);
```

### String

Common string methods:

- `s.substring(0, 3)`
- `s.substring(begin)`
- `s.equals(t)`
- `s.length()`
- `s.charAt(i)`
- `s.indexOf(ch)`
- `s.indexOf(ch, fromIndex)`
- `s.indexOf(substring)`
- `s.contains(sequence)`
- `s.isEmpty()`
- `s.replace("abc", "$")`
- `s.equalsIgnoreCase(other)`
- `String.valueOf(num)`
- `s.toLowerCase()`
- `s.toUpperCase()`
- `s.trim()`
- `s.split("+")`

Do not use `==` to compare string contents. Use `equals`.

Loop over characters:

```java
for (char c : str.toCharArray()) {
    // ...
}

boolean lower = Character.isLowerCase(word.charAt(i));
```

`StringBuilder`:

```java
StringBuilder sb = new StringBuilder("abc");
sb.append(c);
String s = sb.toString();
sb.reverse();
sb.deleteCharAt(path.length() - 1);
sb.setCharAt(0, '$');
sb.insert(sb.length(), '$');
```

Formatting numbers:

```java
DecimalFormat df = new DecimalFormat("0.00");
System.out.println(df.format(num));

String rounded = String.format("%.2f", num);
String padded = String.format("%02d", seatNum);
```

### Collections

Base collection type:

```java
Collection<E> p = new ArrayList<>();
Collection<E> q = new HashSet<>();
```

Frequently used methods:

| Method                    | Notes                                     |
| ------------------------- | ----------------------------------------- |
| `add(E element)`          | Add one element.                          |
| `addAll(collection)`      | Add all elements from another collection. |
| `clear()`                 | Remove all elements.                      |
| `contains(element)`       | Check membership.                         |
| `containsAll(collection)` | Check whether all elements exist.         |
| `isEmpty()`               | Check whether the collection is empty.    |
| `remove(element)`         | Remove one matching element.              |
| `removeAll(collection)`   | Remove all matching elements.             |
| `size()`                  | Number of elements.                       |
| `toArray()`               | Convert to an object array.               |

Sort with a comparator:

```java
Comparator<Apple> byWeight = new Comparator<Apple>() {
    public int compare(Apple a1, Apple a2) {
        return a1.getWeight().compareTo(a2.getWeight());
    }
};

Comparator<Apple> byWeightLambda =
    (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight());

Collections.sort(values, Collections.reverseOrder());
```

Other helpers:

- `Collections.binarySearch(seats, requestedSeat)`
- `Collections.reverse(seatList)`
- `Collections.min(seatList)`
- `Collections.max(seatList)`
- `Collections.shuffle(seatList)`
- `Collections.copy(dest, src)`
- `Collections.swap(seatList, i, j)`

### ArrayList And Stack

`ArrayList` examples:

```java
List<String> list = new ArrayList<>();
List<Integer> sub = nums.subList(start, endIndex);

list.size();
list.add(item);
list.get(index);
list.set(index, newItem);
list.remove(index);
list.contains(item);
list.indexOf(item);
```

`Stack`:

```java
Stack<E> stack = new Stack<>();

stack.empty();
stack.push(item);
stack.pop();
stack.peek();
stack.search(item);
```

### Deque

`ArrayDeque` and `LinkedList` are common implementations:

```java
Deque<String> queue = new ArrayDeque<>();
```

Common methods:

- `peek()`
- `peekFirst()`
- `peekLast()`
- `contains(item)`
- `offer(item)`
- `offerFirst(item)`
- `offerLast(item)`
- `poll()`
- `pollFirst()`
- `pollLast()`
- `remove()`
- `remove(index)`
- `remove(object)`
- `removeFirstOccurrence(object)`
- `removeLastOccurrence(object)`

Iterator:

```java
Iterator<String> it = linkedList.iterator();
while (it.hasNext()) {
    it.next();
}
```

### Set

Set declarations:

```java
Set<String> hashSet = new HashSet<>();
Set<String> linkedHashSet = new LinkedHashSet<>();
Set<String> treeSet = new TreeSet<>();
```

Common set operations:

- `s1.containsAll(s2)`
- `s1.addAll(s2)`
- `s1.removeAll(s2)`
- `s1.retainAll(s2)`

If an object is used in a `Set` or as a `Map` key, override both `equals` and `hashCode`.

```java
@Override
public boolean equals(Object obj) {
    // ...
}

@Override
public int hashCode() {
    // ...
}
```

### Map

Map declarations:

```java
Map<K, V> hashMap = new HashMap<>();
Map<K, V> linkedHashMap = new LinkedHashMap<>();
Map<K, V> treeMap = new TreeMap<>();
```

Common map methods:

- `put(key, value)`
- `putAll(map)`
- `putIfAbsent(key, value)`
- `remove(key)`
- `remove(key, value)`
- `clear()`
- `containsKey(key)`
- `containsValue(value)`
- `get(key)`
- `getOrDefault(key, defaultValue)`
- `isEmpty()`
- `size()`
- `keySet()`
- `entrySet()`

Iterate entries:

```java
for (Map.Entry<String, String> entry : map.entrySet()) {
    System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());
}
```

Iterate keys:

```java
for (String key : language.keySet()) {
    language.get(key);
}
```

Lambda iteration:

```java
HashMap<Integer, Integer> map = new HashMap<>();
map.put(2, 3);
map.put(3, 4);

map.forEach((k, v) -> {
    System.out.println(k);
    System.out.println(v);
});
```

Build nested structures:

```java
Map<Integer, Stack<Integer>> group = new HashMap<>();
group.computeIfAbsent(freq, key -> new Stack<>()).push(x);
```

Find all keys with the maximum value:

```java
private List<Integer> keysWithMaxValue(Map<Integer, Long> counts) {
    if (counts.isEmpty()) {
        return Collections.emptyList();
    }

    long max = counts.values().stream().max(Comparator.naturalOrder()).get();
    return counts.entrySet().stream()
        .filter(entry -> entry.getValue() == max)
        .map(Map.Entry::getKey)
        .collect(Collectors.toList());
}
```

Get the maximum map value:

```java
long max = dist.values().stream().max(Comparator.naturalOrder()).get();
Map.Entry<Integer, Long> maxEntry = map.entrySet().stream()
    .max(Map.Entry.comparingByValue())
    .get();
```

### TreeMap And TreeSet

Reverse-order `TreeMap`:

```java
TreeMap<Integer, Integer> scores = new TreeMap<>(Collections.reverseOrder());
TreeMap<Integer, Integer> scores2 = new TreeMap<>((a, b) -> b - a);
```

### PriorityQueue

Min heap and max heap:

```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
PriorityQueue<Integer> heapWithValues = new PriorityQueue<>(Arrays.asList(3, 1, 2));
```

Custom comparator with arrays:

```java
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> {
    if (a[0] == b[0]) {
        return b[1] - a[1];
    }
    return b[0] - a[0];
});

int[] entry = new int[] {strength, i};
pq.add(entry);
```

Custom comparator with a class:

```java
PriorityQueue<Pair> q = new PriorityQueue<>(
    (Pair a, Pair b) ->
        a.first == b.first ? b.second - a.second : b.first - a.first
);

class Pair {
    int first;
    int second;

    Pair(int first, int second) {
        this.first = first;
        this.second = second;
    }
}
```

Common priority-queue methods:

- `pq.add(item)`
- `pq.offer(item)`
- `pq.peek()`
- `pq.poll()`
- `pq.remove()`

Example:

```java
Queue<Candidate> pq = new PriorityQueue<>(
    (a, b) -> a.totalEstimate - b.totalEstimate
);
pq.add(new Candidate(0, 0, 1, estimate(0, 0, grid)));
```

`Arrays.asList(int[])` does not produce `List<Integer>`. It produces a one-element `List<int[]>`. Use streams for primitive arrays:

```java
int[] a = {1, 2, 3};
List<Integer> list = IntStream.of(a).boxed().collect(Collectors.toList());
```

### Math And Integer

Math helpers:

- `Math.abs(a)`
- `Math.max(a, b)`
- `Math.sqrt(x)`
- `Math.pow(a, b)`
- `Math.ceil(a)`
- `Math.floor(a)`
- `Math.random()`
- `Math.log(x)`
- `Math.log10(x)`
- `Math.sin(a)`
- `Math.cos(a)`
- `Math.tan(a)`

Random numbers:

```java
Random random = new Random();
int value = random.nextInt(n);
int inclusive = random.nextInt((max - min) + 1) + min;
```

Integer helpers:

- `Integer.parseInt(s)`
- `Integer.valueOf(s)`
- `Integer.toBinaryString(i)`

Reference:

<https://github.com/itsPrasheel/lastMinuteJavaSyntax>
