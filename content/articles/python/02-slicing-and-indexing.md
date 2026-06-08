# Slicing and Indexing Python Arrays

Making a list is the easy part. The next thing you almost always want to do is pull pieces out of it: the first item, the last few, every second one, or maybe a chunk from the middle. Python makes this very tidy with two small ideas: indexing and slicing.

Indexing means asking for a single item by its position. In Python, the first item is at position `0`, the second at `1`, and so on. You can also count from the back using negative numbers, where `-1` is the last item.

```python
letters = ["a", "b", "c", "d", "e"]

letters[0]     # "a"  - first
letters[2]     # "c"  - third
letters[-1]    # "e"  - last
letters[-2]    # "d"  - second from last
```

One thing to keep in mind is that asking for a position that does not exist raises an error. There is no quiet `None`. If you write `letters[99]`, Python will stop and complain.

Slicing is the bigger idea. Instead of one item, you get a piece of the list. You write it as `start:stop` between square brackets. The start is included, the stop is not. This small rule catches everyone out at first, but you get used to it quickly.

```python
nums = [10, 20, 30, 40, 50, 60]

nums[1:4]      # [20, 30, 40]
nums[:3]       # [10, 20, 30]   - from the very start
nums[3:]       # [40, 50, 60]   - to the very end
nums[:]        # a full copy
```

You can also add a third value, the step, which lets you skip items or reverse the list. The full form is `[start:stop:step]`.

```python
nums[::2]      # [10, 30, 50]                  - every second item
nums[::-1]     # [60, 50, 40, 30, 20, 10]       - reversed
```

Slices are quietly forgiving. If the numbers go past the end of the list, you simply get back what is there, or an empty list. There is no error to handle.

Slices are not just for reading. You can also assign to a slice and replace a whole section at once. The replacement can even be a different size from the part you are replacing, and Python will resize the list for you.

```python
nums = [1, 2, 3, 4, 5]

nums[1:4] = [99]    # now [1, 99, 5]
nums[1:1] = [0, 0]  # insert without replacing -> [1, 0, 0, 99, 5]
del nums[0:2]       # remove a chunk           -> [0, 99, 5]
```

The last thing worth knowing is a small trap when you copy a list with `[:]`. It makes a new outer list, but if there are lists inside, those inner lists are still shared. If you change the inside, you change the original too.

```python
grid = [[0, 0], [0, 0]]
copy = grid[:]
copy[0][0] = 9
print(grid)    # [[9, 0], [0, 0]]  - the inner list was shared
```

If your data is nested and you need a fully independent copy, reach for the `copy` module and use `copy.deepcopy()`.

Once you have indexing and slicing in your fingers, almost every "give me part of this list" task in Python becomes a one-liner. They are the kind of small features that, once you have used them for a week, you cannot imagine writing code without.
