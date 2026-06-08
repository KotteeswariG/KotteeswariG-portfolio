# Slicing and Indexing Python Arrays

Once you have a list, you will want to take parts of it. Maybe the first item. Maybe the last three. Maybe every second one. Python makes this easy. There are two things to learn: index and slice.

### Index gets one item

Every item in a list has a number, called the index. The first item is at 0, the second at 1, and so on. You can also count from the back using negative numbers.

```python
letters = ["a", "b", "c", "d", "e"]

letters[0]     # "a"   - first
letters[2]     # "c"   - third
letters[-1]    # "e"   - last
letters[-2]    # "d"   - second from last
```

If you ask for a position that does not exist, Python gives an error. So `letters[99]` will not work.

### Slice gets a chunk

A slice is two numbers with a colon. Like this: `[start:stop]`. The start is included. The stop is not. Yes, that is a bit odd at first.

```python
nums = [10, 20, 30, 40, 50, 60]

nums[1:4]      # [20, 30, 40]
nums[:3]       # [10, 20, 30]   - from the start
nums[3:]       # [40, 50, 60]   - to the end
nums[:]        # a full copy
```

You can also add a step, which lets you skip items or reverse the list.

```python
nums[::2]      # [10, 30, 50]                  - every second item
nums[::-1]     # [60, 50, 40, 30, 20, 10]       - reversed
```

That last one is a neat trick. One line to reverse a list.

Good news, slices do not throw errors if the numbers are too big. `nums[10:20]` on a small list just gives you an empty list.

### You can change a slice too

You can also replace a slice with new values. Python will resize the list for you.

```python
nums = [1, 2, 3, 4, 5]

nums[1:4] = [99]    # now [1, 99, 5]
nums[1:1] = [0, 0]  # add new items   -> [1, 0, 0, 99, 5]
del nums[0:2]       # remove a chunk  -> [0, 99, 5]
```

### A small thing to watch

`nums[:]` makes a copy, but only of the outer list. If the items inside are also lists, those inner lists are still shared.

```python
grid = [[0, 0], [0, 0]]
copy = grid[:]
copy[0][0] = 9
print(grid)    # [[9, 0], [0, 0]]   - oops, original changed
```

For a full deep copy of nested data, use `copy.deepcopy()`.

### That is it

Index for one item. Slice for a chunk. Add a step if you want every Nth one. Once you know these, most "get me part of the list" jobs are a one liner.
