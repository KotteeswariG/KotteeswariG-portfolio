# Python Lists vs Arrays

When I started Python, I thought a "list" and an "array" were the same thing. They are not. Python gives you a few ways to keep a group of items together. Each one is useful for a different kind of work. Let me explain them with simple examples.

### A list is like a shopping list

A `list` in Python works just like a shopping list. You write items one after another. You can add new items, remove items, or check what is in it.

```python
fruits = ["apple", "banana", "mango"]
fruits.append("orange")

print(fruits)        # ["apple", "banana", "mango", "orange"]
print(fruits[0])     # "apple"      (the first item)
print(fruits[-1])    # "orange"     (the last item)
```

A list can hold anything. Numbers, words, even other lists. For everyday code, this is the one you will use.

### The array module: for many same-type numbers

Python also has a small tool called `array`. It is like a list, but it has two rules:

1. It only stores numbers.
2. All the numbers must be the same kind (for example, all whole numbers).

Because of these rules, it uses a bit less memory than a normal list.

```python
from array import array

scores = array("i", [10, 20, 30, 40])   # "i" means whole numbers
scores.append(50)
```

You will not use this often. Use it only when you have many same-type numbers and you want to save memory.

### NumPy: for math work

When you have **a lot** of numbers and you want to do math on them, people use NumPy. NumPy is a Python library you install once:

```bash
pip install numpy
```

Then you can do math on the whole array in one line. No loop needed.

```python
import numpy as np

prices = np.array([10, 20, 30, 40])

print(prices * 2)        # [20 40 60 80]   - doubled every price
print(prices.mean())     # 25.0            - average price
```

If you wrote this with a normal list, you would need a `for` loop. NumPy does it in one line and is also much faster.

### So which one should I use?

A simple guide:

* **Everyday code** → use a `list`. It is the friendly one.
* **Many same-type numbers and you want to save memory** → use the `array` module.
* **Math, data work, machine learning** → use NumPy.

Same idea (a row of items), three different tools, one for each kind of job.
