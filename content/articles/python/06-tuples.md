# Python Tuples

You already know about lists. A tuple is almost the same idea, with one tiny but important difference. Let me show you.

### What is a Tuple?

Basically, imagine a list that you cannot change after you make it. That is a tuple. Same shape, locked.

You make one with round brackets instead of square brackets:

```python
point = (10, 20)
colors = ("red", "green", "blue")
```

You can read items the same way as a list:

```python
point[0]      # 10
colors[-1]    # "blue"
```

But this will give you an error:

```python
point[0] = 99    # TypeError: 'tuple' object does not support item assignment
```

That is the whole story. Tuple = list that cannot be changed.

### Why use one?

Two main reasons.

First, when the data is meant to stay the same. A point on a map, the days of the week, a row from a database. These should not change once you have them.

Second, tuples are a tiny bit faster than lists and use a tiny bit less memory. Not a big deal for everyday code, but nice when you have lots of them.

### A neat trick: unpacking

Actually, this is where tuples shine. You can split a tuple into multiple variables in one line.

```python
point = (10, 20)
x, y = point
print(x)    # 10
print(y)    # 20
```

And this works the other way too. You can return multiple values from a function as a tuple, then unpack them on the other side:

```python
def get_size():
    return 1920, 1080

width, height = get_size()
```

Looks clean, reads like English. Most Python code uses this pattern.

### One little gotcha

A tuple with one item needs a comma. Otherwise Python thinks it is just a value in brackets.

```python
not_a_tuple = (5)      # this is just the number 5
real_tuple  = (5,)     # this is a tuple with one item
```

Weird but worth remembering.

### Why does it matter?

Because once you start using tuples for "things that should not change", your code becomes safer. You cannot accidentally edit a value that was meant to stay put.

One small tip: when in doubt, use a list. Reach for a tuple when you want to *say* "these values belong together and they are not changing".
