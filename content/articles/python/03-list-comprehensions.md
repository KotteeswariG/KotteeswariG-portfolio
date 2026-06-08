# List Comprehensions in Python

A list comprehension is just a short way to build a new list from an old one. That's it. Where you would normally write a small loop, you write one line instead.

### The basic idea

Say you have a list of prices and you want to double each one.

The loop way:

```python
prices = [10, 20, 30]
doubled = []
for p in prices:
    doubled.append(p * 2)
```

The shorter way:

```python
doubled = [p * 2 for p in prices]
# [20, 40, 60]
```

Read it left to right: *for each `p` in prices, give me `p * 2`*. The square brackets make it a list. Same result, one line.

### Keep only what you want

You can add an `if` to skip some items.

```python
numbers = [1, 2, 3, 4, 5, 6]
evens = [n for n in numbers if n % 2 == 0]
# [2, 4, 6]
```

This says: *for each `n`, but only if it is even*.

### Pass or fail

You can also pick between two values for each item.

```python
scores = [55, 70, 40, 85]
result = ["pass" if s >= 50 else "fail" for s in scores]
# ["pass", "pass", "fail", "pass"]
```

Two simple uses, one short line.

### When not to use it

If the job needs many lines of work for each item, or you need to print stuff, or handle errors, just write a regular `for` loop. List comprehensions are for short, simple jobs. The whole point is to read like a sentence.

### That's it

* `[expr for item in list]` → make a new list.
* `[expr for item in list if condition]` → only keep some.
* `[a if cond else b for item in list]` → pick between two.

Try a few. Once they click, you'll see places to use them everywhere.
