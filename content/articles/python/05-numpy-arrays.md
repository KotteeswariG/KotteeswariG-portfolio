# When to Use NumPy Arrays

A normal Python list is great for most things. But when you have **lots of numbers** and you want to do math on them (like average test scores, daily temperatures, prices), a list starts to feel slow. That is when people switch to NumPy.

### What is NumPy?

It's an extra Python tool that you install once:

```bash
pip install numpy
```

Then you import it. Everyone uses the short name `np`:

```python
import numpy as np
```

### Try it with test scores

Say five students take a test.

```python
scores = np.array([78, 85, 92, 67, 88])

print(scores.mean())   # 82.0   - average
print(scores.max())    # 92     - highest
print(scores.sum())    # 410    - total
```

Notice there are no loops. NumPy does the math on the whole list at once.

### Math on every value

Want to add 5 bonus marks to everyone?

```python
boosted = scores + 5
# [83 90 97 72 93]
```

Want to double a list of prices?

```python
prices = np.array([10, 20, 30])
print(prices * 2)   # [20 40 60]
```

One line each. With a normal list you would need a loop. NumPy is also much faster.

### Two arrays together

```python
math    = np.array([78, 85, 92])
english = np.array([70, 88, 81])

total = math + english
# [148 173 173]
```

### A few things to know

* All values must be the same kind. No mixing numbers and words.
* The size is fixed once you make it.
* If you slice an array and change the slice, the original changes too. Use `.copy()` if you don't want that.

### When should I use NumPy?

Easy rule:

* **Lots of numbers, want fast math** → use NumPy.
* **Mixed stuff or everyday code** → just use a list.

If you ever plan to do data work, machine learning, or science, NumPy is the foundation under almost everything else. Learn it once and it pays back for years.
