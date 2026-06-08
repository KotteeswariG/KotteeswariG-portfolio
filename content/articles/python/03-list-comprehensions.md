# List Comprehensions in Python

One of the first things that makes Python feel different from other languages is the list comprehension. It is a way to build a new list from an old one in a single short line, where many languages would need a small loop. Once you see how it works, you will probably use it every day.

The idea is simple. A list comprehension takes a sequence of items, does something to each one, and gives you back a new list of the results. The classic example is squaring numbers. Without a comprehension, the code looks like this:

```python
squares = []
for n in range(5):
    squares.append(n * n)
```

That works, but it is a lot of lines for a tiny job. With a list comprehension, the same task fits on one line.

```python
squares = [n * n for n in range(5)]
# [0, 1, 4, 9, 16]
```

The shape never changes: open square brackets, an expression to produce each value, the word `for`, and the items to walk through. Read it from left to right and it says exactly what it does: *give me `n * n` for each `n` in the range*.

You can also keep only some of the items by adding an `if` at the end. This turns the comprehension into a filter as well as a transformer.

```python
evens = [n for n in range(10) if n % 2 == 0]
# [0, 2, 4, 6, 8]
```

The `if` runs once per item. If the condition is false, that item is skipped. So this reads as *give me each `n` from the range, but only when `n` is even*.

There is a second, easy-to-confuse form where the `if` appears at the start of the expression instead. That is not a filter — it is a `if/else` choice, used to pick between two values for each item.

```python
labels = ["even" if n % 2 == 0 else "odd" for n in range(4)]
# ["even", "odd", "even", "odd"]
```

The rule of thumb is simple. `if` at the end means *keep or skip*. `if/else` at the front means *choose between two outputs*.

You can also write comprehensions with two loops in one line. They walk like nested `for` loops, in the order they appear.

```python
pairs = [(x, y) for x in [1, 2] for y in ["a", "b"]]
# [(1, "a"), (1, "b"), (2, "a"), (2, "b")]
```

That said, anything beyond two loops or one filter usually reads better as a normal loop. A comprehension is at its best when it stays short and obvious.

The same pattern works for sets and dictionaries too. Just change the brackets.

```python
{n * n for n in range(5)}        # a set
{n: n * n for n in range(5)}     # a dict
```

So when should you use a list comprehension, and when not? Use one when the job is straightforward: take a list, transform every item, maybe skip some. Stick with a normal loop when the work for each item is many lines long, or when you need side effects like printing or logging. The whole point of a comprehension is to be short and clear — if it stops being clear, you have outgrown it.

Once you start using comprehensions, you will see them turn what used to be five-line loops into one easy-to-read line, and your Python will start to look much more like the language was meant to look.
