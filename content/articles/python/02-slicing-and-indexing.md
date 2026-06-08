# Slicing and Indexing Python Arrays

Once you have a list, you will want to take items out of it. Maybe just the first one. Maybe the last three. Maybe every second one. Python has two simple ideas for this: **index** and **slice**.

Let me show you with a list of fruits.

### Index: pick one item

Every item in a list has a position number. This number is called an *index*. Python starts counting at `0`, not `1`. That feels weird at first, but you get used to it.

```python
fruits = ["apple", "banana", "mango", "orange", "grape"]
#           0        1         2        3         4
```

Now you can grab any single fruit using its index:

```python
fruits[0]     # "apple"
fruits[2]     # "mango"
```

You can also count from the end using negative numbers. `-1` is the last item.

```python
fruits[-1]    # "grape"     (last)
fruits[-2]    # "orange"    (second from last)
```

Watch out: if you ask for a position that does not exist, Python gives an error. So `fruits[99]` will not work.

### Slice: pick a chunk

A *slice* gives you a piece of the list. You write it like `[start:stop]`. The start is included, the stop is **not**.

```python
fruits[1:4]    # ["banana", "mango", "orange"]    - positions 1, 2, 3
fruits[:3]     # ["apple", "banana", "mango"]     - from the start
fruits[2:]     # ["mango", "orange", "grape"]     - to the end
fruits[:]      # full copy of the list
```

Tip: slices never give an error if the numbers go past the end. `fruits[10:20]` just gives you back an empty list `[]`.

### Step: every Nth item or reverse

You can add a third number, called the **step**, to skip items. The full form is `[start:stop:step]`.

```python
fruits[::2]    # ["apple", "mango", "grape"]                  - every second
fruits[::-1]   # ["grape", "orange", "mango", "banana", "apple"]   - reversed!
```

That last one is a fun trick. One line to reverse a whole list.

### You can also change a slice

Slicing is not just for reading. You can replace a chunk with new values too.

```python
fruits = ["apple", "banana", "mango", "orange", "grape"]

fruits[1:4] = ["lemon"]    # replace 3 items with 1
# Now: ["apple", "lemon", "grape"]

del fruits[0:2]            # delete the first two
# Now: ["grape"]
```

### A small trap with copies

`fruits[:]` makes a copy of the list. But if your list has other lists inside, those inner lists are still shared.

```python
grid = [[0, 0], [0, 0]]
copy = grid[:]
copy[0][0] = 9

print(grid)    # [[9, 0], [0, 0]]   - oh no, the original changed!
```

For a fully separate copy of nested data, use the `copy` module:

```python
import copy
real_copy = copy.deepcopy(grid)
```

### Quick summary

* `list[i]` → one item at position `i`.
* `list[start:stop]` → a chunk.
* `list[start:stop:step]` → skip items or reverse.
* Slices never crash for out-of-range numbers.

Spend a few minutes playing with these on a list of names or numbers. After that, you will use them every day.
