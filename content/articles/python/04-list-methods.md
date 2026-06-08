# Common Python List Methods

A Python list looks like a simple thing, but it comes with a small bundle of helpful methods that quietly do the heavy lifting in almost every Python program. Once you know the handful below, you can handle most of what day-to-day code asks of a list.

The most common job is adding items. Python gives you three small tools for this. To add a single value to the end of a list, use `append`. To add several values at once, use `extend`. And to add an item at a specific position, use `insert`.

```python
items = [1, 2]

items.append(3)         # [1, 2, 3]
items.extend([4, 5])    # [1, 2, 3, 4, 5]
items.insert(0, 0)      # [0, 1, 2, 3, 4, 5]
```

`append` is the one you will reach for most. `extend` is useful when you have another list to merge in. Note that `items.append([4, 5])` would add the inner list as a single item, which is usually not what you want.

Removing items is just as common, and you have a few choices depending on what you know. If you know the *value* you want to drop, use `remove`. If you know the *position*, use `pop`. To wipe the whole list clean, use `clear`.

```python
items = [1, 2, 3, 2, 4]

items.remove(2)   # removes the first 2  -> [1, 3, 2, 4]
items.pop()       # removes the last item and gives it back -> 4
items.pop(0)      # removes at index 0 and gives it back    -> 1
items.clear()     # empty the list
```

A small thing to know: `pop` returns the item it removed, which is handy when you need both the removal and the value. `remove`, on the other hand, only removes. It does not return anything.

When you want to look something up rather than change anything, lists have a few ways to ask questions. The simplest is `in`, which gives back `True` or `False`. For the actual position of a value, use `index`. For how many times something appears, use `count`.

```python
nums = [10, 20, 30, 20]

20 in nums       # True
50 in nums       # False
nums.index(20)   # 1   - first position
nums.count(20)   # 2   - how many 20s
```

For sorting, `sort` does the work in place, meaning your original list changes. If you want to keep the original and get a new sorted version, use the built-in `sorted` instead. Both accept a `key` argument, which lets you sort by a value derived from each item rather than the item itself. This is the trick to sort objects, dictionaries, or strings by their length.

```python
words = ["pear", "apple", "cherry"]

words.sort()              # ["apple", "cherry", "pear"]
words.sort(reverse=True)  # big to small
words.sort(key=len)       # sort by string length
```

Finally, a tiny bonus that pairs naturally with list work: `enumerate`. When you need both the index and the value as you loop, `enumerate` is much cleaner than writing `range(len(...))`.

```python
for i, name in enumerate(["alice", "bob", "carol"]):
    print(i, name)
```

Looking back, almost everything you do with a list falls into four buckets: adding, removing, searching, and sorting. Each one has a method that fits, and using the right one makes your code much shorter than reinventing the same thing with raw indexes. They are not flashy, but they are the workhorses of Python lists.
