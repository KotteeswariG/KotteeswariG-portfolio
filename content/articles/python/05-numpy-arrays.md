# When to Reach for NumPy Arrays

Python's built-in `list` covers almost everything I do in normal application code. The exception is anything numerical — large vectors, matrices, image buffers, tabular numbers. For that work the standard answer is NumPy, and a NumPy `ndarray` is a different beast from a list.

## What makes it different

A `list` stores Python objects — each element is a full object with a header and a pointer to its value. A NumPy array stores raw numbers in a contiguous C buffer with one fixed dtype. That sounds like a small thing but it changes a few properties:

- **Memory** is a fraction of an equivalent list (no per-element object overhead).
- **Iteration in C** means most operations are dramatically faster.
- **All elements share one type** — `int32`, `float64`, etc. — set when you create the array.

```python
import numpy as np

a = np.array([1, 2, 3, 4])
a.dtype       # int64 on most systems
a.shape       # (4,)
a.nbytes      # 32 bytes for the 4 ints, vs. ~250+ for the list
```

## Vectorised operations

Maths on whole arrays at once, no Python-level loop:

```python
a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

a + b         # array([11, 22, 33, 44])
a * 2         # array([2, 4, 6, 8])
np.sqrt(a)    # array([1., 1.414, 1.732, 2.])
a.sum()       # 10
a.mean()      # 2.5
```

This is the headline feature. If you find yourself writing `for` loops over numeric lists, there's usually a vectorised NumPy version that's both shorter and orders of magnitude faster.

## Shape and reshape

Arrays can be multi-dimensional, and you can change the shape without copying data.

```python
m = np.array([[1, 2, 3],
              [4, 5, 6]])
m.shape        # (2, 3)
m[0, 1]        # 2 - row 0, column 1
m[:, 1]        # array([2, 5]) - column 1, all rows

flat = m.reshape(6)         # 1D view of the same data
flat2 = m.reshape(3, 2)     # 3x2 view
```

`m.T` is the transpose. `m[:, 1]` is column slicing — something you can fake on lists but never as cleanly.

## Quick gotchas

- **No mixed types.** Try to mix `int` and `str` and you'll get a `<U21` (unicode string) array, not what you want.
- **Fixed size after creation.** `append` exists but it returns a new array each time. For growth, build a Python list and `np.asarray()` it at the end.
- **Slicing returns a view, not a copy.** Modifying the slice modifies the original. Use `.copy()` if you need independence.

## When to use it

If the data is mostly numbers and you'd otherwise loop over it, switch to NumPy. If it's mixed types, short, or you're doing CRUD-style application logic, a plain `list` is friendlier and just as fast.

Once you have the habit, the same library is the foundation for pandas, scikit-learn, PyTorch, and most of the scientific Python ecosystem — it's worth the small upfront learning curve.
