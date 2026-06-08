# List Comprehensions in Python

A list comprehension is a short way to build a new list from another one. It does the same job as a small `for` loop, but in just one line. Let me show you what it looks like and how to read it.

### Start with the long way

Say you want a list of the first five squares (`0`, `1`, `4`, `9`, `16`). With a normal `for` loop, you write something like this:

```python
squares = []
for n in range(5):
    squares.append(n * n)

print(squares)   # [0, 1, 4, 9, 16]
```

This works fine. But it is four lines for a small job.

### Now the short way

A list comprehension does the same thing in one line:

```python
squares = [n * n for n in range(5)]
# [0, 1, 4, 9, 16]
```

Read it left to right: *for each `n` in the range, give me `n * n`*. That is exactly what the code says.

Every list comprehension follows the same shape:

```python
[expression for item in iterable]
```

* `expression`: what you want for each item.
* `item`: a name for each value as it goes through.
* `iterable`: where the items come from (a list, a range, a string, anything you can loop over).

### Skip items with `if`

You can add an `if` at the end to keep only some items.

```python
evens = [n for n in range(10) if n % 2 == 0]
# [0, 2, 4, 6, 8]
```

This says: *give me each `n` from 0 to 9, but only if it is even*. The `if` works like a filter.

### Pick between two values

There is also an `if/else` form. This one goes at the **front** of the expression, not the end. It picks between two values for each item.

```python
labels = ["even" if n % 2 == 0 else "odd" for n in range(4)]
# ["even", "odd", "even", "odd"]
```

So here is the rule to remember:

* `if` at the **end** = filter (keep or skip the item).
* `if/else` at the **front** = choose between two values.

Same word, different jobs.

### Two loops in one line

You can nest two loops in a comprehension. They run from left to right, like normal `for` loops.

```python
pairs = [(x, y) for x in [1, 2] for y in ["a", "b"]]
# [(1, "a"), (1, "b"), (2, "a"), (2, "b")]
```

If it gets longer than this, write a normal loop. The point of a comprehension is to be short and easy to read.

### Same trick for sets and dicts

The same pattern works for sets and dictionaries. Just change the brackets:

```python
{n * n for n in range(5)}        # set comprehension
{n: n * n for n in range(5)}     # dict comprehension
```

### When not to use one

Use a normal `for` loop if:

* Each item needs many lines of work.
* You need to `print` or log inside the loop.
* You need to handle errors with `try/except`.

The whole point of a comprehension is to be clear and short. If it is not clear, do not use it.

### Wrap up

* Use a comprehension when the job is simple: take a list, change every item, maybe skip some.
* Use a normal loop when the job is bigger.
* Practice writing a few. After that, you will read them without thinking.
