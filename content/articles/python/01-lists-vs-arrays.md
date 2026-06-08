# Python Lists vs Arrays

When I first started writing Python, I assumed "list" and "array" were just two names for the same thing. They're not. Python has a few different ways to hold an ordered collection of items, and each one is built for a different job.

## The everyday `list`

The plain `list` is what most Python code reaches for first. It's a built-in container that can hold mixed types, grows on its own when you append to it, and supports slicing, indexing, comprehensions, and all the syntax niceties Python is known for.

```python
items = [1, "two", 3.0, [4]]
items.append("five")
print(items[0])  # 1
print(items[-1]) # "five"
```

Internally it's a dynamic array of pointers, so reads by index are fast (`O(1)`), appending at the end is `O(1)` amortised, and insertions or deletions in the middle are `O(n)` because everything after the change has to shift.

## The `array` module

When every element is the same numeric type and you care about memory, the standard library has an `array` module that stores values in a compact, typed buffer rather than a list of Python objects.

```python
from array import array
nums = array("i", [1, 2, 3, 4])  # "i" = signed int
nums.append(5)
```

It looks and feels like a list but won't accept the wrong type. It's mostly useful for talking to C code or shaving memory off a long numeric collection.

## NumPy arrays

For anything maths-heavy — vectors, matrices, image data, ML — the community standard is **NumPy**. A NumPy array (`ndarray`) is a contiguous block of one C type, and the library gives you fast vectorised operations on top.

```python
import numpy as np
a = np.array([1, 2, 3, 4])
print(a * 2)        # [2 4 6 8]  - no loop needed
print(a.mean())     # 2.5
```

The trade-off: you give up flexibility (one dtype, fixed shape after creation) for huge speedups on numeric work.

## How to pick

In day-to-day code I default to `list`. I reach for `array.array` only when I need a compact typed buffer for the standard library, and for NumPy when the work is actually mathematical and I want vectorised operations. Different tools, same shape — a sequence you can index, just optimised for different jobs.
