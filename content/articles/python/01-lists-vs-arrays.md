# Python Lists vs Arrays

When I started Python, I thought "list" and "array" were just two names for the same thing. They are not. Python gives you a few different ways to store a row of items. Each one is good at a different job. Let me explain each in a simple way.

### What is a list?

A `list` is like a shopping list. It is a row of items, written one after the other. In Python, you make one with square brackets.

```python
items = [1, "two", 3.0]
```

You can put anything inside: numbers, words, even other lists. To add a new item to the end, use `append`. To read an item, use its position number (called the *index*). The first item is at position `0`.

```python
items.append("four")
print(items[0])    # 1
print(items[-1])   # "four"   - the -1 means "last"
```

This is the one you will use most of the time. For everyday Python code, a list is enough.

### What is the array module?

Python also has a small tool called `array`. It looks like a list, but it has two rules:

1. All the items must be numbers.
2. All the numbers must be the same kind (for example, all whole numbers).

Because of these rules, an array uses a little less memory than a list. Memory is just the space your program takes up in the computer.

```python
from array import array
nums = array("i", [1, 2, 3, 4])   # "i" means "whole numbers"
nums.append(5)
```

Most of the time you will not need this. Use it only if you are storing many same-type numbers and saving memory matters.

### What is NumPy?

For real number work, like math, tables, or images, people use a tool called NumPy. NumPy is a *library*, which just means extra Python code that someone else wrote and shared. You install it once on your computer:

```bash
pip install numpy
```

The point of NumPy is that you can do math on a whole array at once. No loop needed.

```python
import numpy as np

a = np.array([1, 2, 3, 4])
print(a * 2)      # [2 4 6 8]
print(a.mean())   # 2.5
```

See that? `a * 2` doubled every number in one go. With a normal list you would need a `for` loop. NumPy is also much faster because it does the work in low level code, not in Python.

### Which one should you use?

A simple rule:

* **Normal jobs:** use a `list`. It is friendly and works for almost everything.
* **Many same-type numbers, low memory:** use the `array` module.
* **Math, data, science:** use NumPy.

That is it. Same idea, three tools. Pick the one that matches the job.
