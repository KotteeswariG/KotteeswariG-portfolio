# When to Use NumPy Arrays

Let me set the scene. For most things you do in Python, a regular `list` is plenty. You're holding some user names, some prices, a few rows of stuff. Lists are great for that.

But then one day you have a *million* numbers. Or pixels from an image. Or a big spreadsheet. And suddenly your list-based code starts to feel slow and clunky. That's the moment everyone reaches for the same tool: **NumPy**.

So let's get to know it.

### Install it first

NumPy isn't built into Python. You install it once with pip:

```bash
pip install numpy
```

By convention everyone imports it as `np`. You'll see this everywhere, in every tutorial:

```python
import numpy as np
```

### Making one

At a glance, a NumPy array looks a lot like a list. The difference is what's happening behind the scenes. Every value has to be the same type, and they all live next to each other in memory as a single block. That's what makes NumPy fast.

```python
a = np.array([1, 2, 3, 4])
print(a)           # [1 2 3 4]
print(a.dtype)     # int64   - the type of all values
print(a.shape)     # (4,)    - 4 items, 1 row
```

Same look as a list, very different beast underneath.

### Now the cool bit

Watch this. You can do math on the whole array at once. No loop required.

```python
a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

a + b           # [11 22 33 44]
a * 2           # [2 4 6 8]
np.sqrt(a)      # [1.   1.41 1.73 2.  ]
a.sum()         # 10
a.mean()        # 2.5
```

If you wrote each of those with a regular Python list, you'd be writing `for` loops. With NumPy it's one line, and behind the scenes it's also *way* faster because the heavy work runs in C, not Python. That's the headline feature. Once you see it, you can't unsee it.

### Two dimensions, like a small spreadsheet

NumPy isn't just flat lists. You can have rows and columns, and slicing through them is genuinely lovely.

```python
m = np.array([[1, 2, 3],
              [4, 5, 6]])

m.shape         # (2, 3) -> 2 rows, 3 columns
m[0, 1]         # 2      -> row 0, column 1
m[:, 1]         # [2 5]  -> all rows, column 1
m.T             # transpose (rows become columns)
```

Look at `m[:, 1]`. That's "give me column 1, every row." Try writing that with regular lists. You can, but it's not nearly as clean.

### A few small things to watch out for

I tripped over these. So will you, probably. Worth knowing up front.

* **One type only.** Try to mix a number and a string and NumPy will turn everything into strings. Almost always not what you want.
* **Fixed size.** Once you make an array, you can't really grow it. If you're collecting values one by one, build a normal list first and then convert with `np.asarray(my_list)` at the end.
* **Slices share memory.** This one's sneaky. A slice of a NumPy array points back at the original. Change the slice and you change the original. Use `.copy()` if you want a real separate copy.

### Should you use it?

Pretty simple rule.

* If your code is full of numbers and you find yourself looping over them, yes, switch to NumPy. Your future self will be happier.
* If your data is mixed types or just CRUD-style stuff, stick with regular lists. Don't add a dependency you don't need.

And here's a bonus reason to learn NumPy now if you're new: pretty much every data science and machine learning library you've heard of (pandas, scikit-learn, PyTorch, TensorFlow) sits on top of NumPy. Learn it once, and it pays you back for years.

That's the whole pitch. Go play with it for an afternoon. You'll be surprised how natural it starts to feel.
