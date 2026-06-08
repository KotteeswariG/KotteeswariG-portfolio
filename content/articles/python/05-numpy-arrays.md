# When to Use NumPy Arrays

For most Python code, a normal `list` is enough. But the moment you start working with **many numbers** (like class test scores, daily temperatures, image pixels, or rows of data), a list starts to feel slow and clunky. That is the moment people switch to NumPy.

Let me show you what NumPy is and why it is so useful, with simple examples.

### What is NumPy?

NumPy is a Python *library*. A library is just extra code that someone else wrote, packaged, and shared with the world. NumPy gives you a new kind of value called an *array*, plus a big set of math tools that work on it.

NumPy is not built into Python. You install it once with pip:

```bash
pip install numpy
```

Everyone imports it with the short name `np`. You will see this everywhere:

```python
import numpy as np
```

### Example: a list of test scores

Imagine you have the test scores of five students.

```python
scores = np.array([78, 85, 92, 67, 88])

print(scores)            # [78 85 92 67 88]
print(scores.mean())     # 82.0      - average score
print(scores.max())      # 92        - highest score
print(scores.min())      # 67        - lowest score
print(scores.sum())      # 410       - total
```

Look at that. No `for` loops. NumPy does all the math for the whole array at once.

### Doing math on every value

You can also do math on every value in one line.

```python
scores = np.array([78, 85, 92, 67, 88])

# Add 5 bonus marks to everyone
boosted = scores + 5
print(boosted)           # [83 90 97 72 93]

# Convert to percentage out of 100 (if the test was out of 95)
percent = scores * 100 / 95
print(percent)           # [82.10 89.47 96.84 70.52 92.63]
```

In a normal list you would need a `for` loop for each of these. NumPy makes it one line, and it is also a lot faster because the work happens in fast low-level code, not in Python.

### Two arrays at once

If you have two arrays, you can do math between them too.

```python
math   = np.array([78, 85, 92])
english= np.array([70, 88, 81])

total  = math + english
average= (math + english) / 2

print(total)     # [148 173 173]
print(average)   # [74. 86.5 86.5]
```

### Two dimensions: like a small spreadsheet

NumPy can also hold a grid of values, like a table with rows and columns.

```python
marks = np.array([[78, 85, 92],   # row 0: Alice
                  [70, 88, 81],   # row 1: Bob
                  [60, 75, 70]])  # row 2: Carol

print(marks.shape)   # (3, 3)   - 3 rows, 3 columns

print(marks[0, 1])   # 85       - Alice's second mark
print(marks[:, 0])   # [78 70 60]  - everyone's first mark (column 0)
print(marks.mean(axis=1))  # [85. 79.66 68.33]  - average per student (per row)
```

`marks[:, 0]` means "give me column 0, for every row". You can fake this with a list of lists, but NumPy makes it much cleaner.

### A few things to watch out for

These tripped me up at first. Worth knowing:

* **Same type only.** Mix numbers and strings, and NumPy turns everything into strings. Almost never what you want.
* **Fixed size.** Once you make an array, you cannot easily grow it. Build a normal list first, then turn it into an array at the end with `np.asarray(my_list)`.
* **Slices share memory.** A slice of a NumPy array points back to the original. Change the slice and you change the original. Use `.copy()` if you want a separate copy.

### When should I use NumPy?

A simple rule:

* **Lots of numbers and you want fast math** → use NumPy.
* **Mixed types or normal app code** → stick with a `list`.

If you are heading into data science or machine learning, NumPy is even more useful. Pandas, scikit-learn, PyTorch, and TensorFlow are all built on top of it. Learn it once and it pays you back for years.

That is the whole pitch. Install it, try it on a list of scores or temperatures, and you will get the feel of it in an afternoon.
