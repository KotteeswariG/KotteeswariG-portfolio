# When to Use NumPy Arrays

For most Python code, a normal `list` is fine. But when you work with **many** numbers, like big lists of numbers, tables, or images, a normal list starts to feel slow. That is the moment people switch to NumPy.

Let me explain what NumPy is and how to start using it.

### What is NumPy?

NumPy is a Python *library*. A library is just extra code that someone else wrote, packaged up, and shared. NumPy gives you a new kind of value called an *array*, plus a lot of math tools that work on it.

NumPy is not built into Python. You install it once with `pip`, the standard tool for installing Python libraries:

```bash
pip install numpy
```

By convention, everyone imports NumPy with the short name `np`:

```python
import numpy as np
```

You will see this line at the top of nearly every NumPy example.

### How is a NumPy array different from a list?

A NumPy array looks a lot like a list. The difference is in two rules:

1. All the values must be the **same type** (for example, all integers).
2. The size is **fixed** once you make the array.

In return, NumPy stores the values tightly together in memory and does math very fast.

```python
a = np.array([1, 2, 3, 4])
print(a)           # [1 2 3 4]
print(a.dtype)     # int64   - the type of all values
print(a.shape)     # (4,)    - 4 items, 1 row
```

`dtype` is the type (`int64` means 64-bit whole number). `shape` is the size (here, 4 items in one row).

### The big reason: math on the whole array at once

This is the main reason to use NumPy. You can do math on every value at once, without a `for` loop.

```python
a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

a + b           # [11 22 33 44]
a * 2           # [2 4 6 8]
np.sqrt(a)      # [1.   1.41 1.73 2.  ]
a.sum()         # 10
a.mean()        # 2.5
```

With a normal list, each of these would need a `for` loop. With NumPy it is one line. It is also much faster, because the work happens in fast low-level code (written in C), not in Python.

### Two dimensions: rows and columns

NumPy can also hold a grid of values, like a small spreadsheet. This is called a 2D array.

```python
m = np.array([[1, 2, 3],
              [4, 5, 6]])

m.shape         # (2, 3) -> 2 rows, 3 columns
m[0, 1]         # 2      -> row 0, column 1
m[:, 1]         # [2 5]  -> column 1, all rows
m.T             # transpose (rows become columns)
```

`m[:, 1]` means "give me column 1, from every row". You cannot do that this cleanly with a list of lists.

### A few small things to watch out for

These tripped me up when I first used NumPy. Worth knowing up front.

* **Same type only.** If you mix a number and a string, NumPy will turn everything into strings. That is rarely what you want.
* **Fixed size.** You cannot grow an array after you make it. If you are collecting values one at a time, build a normal `list` first, then convert to a NumPy array at the end with `np.asarray(my_list)`.
* **Slices share memory.** A slice of a NumPy array points back to the original. Changing the slice changes the original. Use `.copy()` if you want a separate copy.

### When should you use NumPy?

Easy rule:

* **Lots of numbers** → use NumPy. It is faster and shorter.
* **Mixed data or normal app code** → use a `list`. It is friendlier.

One more reason to learn NumPy: it is the base for many other libraries. Pandas, scikit-learn, PyTorch, and TensorFlow all use NumPy under the hood. If you are heading into data science or machine learning, you will be glad you learned it.

That is it. Install it, try out the math, get a feel for arrays. After a short while it will feel as natural as a normal list.
