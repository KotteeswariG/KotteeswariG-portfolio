# Slicing and Indexing Python Arrays

You have a list. You want bits of it. Maybe the first item. Maybe the last three. Maybe every other one. Python has two simple ways to do this. They are called *index* and *slice*.

### What is an Index?

Basically, imagine seats in a bus. Each seat has a number. The first seat is `0`, not `1`. Yes, Python counts from zero. You get used to it.

```python
fruits = ["apple", "banana", "mango", "orange"]

fruits[0]    # "apple"
fruits[2]    # "mango"
fruits[-1]   # "orange"    (the last one)
```

Negative numbers count from the end. So `-1` is always the last item. Very handy.

### What is a Slice?

A slice gives you a piece of the list. Two numbers, with a colon between them.

```python
fruits[1:3]    # ["banana", "mango"]
fruits[:2]     # ["apple", "banana"]   - from the start
fruits[2:]     # ["mango", "orange"]   - to the end
```

Actually, one small thing: the first number is included, the second number is **not**. So `fruits[1:3]` gives positions 1 and 2 only. Slightly odd, but you learn it fast.

### The cool trick

Want to reverse a list? One line.

```python
fruits[::-1]   # ["orange", "mango", "banana", "apple"]
```

That `-1` means "step backwards". Try it once and you will never forget it.

### One thing to watch

When you copy a list with `[:]`, only the outer list is copied. If your list has lists inside, those inner lists are still shared.

```python
grid = [[0, 0], [0, 0]]
copy = grid[:]
copy[0][0] = 9
print(grid)    # [[9, 0], [0, 0]]   - oh no, original changed too
```

For a fully separate copy, use `copy.deepcopy()` from the `copy` library.

### Why does it matter?

Because half of everyday Python is "give me this part of the list". Once index and slice click, you write much less code.

One small tip: don't memorise everything. Just remember `list[i]` for one item and `list[start:stop]` for a chunk. The rest follows naturally.
