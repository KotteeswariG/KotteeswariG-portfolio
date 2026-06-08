# Common Python List Methods

A Python list comes with a handful of small built-in helpers. They cover most of what you'll ever want to do with a list. Here are the ones I use every day, with a simple shopping list as the example.

### Add things

```python
shopping = ["milk", "bread"]

shopping.append("eggs")              # add one to the end
shopping.extend(["butter", "jam"])   # add several
shopping.insert(0, "tea")            # add at the start
```

`append` adds one item. `extend` adds many. `insert(position, value)` puts something at a specific spot.

### Remove things

```python
shopping.remove("milk")    # remove the first "milk"
shopping.pop()             # remove and return the last item
shopping.pop(0)            # remove and return the first item
shopping.clear()           # empty the whole list
```

`remove` takes a value. `pop` takes a position (the last item if you don't say one). `clear` empties the list.

### Find things

```python
"milk" in shopping        # True or False
shopping.index("eggs")    # position of "eggs"
shopping.count("milk")    # how many "milk"s
```

Most of the time you just want `in` to check if something is there.

### Sort things

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

# 0 Alice
# 1 Bob
# 2 Carol
```

Much cleaner than messing about with `range(len(...))`.

### Summary

Almost every list job is one of these:

* **Add** → `append`, `extend`, `insert`
* **Remove** → `remove`, `pop`, `clear`
* **Find** → `in`, `index`, `count`
* **Sort** → `sort`, `sorted`

Learn these and you're set.
