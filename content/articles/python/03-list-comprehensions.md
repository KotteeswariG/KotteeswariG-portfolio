# List Comprehensions in Python

The first time I saw a list comprehension I thought "what *is* that". A weird square bracket with a `for` inside, doing the work of a small loop in a single line. Now I write them all the time, and I want to share that "ohhh I get it" moment with you.

### The simplest example

Say you want a list of the first five squares. Without comprehensions, you'd do this:

```python
squares = []
for n in range(5):
    squares.append(n * n)
```

Works, sure. But it's four lines for a really small job. With a comprehension, it shrinks to one.

```python
squares = [n * n for n in range(5)]
# [0, 1, 4, 9, 16]
```

Read it left to right. "Give me `n * n`, for each `n` in the range." That's literally what it says. Once you read a few of these, your brain stops translating and just sees the meaning.

Every comprehension follows the same shape:

```python
[expression for item in iterable]
```

That's the whole recipe.

### Skipping items with `if`

Sometimes you only want some of the items. Just slap an `if` on the end.

```python
evens = [n for n in range(10) if n % 2 == 0]
# [0, 2, 4, 6, 8]
```

This reads as "give me each `n` from 0 to 9, but only keep it if it's even." The `if` at the end acts like a filter.

### Choosing between two values

Here's the part that always confuses people. There are *two* places an `if` can show up, and they mean different things.

* `if` at the **end** → keep or drop the item (it's a filter).
* `if/else` at the **start** → pick between two values for each item.

```python
labels = ["even" if n % 2 == 0 else "odd" for n in range(4)]
# ["even", "odd", "even", "odd"]
```

Same word, totally different roles. If that distinction clicks for you now, you're already ahead of where I was for about a month.

### Two loops in one line

You can have more than one `for`, and they nest like normal loops, from outer to inner.

```python
pairs = [(x, y) for x in [1, 2] for y in ["a", "b"]]
# [(1, "a"), (1, "b"), (2, "a"), (2, "b")]
```

Useful sometimes. But honestly, if it goes any deeper than that, please just write a regular loop. Future you will thank present you for not being clever.

### Same trick for sets and dicts

This pattern works for other containers too. Same idea, different brackets.

```python
{n * n for n in range(5)}        # a set
{n: n * n for n in range(5)}     # a dict
```

So once you know one, you basically know three.

### When *not* to use one

Comprehensions are best for jobs that fit on one line. If you find yourself wanting to:

* do many lines of work per item,
* print or log things along the way,
* or use a `try/except` somewhere in the middle,

just write a regular for loop. There's no prize for compressing everything into one line. The point of a comprehension is *clarity*, not cleverness.

That said, once they click, you'll start spotting little chunks of code that should have been comprehensions all along. They take an afternoon to get fluent with, and then you have them forever. Worth the investment.
