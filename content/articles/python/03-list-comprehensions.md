# List Comprehensions in Python

List comprehensions are one of the first features that made Python feel different to me. The same loop-and-append pattern I'd write in three or four lines in Java becomes a single expressive line. Once it clicks it's hard to go back.

## The basic shape

A list comprehension takes a sequence and produces a new list in one expression.

```python
# Long form
squares = []
for n in range(5):
    squares.append(n * n)

# Comprehension
squares = [n * n for n in range(5)]
# [0, 1, 4, 9, 16]
```

Same result, less noise. The pattern is `[expression for item in iterable]`.

## Filtering with `if`

You can drop in an `if` clause to skip values.

```python
evens = [n for n in range(10) if n % 2 == 0]
# [0, 2, 4, 6, 8]
```

The `if` runs after the `for`, so think of it as a where-clause on the source iterable.

## Conditional expression vs filter

The `if` at the end filters. To choose between two values per item, put a ternary in the expression part instead.

```python
sign = [
    "neg" if n < 0 else "zero" if n == 0 else "pos"
    for n in [-2, 0, 5]
]
# ["neg", "zero", "pos"]
```

These can stack but they get unreadable fast — I usually pull anything beyond a single ternary out into a helper.

## Nested loops

A comprehension can have more than one `for`, processed left to right.

```python
pairs = [(x, y) for x in [1, 2, 3] for y in ["a", "b"]]
# [(1,"a"), (1,"b"), (2,"a"), (2,"b"), (3,"a"), (3,"b")]
```

It reads like a flat product. Anything more nested than two `for`s and I switch to a normal loop — comprehensions are best when they stay short.

## Sibling forms

The same syntax exists for other containers:

```python
{n * n for n in range(5)}            # set comprehension
{n: n * n for n in range(5)}         # dict comprehension
(n * n for n in range(5))            # generator expression
```

The generator version doesn't build a list in memory — it yields values one at a time, which matters for big inputs.

## When not to use one

If the body needs more than one statement, side effects, or complex error handling, write the loop out. List comprehensions are great when the goal is "transform every item" or "filter, then transform" — not "do a bunch of work per item".

That guideline aside, half my list-shuffling code these days is comprehensions. They reward the time it takes to get fluent with them.
