# Python Lists vs Arrays

When I started Python, I thought a list and an array were the same thing. They are not. Python has a few ways to hold a row of items, and each one is good for a different job. Let me tell you what I found out.

### The list

This is the one you will use most. A list can hold anything. Numbers, words, even other lists. You make one with square brackets.

```python
items = [1, "two", 3.0]
items.append("four")

print(items[0])    # 1
print(items[-1])   # "four"
```

That is it. You add things, you read things by position. For most code, a list is enough.

### The array module

Python also has a small thing called `array`. It only holds numbers, and they must all be the same type. It uses less memory than a list.

```python
from array import array
nums = array("i", [1, 2, 3, 4])   # "i" means whole numbers
nums.append(5)
```

You will not need this often. Use it only if you have lots of same type numbers and you care about memory.

### NumPy

For real number work, like big lists of numbers, tables, or images, people use NumPy. It is a library you install:

```bash
pip install numpy
```

Then you can do math on a whole array at once, no loop needed.

```python
import numpy as np

a = np.array([1, 2, 3, 4])
print(a * 2)      # [2 4 6 8]
print(a.mean())   # 2.5
```

That is the cool part. One line does what a `for` loop would do, and it is much faster.

### So which one

* Use a normal `list` most of the time.
* Use the `array` module if you have lots of same type numbers and memory matters.
* Use NumPy for math, tables, or anything to do with data science.

Same shape, three tools. Pick the one that fits the job.
