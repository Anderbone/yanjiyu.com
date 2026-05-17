---
title: "Java frequently used data structures and methods for leetcode"
description: "Frequently used Java data structures and methods for LeetCode practice."
date: 2022-07-09
author: "Jiyu Yan"
categories: ["Leetcode"]
tags: ["Java", "Leetcode Summary"]
draft: false
---

### Array
- declare
    - int[] a = new int[100];
    - int[] b = {4,1,5};
    - array = new int[]{1,2,3};
    - two-dimensional
        - - code
          ```java
          int a[][] = {{1,2}, {3,4}};
          ```
        - - code
          ```java
          int array[][] = new int[3][];
          array[0] = new int[3];
          array[1] = new int[2];
          array[2] = new int[5];
          ```
- arr.length, a field on any array, the **capacity**, not the number of elements
  no () in the end, a final variable
    - length, length(), size()
        - .length is a **field**, containing the **capacity** (NOT the number of elements the array contains at the moment) **of arrays**.
        - length() is a **method** used by **Strings** (amongst others), it returns the **number of chars in the String**; with Strings, capacity and number of containing elements (chars) have the same value.
        - size() is a **method** implemented by **all members of Collection** (lists, sets, stacks,...). It returns the **number of elements** (NOT the capacity; some collections even don´t have a defined capacity) the collection contains.
- default 0, false, null
- Arrays.toString(myArr);
- Arrays.stream(myArr).sum()
- int maxx = Arrays.stream(myArr).min().getAsInt();
- Arrays.asList("apple","hello")
  return a fixed length list
    - - code
      ```java
                 String a[] = new String[] { "A", "B", "C", "D" };
                  // Getting the list view of Array
                  List<String> list = Arrays.asList(a);
      ```
    - 2d array `res` to list of list
        - - code
          ```py
                  List<List<Integer>> resList = new ArrayList<>();
                  for(int[] rows : res) {
                      resList.add(Arrays.stream(rows).boxed().collect(Collectors.toList()));
                  }
          ```
        - to 1d  list
            - - code
              ```java
              Arrays.stream(array).map(Arrays::asList).collect(Collectors.toList())
              ```
- Arrays.fill(myarr, -1)
- `Arrays.sort(intervals, (a,b)-> a[0]-b[0]); `
  not Collections.sort()
    - Arrays.parallelSort(myArray)
    - sort by end value, from small to big
        - `(a, b) -> (a[1] - b[1])`
        - - code
          ```java
                  Arrays.sort(points, (a, b) -> {
                      if (a[1] == b[1]) return 0;
                      if (a[1] < b[1]) return -1;
                      return 1;
                  });
          ```
- `LinkedList<int[]> merged` to two d array
    - - code
      ```java
      return merged.toArray(new int[merged.size()][]);
      ```
- copy
    - Arrays.copyOfRange
    -  System.arraycopy(nums, 0, newNums, 1, n - 2);
    - `copyOf`
        -  int[] copy = Arrays.copyOf(org, 5);
          new length 5

### String
    - string s = s.substring(0,3);
        - s.substring(begin)
    - s.equal(t),
        - == is to check whether they are in the same place, don't use it
    - s.length()
      length() method is a final variable which is applicable for string objects
    - char c = s.charAt(i);
      get the char at i index
    - int s1.indexOf(int ch)
        - int s1.indexOf(int ch, int fromIndex)
        - int s1.indexOf(String substring)
    - boolean str.contains(charSequence s)
    - s.isEmpty()
    - String updated = s.replace(char old, char new)
        - s.replace("abc","$")
        - not in place, the old remains the same, need to pass the return value
    - String s1.equalsIgnoreCase(String another)
    - String.valueOf(num)
    - String s1.toLowerCase()
    - String s1.toUpperCase()
    - for (char c: str.toCharArray())
    - Character.isLowerCase(word.charAt(i))
      isUpperCase
    - s.trim()  	removes the beginning and ending spaces of this string.
    - String[] words = s.split("+");
    - StringBuilder sb = new StringBuilder("abc");
        - sb.append(c);
        - String s = sb.toString();
        - sb.reverse();
        - sb.deleteCharAt(path.length() - 1);

		- sb.setCharAt(0, '$'); // replace
		- sb.insert(sb.length(), '$'); // append
		- StringBuffer() thread-safe

- DecimalFormat
    - 0.00
      ```java
      DecimalFormat df = new DecimalFormat("0.00");
      System.out.println(df.format(num));```
    -  #.##
      0.2  0.01,  no 0 in the end
- String.format("%.2f",num);
    - 56.63, rounded
    - if %.4f, then 123.4123
    - String.format("%02d", seatNum)
      01, 02... 12
- `String a= String.format("ha %s what %s the number %d, %.2f", str1, str2, int1, double1);`  %.2f will get 2.40


### Collections


```java
Collection<E> P = new "some type"<E>();
Collection<E> Q = new "some type"<E>();
```

| No. | Methods                              | Description                                                                                                                                                                                                              |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `boolean P.add(E element)`           | This method is used to add an object to the collection.                                                                                                                                                                  |
| 2   | `boolean P.addAll(Q);`               | This method adds all the elements in the given collection to this collection.                                                                                                                                            |
| 3   | `P.clear()`                          | used to clear the Collection upon                                                                                                                                                                                        |
| 4   | `boolean P.contains(Object element)` | returns true if the collection contains the specified element.                                                                                                                                                           |
| 5   | `boolean P.containsAll(Q)`           | returns true if the collection contains all of the elements in the given collection.                                                                                                                                     |
| 6   | `boolean P.equals(Q)`                | This method compares the specified object with this collection for equality.                                                                                                                                             |
| 7   | `int P.hashCode()`                   | return the hash code value for this collection.                                                                                                                                                                          |
| 8   | `boolean P.isEmpty()`                | This method returns true if this collection contains no elements.                                                                                                                                                        |
| 9   | `Collections.max(P)`                 | used to return the maximum element of the given collection, according to the natural ordering of its elements. All elements in the collection must implement the Comparable interface.                                   |
| 10  | `E P.remove(Object o)`               | This method is used to remove the given object from the collection. If there are duplicate values, then this method removes the first occurrence of the object.                                                          |
| 11  | `E P.removeAll(Q)`                   | This method is used to remove all the objects mentioned in the given collection from the collection.                                                                                                                     |
| 12  | `int P.size()`                       | This method is used to return the number of elements in the collection.                                                                                                                                                  |
| 13  | `Object[] objects = P.toArray();`    | This method is used to return an array containing all of the elements in this collection. toArray() method returns an array of type Object(Object[]). We need to typecast it to Integer before using as Integer objects.

#### `Collections.sort(xxx, comparator)`

```java

Comparator<Apple> byWeight = new Comparator<Apple>() {
	public int compare(Apple a1, Apple a2){ return a1.getWeight().compareTo(a2.getWeight());
}};

Comparator<Apple> byWeight = (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight());
```

`Collections.sort(values, Collections.reverseOrder());`

#### Collections.binarySearch(list, key)

return the index of key in the list of -1.

`Collections.binarySearch(seats, requestedSeat)`

`int index = Collections.binarySearch(stoneList, newStone);`

#### Collections...
` Collections.reverse(seatList)`
` Collections.min(seatList)`
` Collections.max(seatList)`
` Collections.shuffle(seatList)`
` Collections.copy(des, src)`
` Collections.swap(seatList, iIndex, jIndex)`

### ArrayList, Stack
#### ArrayList
`public List<String> myList = new ArrayList<String>();`
`List<Integer> sub = myList.subList(start, endIndex);`
`myList.size()`
`add(item), get(index), set(index, newItem), remove(index), contains(item)`
`list.getOrDefault(item, 0)`
`indexOf(item)` ,  -1 if not found

#### Change to Array and change back

`myArr = myArrList.toArray(new String[myArrList.size()])`
    only String, not int, but Integer

String[] arr = list.toArray(new String[0])

`int[] arr = list.stream().mapToInt(i -> i).toArray();`
```Arrays.stream(ints).boxed().collect(Collectors.toList());```

#### Stack
In Java, Stack is a class that falls under the Collection framework that extends the Vector class. It also implements interfaces List, Collection, Iterable, Cloneable, Serializable.
```java
    Stack<E> stk = new Stack<E>();
```
| No. | Methods                   | TC | Description                                                                                                                                                                                                        |
| --- | ------------------------- | ---  |----------------------------------------------------------------------------------------------------------- |
| 1  | `boolean stk.empty()`  |   | The method checks the stack is empty or not. |
| 2  | `E stk.push(E item)` or `add(E item)` |   |  The method pushes (insert) an element onto the top of the stack.  |
| 3  | `E stk.pop()`  |    |    The method removes an element from the top of the stack and returns the same element as the value of that function. |
| 4  | `E stk.peek()` |   | The method looks at the top element of the stack without removing it. |
| 5  | `int stk.search(Object o)` |  | The method searches the specified object and returns the position of the object. |


### Deque: ArrayDeque, LinkedList
could not traverse it's values or get a value by it's position

- `peek()` the head of the list. read it
    - peekFirst
    - peekLast
- `contains()`
- `offer`  add to the last, return true
    - `offerFirst` can return False, better than addFirst()Adds an item to the beginning of the list.T
    - `offerLast`
    - add(position, item)
- `poll`  retrieve and remove the **head**
    - `pollFirst() ` This method retrieves and removes the first element of this list, or returns null if this list is empty.
    - `pollLast()`
    - `remove() ` remove the first one
        - remove(int index) or remove(Object o)
        - removeFirstOccurrence(), return true or false
        - `bucket.removeFirstOccurance(Integer.valueOf(key));`
        - removeLastOccurrence
        - removeFirst()Remove an item from the beginning of the list.Try it »
        - removeLast()Remove an item from the end of the listTry it »
- `toArray`  `LinkedList<int[]> merged` to two d array
    - - code
      ```java
      return merged.toArray(new int[merged.size()][]);
      ```
- Iterator<String> i = mylinkedList.iterator();
  while (i.hasNext()){
  i.next();
  }
    - if it's ListIterator rather than Iterator
        - i.previou4 questions from Jias(); i.hasPrevious()
- ArrayDeque
    - Deque<String> queue = new ArrayDeque<>();


### Set: HashSet, LinkedHashSet

Since Set is an interface, objects cannot be created of the type Set. We always need a class which extends this list in order to create an object.

Syntax
```java
    Set<String> hs = new HashSet<String>();
    Set<String> lhs = new LinkedHashSet<String>();
    Set<String> ts = new TreeSet<String>();
```
| No. | Methods    | TC(HS) | TC(LHS) | TC(TS)                  | Description                                                                                           |
| --- | ------------| ---- | ---- | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| 1   | `boolean add(E e)` | O(1) | O(1) | O(log n) |  	It is used to add the specified element to this set if it is not already present. |
| 2   | `void clear()  `   | O(1) | O(1) | O(1) |	It is used to remove all of the elements from the set. |
| 3   | `boolean contains(Object o)` | O(1) | O(1) | O(log n) | It is used to return true if this set contains the specified element. |
| 4   | `boolean isEmpty()` | O(1) | O(1) | O(1) |	It is used to return true if this set contains no elements. |
| 5   | `boolean remove(Object o)` | O(1) | O(1) | O(log n) |	It is used to remove the specified element from this set if it is p. |
| 6   | `int size()` | O(1) | O(1) | O(1) |	It is used to return the number of elements in the set. |
| 7   | `Iterator<E> iterator()` | O(h/n) | O(1) | O(log n) |	It is used to return an iterator over the elements in this set. |

Itrator Syntax:
```java
 Iterator<String> itr=set.iterator();
  while(itr.hasNext()){
   System.out.println(itr.next());
  }
```
Set                   |    Add   |  Remove  | Contains |   Next   | Size | Data Structure
----------------------|----------|----------|----------|----------|------|-------------------------
HashSet               | O(1)     | O(1)     | O(1)     | O(h/n)   | O(1) | Hash Table
LinkedHashSet         | O(1)     | O(1)     | O(1)     | O(1)     | O(1) | Hash Table + Linked List
EnumSet               | O(1)     | O(1)     | O(1)     | O(1)     | O(1) | Bit Vector
TreeSet               | O(log n) | O(log n) | O(log n) | O(log n) | O(1) | Red-black tree

`s1.constainsAll(s2)`
`s1.addAll(s2)`
`s1.removeAll(s2)`
`s1.retainAll(s2)` : intersection, only elements common to both sets, gonna change s1.

- use your own obj in a set or as a key in map, need to overwrite equals and hashcode
    - hashcode determines which bucket the object is going to get into
        - as long as you defind Obj equal has the same hashcode
        - the same obj will always has the same hashcode
    - two object if equal, they must have the same hashcode
    -
      ``` java
      @ Override
      public boolean equals(Object obj)
      ```

### Map: HashMap, TreeMap, LinkedHashMap


```java
Map<K,V> m=new HashMap<K,V>();
Map<K,V> map = new LinkedHashMap<K,V>();
Map<K,V> map = new TreeMap<K,V>();
```


| No. | Methods                                      | Description                                                                                           |
| --- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | `void m.put(Object key, Object value)`       | used to insert an entry in the map.                                                                   |
| 2   | `void m.putAll(Map map)`                     | used to insert the specified map in the map.                                                          |
| 3   | `void m.putIfAbsent(K key, V value)`         | It inserts the specified value with the specified key in the map only if it is not already specified. |
| 4   | `void m.remove(Object key)`                  | used to delete an entry for the specified key.                                                        |
| 5   | `boolean m.remove(Object key, Object value)` | It removes the specified values with the associated specified keys from the map.                      |
| 6   | `void m.clear()`                             | used to reset the map.                                                                                |
| 7   | `boolean m.containsValue(Object value)`      | This method returns true if some value equal to the value exists within the map, else return false.   |
|     | `boolean containsKey(Object key)`            | This method returns true if some key equal to the key exists within the map, else return false.       |
| 8   | `boolean equals(Object o)`                   | used to compare the specified Object with the Map.                                                    |
| 9   | `V m.get(Object key)`                        | This method returns the object that contains the value associated with the key else returns null      |
| 10  | `boolean m.isEmpty()`                        | This method returns true if the map is empty; returns false if it contains at least one key.          |
| 11  | `int m.size()`                               | This method returns the number of entries in the map.                                                 |

Map.Entry
```java
for (Map.Entry<String,String> entry : gfg.entrySet())
            System.out.println("Key = " + entry.getKey() +
                             ", Value = " + entry.getValue());
}
```

|    Map                   |   Get    | ContainsKey |   Next   | Data Structure
----------------------|----------|-------------|----------|-------------------------
HashMap               | O(1)     |   O(1)      | O(h / n) | Hash Table
LinkedHashMap         | O(1)     |   O(1)      | O(1)     | Hash Table + Linked List
EnumMap               | O(1)     |   O(1)      | O(1)     | Array
TreeMap               | O(log n) |   O(log n)  | O(log n) | Red-black tree

#### Frequent map methods
- `Map<Integer, String> m = Map.of(2, "a", 3, "b");`
- `getOrDefault(key, default)`
    - - code
      ```java
      List<Integer> nei = adja.getOrDefault(start, new ArrayList<Integer>());
      ```
- `computeIfAbsent`
    - Map<Integer, Stack<Integer>> group;
    - group.computeIfAbsent(f, z-> new Stack()).push(x);
        - [895. Maximum Frequency Stack](https://yanjiyu.com/leetcode/895/)
- key should be an immutable object
- languages.put("Java", "hello java..");
    - `reverseAdjList.putIfAbsent(c, new ArrayList<>());`
    - myMap.get(eachKey)
        - languages.get("Java");
    - languages.remove("Lisp")
    - languages.replace("lisp","more features")
        - could also replace(key, oldValue, newValue)
- myHashmap.keySet()    entrySet()
    - foreach
      ```
      for(String key: language.keySet()){
      	language.get(key)
      }
      ```
    - - forEach with lambda
      ```java
      HashMap<Integer, Integer> m = new HashMap<>();
      m.put(2, 3);
      m.put(3, 4);
      m.forEach((k, v) -> {
          System.out.println(k);
          System.out.println(v);
      });

      ```
- myMap.containsKey(checkKey)
- stream
    - find the maximum value first and retrieve all keys mapping to that value afterwards:
        - - code
          ```java
          private List<Integer> testStreamMap(Map<Integer, Long> mapGroup) {
              if(mapGroup.isEmpty())
                  return Collections.emptyList();
              long max = mapGroup.values().stream().max(Comparator.naturalOrder()).get();
              return mapGroup.entrySet().stream()
                  .filter(e -> e.getValue() == max)
                  .map(Map.Entry::getKey)
                  .collect(Collectors.toList());
          }```
    - - code
      ```java
      return dist.values().stream().max(Comparator.naturalOrder()).get();
      ```
    - - codek
      ```java
      Map.Entry<Integer, Long> maxEntry = map.entrySet().stream()
        .max(Map.Entry.comparingByValue()).get();```

#### TreeMap, TreeSet
sorted by keys
- code
```java
     scores = new TreeMap<>(Collections.reverseOrder());
     private TreeMap<Integer, Integer>  scores = new TreeMap<>((a, b) -> b - a);
```


### PriorityQueue
Refer to [Queue](#Deque-arrayDeque-LinkedList)
- init
    - instead of Pair, can use an array
        - - code
          ```py
                  // Create a Priority Queue that measures firstly on strength and then indexes.
                  PriorityQueue<int[]> pq = new  PriorityQueue<>((a, b) -> {
                      if (a[0] == b[0]) return b[1] - a[1];
                      else return b[0] - a[0];
                  });
          ```
        - - code
          ```java
                      int[] entry = new int[]{strength, i};
                      pq.add(entry);
          ```
    - Pair
        - - code
          ```java
                  PriorityQueue<Pair> q = new PriorityQueue<>(
                      (Pair a, Pair b) ->
                          a.first == b.first ? (b.second - a.second) : b.first - a.first
                  ); // pass the Compartor
          ```
        - - code
          ```py
          class Pair{
              int first;
              int second;
              Pair(int first, int second){
                  this.first = first;
                  this.second = second;
              }
          }
          ```
        - - code
          ```py
          class Pair<U, V> {
              public U k;
              public V v;
              public Pair (U k, V v){
                  this.k = k;
                  this.v = v;
              }
          }
          ```
            - for Pair<Integer, Integer> p
    - PriorityQueue<Integer> heap = new PriorityQueue<>(Comparator.reverseOrder());
      // In Java, a Heap is represented by a Priority Queue
      import java.util.Collections;
      import java.util.PriorityQueue;
      import java.util.Arrays;

      // Construct an empty Min Heap
      PriorityQueue<Integer> minHeap = new PriorityQueue<>();

      // Construct an empty Max Heap
      PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

      // Construct a Heap with initial elements.
      // This process is named "Heapify".
      // The Heap is a Min Heap
      PriorityQueue<Integer> heapWithValues= new PriorityQueue<>(Arrays.asList(3, 1, 2));
- poll()
- peek()
- `pq.add(xxx)`
  ```
  Queue<Candidate> pq = new PriorityQueue<>((a,b) -> a.totalEstimate - b.totalEstimate);
  pq.add(new Candidate(0, 0, 1, estimate(0, 0, grid)));
  ```
- `pq.remove()`, return the top
- addAll
    - Arrays.asList(factors) returns a List<int[]> where factors is an int array
    - PriorityQueue<int[]> queue = new PriorityQueue<>((a, b)->b[1] - a[1]);
        queue.addAll(Arrays.asList(boxTypes));
        - https://yanjiyu.com/leetcode/1710/
    - error
      int[] nums; pq<Integer>; pq.addAll(Arrays.asList(nums));
        - Arrays.asList is expecting a variable number of Object. int is not an Object, but int[] is, thus Arrays.asList(A) will create a List<int[]> with just one element.
        - ```List<Integer> list = IntStream.of(a).boxed().collect(Collectors.toList());```

```java
 PriorityQueue<WorkerBikePair> pq = new PriorityQueue<>(
 (WorkerBikePair a, WorkerBikePair b) ->
 a.distance == b.distance
 ? (a.workerIndex == b.workerIndex ? a.bikeIndex - b.bikeIndex : a.workerIndex - b.workerIndex )
 : a.distance - b.distance
 );

```

### [Math and Integer Class](https://www.geeksforgeeks.org/java-lang-math-class-in-java-set-1/)
- Math  Integer Random
    - Math
        - Math.abs(a)
        - Math.max(a, b)
        - Math.sqrt(x)
        - Math.pow(a, b)
        - Math.ceil(a)
        - Math.floor(a)
        - Math.random()
            - returns a double value with a positive sign, greater than or equal to 0.0 and less than 1.0.
            - Random r = new Random();
            - r.nextInt(n) // // Will generate values b/w 0 to n-1
            - r.nextInt((max-min)+1) + min
              -Between min and max, inclusive
        - Math.log(2.7) // 2.7 is close to e, which is 1
        - Math.log10(x)
        - Math.sin/cos/tan/asin/acos/atan(double a)
    - Integer
        - Integer.parseInt(String s)
        - Integer.valueOf(String s)
        - Integer.toBinaryString(int i)  // pass 4, get 100

---

Reference:

https://github.com/itsPrasheel/lastMinuteJavaSyntax
