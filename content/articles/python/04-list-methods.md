# Common Python List Methods

A Python list comes with a small set of built-in helpers, called methods. Basically, they cover most of what you ever want to do with a list. Here are the ones I use every day, with a shopping list as the example.

### Adding things

```python
shopping = ["milk", "bread"]

shopping.append("eggs")              # add one to the end
shopping.extend(["butter", "jam"])   # add several
shopping.insert(0, "tea")            # add at the start
```

`append` adds one. `extend` adds many. `insert(position, value)` puts something at a chosen spot.

Actually, one common mistake: `shopping.append(["butter", "jam"])` puts the whole inner list as a single item. Use `extend` when you want to merge two lists.

### Removing things

```python
shopping.remove("milk")    # finds "milk" and drops it
shopping.pop()             # removes and returns the last item
shopping.pop(0)            # removes and returns the first item
shopping.clear()           # empty the whole list
```

`remove` takes a value. `pop` takes a position (defaults to the last). `pop` also gives the item back, which is handy.

### Finding things

```python
"milk" in shopping        # True or False
shopping.index("eggs")    # position of "eggs"
shopping.count("milk")    # how many "milk"s
```

Most of the time you just need `in`. Quick and clean.

### Sorting things

```python
words = ["pear", "apple", "cherry"]
words.sort()              # ["apple", "cherry", "pear"]
words.sort(reverse=True)  # ["pear", "cherry", "apple"]
```

`sort()` changes the list. If you want a new sorted list and keep the original, use `sorted(words)` instead.

### Bonus: enumerate

When you loop and want both the position and the value, use this:

```python
for i, name in enumerate(["Alice", "Bob", "Carol"]):
    print(i, name)
```

So much cleaner than `for i in range(len(...))`.

### Why does it matter?

Because almost every list job is one of four things: add, remove, find, or sort. Once you know the methods for each, you write code that just reads cleanly.

One small tip: when in doubt, type `dir([])` in a Python shell. It lists every method a list has. Same for any other object.
