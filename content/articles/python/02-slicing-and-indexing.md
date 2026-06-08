# Slicing and Indexing Python Arrays

Once you know how to make a list, the next thing you want is to pull pieces out of it. Python's slicing syntax is one of the friendliest in any language I've used, and it covers a lot of ground in a few characters.

## Indexing — single elements

Indexes start at `0`, and negative indexes count from the end.

```python
letters = ["a", "b", "c", "d", "e"]
letters[0]   # "a"
letters[2]   # "c"
letters[-1]  # "e" - last item
letters[-2]  # "d" - second from last
```

Going past the end raises `IndexError`. There's no silent fallback to `None`.

## Slicing — sub-sequences

Slicing uses `start:stop:step`. `start` is inclusive, `stop` is exclusive, both are optional.

```python
nums = [10, 20, 30, 40, 50, 60]

nums[1:4]    # [20, 30, 40]
nums[:3]     # [10, 20, 30]   - from the start
nums[3:]     # [40, 50, 60]   - to the end
nums[:]      # full shallow copy
nums[::2]    # [10, 30, 50]   - every second
nums[::-1]   # [60, 50, 40, 30, 20, 10] - reversed
```

The slice never raises for out-of-range bounds. `nums[10:20]` on a 6-item list just returns `[]`.

## Assigning to a slice

Slices aren't just read-only. You can replace a range with a different-sized sequence.

```python
nums = [1, 2, 3, 4, 5]
nums[1:4] = [99]      # nums is now [1, 99, 5]
nums[1:1] = [0, 0]    # insert without replacing - [1, 0, 0, 99, 5]
del nums[1:3]         # delete the slice - [1, 99, 5]
```

This is one of those features I underuse and then remember and feel pleased about.

## A small gotcha — shallow copies

`nums[:]` gives you a new list but doesn't copy nested objects.

```python
grid = [[0, 0], [0, 0]]
copy = grid[:]
copy[0][0] = 9
print(grid)  # [[9, 0], [0, 0]]  - the inner list was shared
```

For nested data use `copy.deepcopy()`.

## What I take away

Indexing and slicing handle most of the "get me part of this list" cases without a loop. Knowing the three-argument slice (`start:stop:step`) and that slice assignment can resize the list covers nearly everything I've needed so far.
