# When to Use NumPy Arrays

A normal Python list is great for most things. But when you have **lots of numbers** and you want to do math on them, a list starts to feel slow. That is when people switch to NumPy.

### What is NumPy?

Basically, NumPy is an extra Python tool for numbers. You install it once:

```bash
pip install numpy
```

Then import it with the short name `np`:

```python
import numpy as np
```

You will see `import numpy as np` at the top of nearly every NumPy tutorial.

### What does it look like?

Imagine five students take a test. You want the average, the highest, the total.

```python
scores = np.array([78, 85, 92, 67, 88])

print(scores.mean())   # 82.0
print(scores.max())    # 92
print(scores.sum())    # 410
```

Notice there are no loops. NumPy does the math on the whole array at once.

### Math on every value

Want to give everyone 5 bonus marks?

```python
boosted = scores + 5
# [83 90 97 72 93]
```

Want to double every price in a list?

```python
prices = np.array([10, 20, 30])
prices * 2
# [20 40 60]
```

In a normal list, both of these need a `for` loop. NumPy makes it one line, and it is also much faster.

### Two arrays together

```python
math    = np.array([78, 85, 92])
english = np.array([70, 88, 81])

total = math + english
# [148 173 173]
```

Two arrays, one line, done.

### A few things to watch

Actually, three things tripped me up at first:

* All values must be the same kind. No mixing numbers and words.
* The size is fixed once you make the array.
* A slice shares memory with the original. Change the slice, you change the original. Use `.copy()` if you don't want that.

### Why does it matter?

Because if you ever do data work, machine learning, or science, NumPy is everywhere. Pandas, scikit-learn, PyTorch, TensorFlow are all built on top of it. Learning it now pays off for years.

One small tip: don't try to learn all of NumPy at once. Just start using `np.array(...)` for any list of numbers you want to do math on. The rest you pick up as you need it.
