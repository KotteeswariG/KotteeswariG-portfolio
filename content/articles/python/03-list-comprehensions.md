# List Comprehensions in Python

A list comprehension is a short way to build a new list. It does the same job as a small `for` loop, but in one line. When I first saw one I was confused, but once I got it, I started using them all the time.

### A simple example

Say I want a list of squares.

```python
# the long way
squares = []
for n in range(5):
    squares.append(n * n)

# the short way
squares = [n * n for n in range(5)]
# [0, 1, 4, 9, 16]
```

Both give the same result. Read the short one as: *for each n, give me n times n*. The shape is always:

```python
[expression for item in iterable]
```

### Add an `if` to skip items

You can drop in an `if` to keep only some items.

```python
evens = [n for n in range(10) if n % 2 == 0]
# [0, 2, 4, 6, 8]
```

This means: *give me each n, but only if it is even*. The `if` is a filter.

### Pick between two values

There is another spot where `if/else` can go. At the front. This is not a filter. It picks between two values for each item.

```python
labels = ["even" if n % 2 == 0 else "odd" for n in range(4)]
# ["even", "odd", "even", "odd"]
```

So remember:

* `if` at the end → keep or skip.
* `if/else` at the front → choose between two values.

### Two loops in one

You can nest loops too.

```python
pairs = [(x, y) for x in [1, 2] for y in ["a", "b"]]
# [(1, "a"), (1, "b"), (2, "a"), (2, "b")]
```

Fine for simple cases. If it gets longer than this, just write a normal loop. Clear beats clever.

### Same idea for sets and dicts

The same shape works for sets and dicts. Just change the brackets.

```python
{n * n for n in range(5)}        # set
{n: n * n for n in range(5)}     # dict
```

### When not to use one

Skip comprehensions if:

* The work for each item is many lines.
* You need to print or log inside.
* You need `try/except` in the middle.

For those, a normal loop reads better. The point of a comprehension is to be short and easy to read.

That is it. Spend an afternoon writing a few, and they will stick.
