# Common Python List Methods

A Python list comes with a small set of helpful methods. Once you know these, you can do most everyday list work. Let me walk you through the ones I use the most.

### Add items

```python
items = [1, 2]

items.append(3)         # [1, 2, 3]
items.extend([4, 5])    # [1, 2, 3, 4, 5]
items.insert(0, 0)      # [0, 1, 2, 3, 4, 5]
```

* `append` adds one item to the end.
* `extend` adds many items to the end.
* `insert(position, value)` puts an item at a chosen spot.

Small note. If you do `items.append([4, 5])`, the whole inner list is added as one item. To merge two lists, use `extend`.

### Remove items

```python
items = [1, 2, 3, 2, 4]

items.remove(2)   # removes the first 2     -> [1, 3, 2, 4]
items.pop()       # removes the last        -> 4
items.pop(0)      # removes at index 0      -> 1
items.clear()     # empty the whole list
```

* `remove` takes a value.
* `pop` takes a position (default is the last). It also returns the item it removed.
* `clear` empties the list.

### Find things

```python
nums = [10, 20, 30, 20]

20 in nums       # True
50 in nums       # False
nums.index(20)   # 1   - position of the first 20
nums.count(20)   # 2   - how many 20s
```

* Use `in` for a yes/no check.
* Use `index` to find the position.
* Use `count` to count how many.

Note: `index` gives an error if the value is not in the list. Best to check with `in` first.

### Sort items

```python
words = ["pear", "apple", "cherry"]

words.sort()              # ["apple", "cherry", "pear"]
words.sort(reverse=True)  # big to small
words.sort(key=len)       # sort by string length
```

* `sort` changes the list in place.
* `sorted(words)` makes a new sorted list and leaves the original alone.
* `key=` lets you sort by something derived, like length or a dict field.

### Bonus: enumerate

When you loop and need both the index and the value, use `enumerate`.

```python
for i, name in enumerate(["alice", "bob", "carol"]):
    print(i, name)
```

This is cleaner than writing `range(len(...))`.

### Summary

Almost all list work is one of these:

* **Add** with `append`, `extend`, `insert`
* **Remove** with `remove`, `pop`, `clear`
* **Find** with `in`, `index`, `count`
* **Sort** with `sort`, `sorted`

Learn these and you can handle most list jobs in Python.
