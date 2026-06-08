# Slicing and Indexing Python Arrays

Once you have a list, you will want to take pieces out of it. Maybe just the first item. Maybe the last three. Maybe every second one. Python has two simple ideas for this: **index** and **slice**.

Let me show you each, with examples you can copy and try.

### Index: pick one item by its position

Every item in a list has a position number. This position is called an *index*. Python starts counting at `0`, not `1`. So the first item has index `0`, the second has index `1`, and so on.

```python
letters = ["a", "b", "c", "d", "e"]
#           0    1    2    3    4
```

Now you can get any item by its index:

```python
letters[0]     # "a"   - first item
letters[2]     # "c"   - third item
```

You can also count from the end using negative numbers. `-1` is the last item, `-2` is the second from last:

```python
letters[-1]    # "e"
letters[-2]    # "d"
```

Heads up: if you ask for an index that does not exist, Python gives an error. So `letters[99]` will not work. Make sure your index is inside the list.

### Slice: pick a range of items

A *slice* gives you a chunk of the list. The basic form is two numbers with a colon between them: `[start:stop]`.

* `start` is the first index you want.
* `stop` is the first index you do **not** want. (Yes, this is a bit odd at first.)

```python
nums = [10, 20, 30, 40, 50, 60]

nums[1:4]      # [20, 30, 40]    - items at positions 1, 2, 3
```

If you skip the start, Python uses `0`. If you skip the stop, Python goes to the end:

```python
nums[:3]       # [10, 20, 30]   - from the start to position 3
nums[3:]       # [40, 50, 60]   - from position 3 to the end
nums[:]        # full copy of the list
```

### The step: skip items or go backwards

You can also add a third number, called the **step**. It says "take every Nth item". The full form is `[start:stop:step]`.

```python
nums[::2]      # [10, 30, 50]                  - every second item
nums[::-1]     # [60, 50, 40, 30, 20, 10]       - reversed!
```

A negative step reverses the order. One line to flip a whole list.

Nice thing: slices never give errors for being out of range. `nums[10:20]` on a 6-item list just gives you back an empty list `[]`.

### You can also change a slice

You are not just reading. You can also assign a new value to a slice, and Python will resize the list to match.

```python
nums = [1, 2, 3, 4, 5]

nums[1:4] = [99]     # replace 3 items with 1 item   -> [1, 99, 5]
nums[1:1] = [0, 0]   # insert 2 items at position 1  -> [1, 0, 0, 99, 5]
del nums[0:2]        # delete a range                -> [0, 99, 5]
```

### A small trap with copies

`nums[:]` makes a copy of the list. But if your list has lists inside it, those inner lists are still shared with the original.

```python
grid = [[0, 0], [0, 0]]
copy = grid[:]
copy[0][0] = 9
print(grid)    # [[9, 0], [0, 0]]   - the original changed too!
```

For a deep copy that does not share anything, use the `copy` module:

```python
import copy
real_copy = copy.deepcopy(grid)
```

### Quick summary

* `list[i]` gets one item at position `i`.
* `list[start:stop]` gets a chunk.
* `list[start:stop:step]` lets you skip or reverse.
* Slices never crash for out-of-range numbers.

Practice these once and you will use them every day.
