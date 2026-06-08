# Python Lists vs Arrays

Quick question. When you started learning Python, did you also assume "list" and "array" were just two words for the same thing? Yeah, me too. They're not, and figuring out the difference saved me a fair bit of confusion later. So let's walk through it.

Python actually gives you three ways to hold a row of values, and each one is good at a different job.

### Start here: the plain list

This is the one you'll reach for 90 percent of the time. A `list` is friendly. You make one with square brackets, you can put pretty much anything inside, and it just grows on its own when you add things.

```python
items = [1, "two", 3.0]
items.append("four")

print(items[0])    # 1
print(items[-1])   # "four"
```

Notice you can mix numbers and strings in the same list. Python won't complain. For day to day code, this is honestly all you need.

### When a list feels heavy: the array module

Here's something that doesn't come up often. If you're holding a *lot* of numbers and they're all the same type, a normal list uses more memory than it really has to. Python's standard library has a small helper called `array` for exactly that situation.

```python
from array import array
nums = array("i", [1, 2, 3, 4])   # "i" means whole numbers
nums.append(5)
```

It looks and feels like a list, just stricter about types. Don't worry about this one yet. You'll know when you need it.

### When the work is real math: NumPy

This is the one people actually mean when they say "Python array" most of the time. NumPy isn't built in. You install it with `pip install numpy`, and then suddenly you can do this:

```python
import numpy as np

a = np.array([1, 2, 3, 4])
print(a * 2)      # [2 4 6 8]
print(a.mean())   # 2.5
```

No loop. The whole array gets multiplied or averaged in one shot. That's the magic moment with NumPy. If you're heading anywhere near data science, machine learning, or anything with serious numbers, you'll see NumPy everywhere.

### So which one?

Easiest rule I can give you:

* For everyday stuff, just use `list`. Don't overthink it.
* For tight-memory numeric situations, the `array` module is sitting there waiting.
* For real math, NumPy is the answer.

Same shape underneath (a row of items), three different tools, picked based on the job. That's it.
