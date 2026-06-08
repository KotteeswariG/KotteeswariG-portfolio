# Slicing and Indexing Python Arrays

Making a list is easy. Now you want to grab stuff out of it. Maybe the first item, maybe the last three, maybe every second one. This is where Python really shows off, because the syntax is so short you'll feel like you're cheating.

There are two ideas to know. One is indexing (asking for one item), and the other is slicing (asking for a range). Let's go.

### Indexing: one item, by its number

Each item in a list has a number called the index, and Python counts from zero. So the first item is at `0`, not `1`. (I know. Just go with it.) You can also use negative numbers to count from the back, which is handy.

```python
letters = ["a", "b", "c", "d", "e"]

letters[0]     # "a"   - first
letters[2]     # "c"   - third
letters[-1]    # "e"   - last
letters[-2]    # "d"   - second from last
```

Heads up: if you ask for a position that doesn't exist, Python will throw an error. There's no quiet `None`. So `letters[99]` blows up.

### Slicing: a piece of the list

Now the fun bit. Slicing uses two numbers between square brackets, separated by a colon. The first is where you start, the second is where you stop. Catch is, the stop is *not* included. Weird at first, but you get used to it.

```python
nums = [10, 20, 30, 40, 50, 60]

nums[1:4]      # [20, 30, 40]
nums[:3]       # [10, 20, 30]   - from the start
nums[3:]       # [40, 50, 60]   - to the end
nums[:]        # a full copy
```

You can also add a third number, called the step, which lets you skip items or reverse the whole thing. This is one of those tricks that feels like a superpower the first time you use it.

```python
nums[::2]      # [10, 30, 50]                  - every second item
nums[::-1]     # [60, 50, 40, 30, 20, 10]       - reversed!
```

Reversed in one line. That's it. That's the trick.

Oh, and one nice thing about slices: they don't blow up when the numbers are too big. `nums[10:20]` on a 6-item list just gives you back an empty list. No error to handle.

### Slices can change the list too

This one surprised me when I first saw it. You can *assign* to a slice, and Python will replace that chunk for you, even if the new piece is a different size.

```python
nums = [1, 2, 3, 4, 5]

nums[1:4] = [99]    # now [1, 99, 5]
nums[1:1] = [0, 0]  # squeeze new items in    -> [1, 0, 0, 99, 5]
del nums[0:2]       # delete a whole range    -> [0, 99, 5]
```

That last one is `del`, which I forget exists half the time, but it's surprisingly useful when you want to drop a chunk.

### Quick gotcha to know about

`nums[:]` looks like a tidy way to copy a list, and it is, but only the outer layer. If your list has lists inside it, those inner lists are still shared with the original. Watch what happens here.

```python
grid = [[0, 0], [0, 0]]
copy = grid[:]
copy[0][0] = 9
print(grid)    # [[9, 0], [0, 0]]   - whoa, the original changed too!
```

Got me good the first time. If your data has nested stuff and you want a fully independent copy, use `copy.deepcopy()` from the standard library.

### Wrap up

Once indexing and slicing become muscle memory, half the "get me part of this list" jobs in Python become one-liners. Spend a few minutes playing with negative indexes and the step syntax. After that, you basically have it forever.
