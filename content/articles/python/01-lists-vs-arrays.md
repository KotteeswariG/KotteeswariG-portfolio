# Python Lists vs Arrays

Imagine you write down a shopping list. Milk. Bread. Eggs. That's a list. In Python, a list works the same way. You keep a bunch of things together, in order.

Python has three different ways to make a "list of things". They look similar but each one is for a different kind of job. Here is the simple version.

### 1. The everyday list

This is what you'll use most of the time. You make one with square brackets.

```python
fruits = ["apple", "banana", "mango"]
```

You can add more, read any item, or mix different kinds of things together. Numbers, words, anything. Easy and friendly.

### 2. The array module

This one is also a list, but with a strict rule: everything inside must be the same kind of number. It is a tiny bit lighter on memory. Most people never use it.

```python
from array import array
scores = array("i", [10, 20, 30])
```

Skip this one until you really need it.

### 3. NumPy arrays

This is the one people mean when they say "Python array" in real life. It is for math. Big lists of numbers, fast calculations, no loops needed.

```python
import numpy as np

scores = np.array([10, 20, 30, 40])

print(scores * 2)        # [20 40 60 80]
print(scores.mean())     # 25.0
```

In a normal list, you'd need a loop to double every number. NumPy does it in one line.

### Which one should you use?

* **Most of the time** → use a list. It just works.
* **Doing math with lots of numbers** → use NumPy.
* **The array module** → ignore unless you have a very specific reason.

That's it. Three tools, but in real code most days you'll only touch two of them.
