# Python Lists vs Arrays

If you have been learning Python for a little while, you have probably noticed that people use the words "list" and "array" as if they mean the same thing. They don't. Python actually gives you three different ways to hold a row of values, and each one was built for a different kind of work. Knowing which to pick saves time and keeps your code easy to read.

The one you will use almost every day is the plain `list`. A list is the friendly all-rounder of Python. You can put anything in it — numbers, words, even other lists — and it grows on its own as you add more. You make one with square brackets and reach into it by position.

```python
items = [1, "two", 3.0]
items.append("four")

print(items[0])    # 1
print(items[-1])   # "four"
```

Most of the time this is all you need. Lists are easy, they are quick to read and write, and they cover almost every situation in everyday Python code.

Where lists fall short is when you want a *lot* of numbers of the same type and you care about memory. Python's standard library has a small helper for this called the `array` module. An `array` looks and feels like a list, but it only holds numbers, and every number must be the same kind. In return, it uses less memory than the same list would.

```python
from array import array
nums = array("i", [1, 2, 3, 4])   # "i" means whole numbers
nums.append(5)
```

You will probably not need this often. Reach for it only when you have a long stream of same-type numbers and a normal list feels wasteful.

The third option is where Python really shines for math: **NumPy**. NumPy is a separate library you install with `pip install numpy`. Its arrays look a bit like lists too, but they are built for math. You can do an operation on the whole array at once, with no loop. That makes NumPy fast and the code very short.

```python
import numpy as np

a = np.array([1, 2, 3, 4])
print(a * 2)      # [2 4 6 8]
print(a.mean())   # 2.5
```

NumPy arrays are the foundation of most data science and machine learning tools in Python, so if you head in that direction you will see them everywhere.

So which one do you reach for? A simple rule works well here. Use a plain `list` by default, because it is friendly and flexible. Use the `array` module only in the rare case you have a tight memory budget for same-type numbers. And use NumPy whenever the job is real number-crunching — averages, vectors, tables, anything where you would otherwise loop over numbers.

Three different tools, the same basic shape — a row of items — just tuned for different jobs.
