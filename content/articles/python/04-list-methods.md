# The Python List Methods I Reach For Most

Python's `list` ships with a small, useful set of methods. After a few months of writing Python day-to-day, the same handful keeps coming up. These are the ones I find myself using on almost every project.

## Adding items

```python
items = [1, 2]
items.append(3)        # [1, 2, 3]            - one item at the end
items.extend([4, 5])   # [1, 2, 3, 4, 5]      - many items at the end
items.insert(0, 0)     # [0, 1, 2, 3, 4, 5]   - at a specific index
```

`append` is `O(1)` amortised. `insert(0, ...)` is `O(n)` because everything shifts — if you're prepending in a hot loop, `collections.deque` is a better fit.

## Removing items

```python
items = [1, 2, 3, 2, 4]
items.remove(2)   # removes the first 2 - [1, 3, 2, 4]
items.pop()       # removes & returns the last - 4
items.pop(0)      # removes & returns at index - 1
items.clear()     # empty the list
```

`remove` raises `ValueError` if the value isn't found. `pop` raises `IndexError` on an empty list.

## Finding things

```python
nums = [10, 20, 30, 20]
nums.index(20)        # 1   - first index
nums.index(20, 2)     # 3   - first index at/after position 2
nums.count(20)        # 2   - how many times
"20" in nums          # False
20 in nums            # True
```

`index` raises `ValueError` if missing. `in` is the easiest existence check.

## Ordering

```python
words = ["pear", "apple", "cherry"]
words.sort()                       # in-place: ["apple", "cherry", "pear"]
words.sort(reverse=True)           # in-place, descending
sorted(words)                      # returns a new list, original unchanged
words.sort(key=len)                # sort by a derived value
words.reverse()                    # in-place reverse
```

Use `sort()` when you don't need the original order, `sorted()` when you do. The `key=` argument is gold — it can take any callable, so `sort(key=lambda x: x["price"])` works on dicts, objects, anything.

## Quick tip — `enumerate` instead of indexed loops

It's not a list method but it pairs naturally with one. When you want both the index and the value, `enumerate` reads cleaner than `range(len(...))`.

```python
for i, name in enumerate(["alice", "bob", "carol"]):
    print(i, name)
```

## What I take away

Most of what I do with lists fits into "add", "remove", "look up", and "sort". Pick the right method for each and you don't need much else day to day.
