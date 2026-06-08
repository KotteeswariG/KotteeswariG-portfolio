# Python Lists vs Arrays

When you start Python, you hear two words a lot: "list" and "array". They sound the same. But actually, Python has a few different tools here, and each one is for a different job.

### What is a List?

Basically, imagine a notebook where you write items one after another. Apples. Bananas. Mangoes. That is a list.

```python
fruits = ["apple", "banana", "mango"]
```

You can put anything inside. Numbers, words, even other lists. For everyday code, this is the one you will use.

### What is the array module?

Actually, Python also has a small thing called `array`. It looks like a list, but with one rule: every item must be the same kind of number.

```python
from array import array
scores = array("i", [10, 20, 30])
```

It uses a tiny bit less memory than a list. Most people never touch it. Don't worry about it.

### What is NumPy?

This is the one people really mean when they say "Python array". NumPy is a separate library you install once:

```bash
pip install numpy
```

Now you can do math on a whole list of numbers, in one line, with no loop.

```python
import numpy as np

scores = np.array([10, 20, 30, 40])

print(scores * 2)        # [20 40 60 80]
print(scores.mean())     # 25.0
```

In a normal list, you would need a loop to double every number. NumPy just does it.

### Why does it matter?

Because using the right tool is the difference between five clean lines and fifty messy ones. For everyday code, a list is enough. For math and data, NumPy will save you hours.

One small tip: when you see `np.array(...)` in tutorials, that is NumPy. When you see just `[1, 2, 3]`, that is a normal list. Same shape, different powers.
