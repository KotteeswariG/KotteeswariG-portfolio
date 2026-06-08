# Slicing and Indexing Python Arrays

You have a list. Now you want bits of it. Maybe just the first thing. Maybe the last three. Maybe every other one. Python makes this really easy with two small ideas.

### Get one item

Every item in a list has a number, just like seats on a bus. The first seat is `0`, not `1`. (Yes, Python starts counting at zero. You get used to it.)

```python
fruits = ["apple", "banana", "mango", "orange"]

fruits[0]   # "apple"
fruits[2]   # "mango"
fruits[-1]  # "orange"   (the last one)
```

Negative numbers count from the end. So `-1` is always the last item. Handy.

### Get a chunk

A "slice" gives you a piece of the list. You write it with two numbers and a colon between them:

```python
fruits[1:3]    # ["banana", "mango"]
fruits[:2]     # ["apple", "banana"]   - from the start
fruits[2:]     # ["mango", "orange"]   - to the end
```

Quick note: the first number is included, the second one isn't. So `fruits[1:3]` gives you items at positions 1 and 2, not 3. Slightly odd, but you learn it fast.

### A cool trick

Want to reverse a list? One line.

```python
fruits[::-1]    # ["orange", "mango", "banana", "apple"]
```

The `-1` means "step backwards". Try it on a list of numbers, very satisfying.

### One small thing to watch

If you copy a list with `[:]`, only the outer list is copied. If you have lists inside lists, those inner ones are still shared.

```python
grid = [[0, 0], [0, 0]]
copy = grid[:]
copy[0][0] = 9
print(grid)    # [[9, 0], [0, 0]]   - the original changed too!
```

If you need a totally independent copy, use `copy.deepcopy()` from the `copy` library.

### Summary

* `list[i]` → one item.
* `list[start:stop]` → a chunk.
* `list[::-1]` → reverse the list.

That's enough to handle 95 percent of "give me part of this list" tasks. Practice with a list of friends' names or numbers and it sticks within a day.
