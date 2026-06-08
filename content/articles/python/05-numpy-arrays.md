# When to Use NumPy Arrays

For most Python code, a normal `list` works fine. But when you work with a lot of numbers, like big lists, tables, or images, a list starts to feel slow. That is when people switch to NumPy.

### Install it

NumPy is not built in. You install it once with pip:

```bash
pip install numpy
```

By convention, everyone imports it as `np`:

```python
import numpy as np
```

### Make an array

A NumPy array looks a lot like a list. The difference is that all the items must be the same type, and they sit together in memory as one block. That is what makes it fast.

```python
a = np.array([1, 2, 3, 4])
print(a)           # [1 2 3 4]
print(a.dtype)     # int64   - the type of all values
print(a.shape)     # (4,)    - 4 items, 1 row
```

### Do math on the whole array

This is the main reason to use NumPy. You can do math on every value at once. No loop needed.

```python
a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

a + b           # [11 22 33 44]
a * 2           # [2 4 6 8]
np.sqrt(a)      # [1.   1.41 1.73 2.  ]
a.sum()         # 10
a.mean()        # 2.5
```

In a normal list you would need a `for` loop for each. In NumPy it is one line, and much faster too.

### Two dimensions

NumPy can also hold a grid of values, like a small spreadsheet.

```python
m = np.array([[1, 2, 3],
              [4, 5, 6]])

m.shape         # (2, 3) -> 2 rows, 3 columns
m[0, 1]         # 2      -> row 0, column 1
m[:, 1]         # [2 5]  -> all rows, column 1
m.T             # transpose
```

`m[:, 1]` means "give me column 1, every row". Very clean.

### A few small things to watch

* **One type only.** If you mix numbers and strings, NumPy turns everything into strings.
* **Fixed size.** You cannot grow an array after you make it. To collect values, use a normal list first, then turn it into a NumPy array with `np.asarray(my_list)`.
* **Slices share memory.** If you change a slice, you change the original. Use `.copy()` if you want a real copy.

### Should you use it

Simple rule:

* Lots of numbers → use NumPy.
* Mixed types or normal app code → stick with a `list`.

Also, if you plan to learn data science or machine learning, NumPy is a must. Pandas, scikit-learn, PyTorch, all of them use NumPy under the hood. Learn it once and it pays back for years.
