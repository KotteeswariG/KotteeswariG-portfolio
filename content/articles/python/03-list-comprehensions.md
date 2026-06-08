# List Comprehensions in Python

A list comprehension is a short way to build a new list from another list. It does the same job as a small `for` loop, but in just one line. Let me show you how it works with a few simple examples.

### Example 1: double every number

Say you have a list of prices and you want to double each one.

```python
prices = [10, 20, 30, 40]

# The long way
doubled = []
for p in prices:
    doubled.append(p * 2)

# The short way (list comprehension)
doubled = [p * 2 for p in prices]
# [20, 40, 60, 80]
```

Both give the same answer. The short version reads like a sentence: *for each `p` in prices, give me `p * 2`*.

The pattern is always:

```python
[expression for item in iterable]
```

### Example 2: only keep what you want (with `if`)

You can add an `if` at the end to skip some items.

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

evens = [n for n in numbers if n % 2 == 0]
# [2, 4, 6, 8, 10]
```

This says: *for each `n` in numbers, but only keep it if it is even*. The `if` here is a **filter**.

### Example 3: pick between two values (with `if/else`)

There is another spot where `if/else` can go: at the **front** of the expression. This is not a filter. It picks between two values for each item.

```python
scores = [55, 70, 40, 85, 60]

results = ["pass" if s >= 50 else "fail" for s in scores]
# ["pass", "pass", "fail", "pass", "pass"]
```

So remember:

* `if` at the **end** → keep or skip (a filter).
* `if/else` at the **front** → choose between two values.

Same word, different jobs.

### Example 4: convert to upper case

```python
names = ["alice", "bob", "carol"]

shout = [n.upper() for n in names]
# ["ALICE", "BOB", "CAROL"]
```

Short, clear, and you do not need a loop at all.

### Two loops in one line

You can also nest two loops. They run left to right.

```python
pairs = [(x, y) for x in [1, 2] for y in ["a", "b"]]
# [(1, "a"), (1, "b"), (2, "a"), (2, "b")]
```

Use this for simple cases. If it gets longer, write a normal loop. Clear is better than clever.

### Same trick for sets and dicts

The same pattern works for sets and dictionaries. Just change the brackets:

```python
{n * n for n in range(5)}        # a set
{n: n * n for n in range(5)}     # a dict (number → its square)
```

### When not to use one

A list comprehension is meant to be short and easy to read. Do not use one if:

* The work for each item is many lines.
* You need to print or log inside.
* You need `try/except` for errors.

For those, use a normal `for` loop. It will be clearer.

### Wrap up

* Use a comprehension when the job is simple: take a list, do one thing to each item, maybe skip some.
* Use a normal loop when the job is bigger.

Once you write a few of these, you will read them naturally and your code will get a lot shorter.
