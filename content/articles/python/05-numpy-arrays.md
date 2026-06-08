# When to Use NumPy Arrays

For most of the Python code you write, a plain `list` is plenty. The moment you start working with a *lot* of numbers, though (averages over a million data points, image pixels, vectors, tables), lists start to feel slow and clumsy. That is the point where most Python developers reach for **NumPy**, the most widely used library for numerical work in Python.

NumPy is not built in, so you install it once with `pip install numpy`. By convention it is imported as `np`, a short name that has become standard in tutorials, libraries, and books.

```python
import numpy as np
```

The basic thing NumPy gives you is a new type called an *array*. Visually, a NumPy array looks much like a list. The big difference is what is happening under the hood: all the items must be the same type, and they sit together in memory as a tightly packed block of numbers. That tight packing is what makes NumPy fast.

```python
a = np.array([1, 2, 3, 4])
print(a)           # [1 2 3 4]
print(a.dtype)     # int64   - the type
print(a.shape)     # (4,)    - 4 items, 1 row
```

The real reason to use NumPy is the next step. Once you have an array, you can do math on every value at once without writing a loop. Multiply the whole thing by two, take the square root of every number, add two arrays together: each of these is a single line.

```python
a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

a + b           # [11 22 33 44]
a * 2           # [2 4 6 8]
np.sqrt(a)      # [1.   1.41 1.73 2.  ]
a.sum()         # 10
a.mean()        # 2.5
```

If you did the same work with a plain Python list, each one would need a `for` loop. NumPy not only makes the code shorter, it makes it dramatically faster too, because the loop happens inside fast C code rather than in Python.

NumPy is not limited to flat lists. The same array can be two-dimensional (rows and columns, like a small spreadsheet), or higher. You can ask for a single cell, a whole row, a whole column, or transpose the whole thing in one line.

```python
m = np.array([[1, 2, 3],
              [4, 5, 6]])

m.shape         # (2, 3) -> 2 rows, 3 columns
m[0, 1]         # 2      -> row 0, column 1
m[:, 1]         # [2 5]  -> all rows, column 1
m.T             # transpose (rows become columns)
```

A few small things are worth knowing before you start. First, NumPy will not silently mix types. Put a string in an array of numbers and the whole array will become strings, which is rarely what you want. Second, the size of an array is fixed once you make it; if you need to keep adding values, use a normal list first and convert it at the end with `np.asarray(my_list)`. Third, slices of NumPy arrays share memory with the original, so changes leak both ways unless you call `.copy()` to make an independent copy.

So when should you reach for NumPy? When you have a lot of numbers, when you want clean math without writing loops, or when you are heading into data science or machine learning, because pandas, scikit-learn, PyTorch, and most of the rest of the ecosystem are all built on top of NumPy. For everyday code with mixed data, a regular list is still the better choice. But the moment your work becomes about numbers, NumPy is the tool that pays off the fastest.
