# Common Python List Methods

A Python list comes with a small set of built in methods. A *method* is just a function that belongs to the list. You call one like this: `mylist.method_name(...)`.

Below are the methods you will use most often, grouped by what they do.

### Add items

You have three choices, depending on what you want to add.

```python
items = [1, 2]

items.append(3)         # [1, 2, 3]
items.extend([4, 5])    # [1, 2, 3, 4, 5]
items.insert(0, 0)      # [0, 1, 2, 3, 4, 5]
```

* `append(value)`: add **one** item to the end.
* `extend(other_list)`: add **many** items to the end.
* `insert(position, value)`: add an item at a chosen position.

Small note. If you do `items.append([4, 5])`, the whole inner list is added as a single item. That is rarely what you want. Use `extend` to merge two lists.

### Remove items

Again, three choices. Pick based on what you know.

```python
items = [1, 2, 3, 2, 4]

items.remove(2)   # remove the first 2     -> [1, 3, 2, 4]
items.pop()       # remove the last item   -> 4
items.pop(0)      # remove at position 0   -> 1
items.clear()     # empty the whole list
```

* `remove(value)`: takes the value you want to drop.
* `pop()`: removes the last item and gives it back to you.
* `pop(position)`: removes an item at a given position and gives it back.
* `clear()`: empties the list.

### Find things

Three handy tools for asking questions about a list.

```python
nums = [10, 20, 30, 20]

20 in nums       # True
50 in nums       # False
nums.index(20)   # 1   - position of the first 20
nums.count(20)   # 2   - how many 20s in the list
```

* `value in list`: gives `True` or `False`.
* `list.index(value)`: gives the position of the first match.
* `list.count(value)`: gives the count of how many times the value appears.

Small note. `index` throws an error if the value is not in the list. Best to check with `in` first.

### Sort items

For sorting, you have two options. They look similar but work differently.

```python
words = ["pear", "apple", "cherry"]

words.sort()              # changes the list in place
words.sort(reverse=True)  # big to small
words.sort(key=len)       # sort by string length
```

* `list.sort()`: changes the list in place (your list is now sorted).
* `sorted(list)`: returns a **new** sorted list and leaves the original alone.

The `key=` option is very useful. You pass it a small function that gets called on each item, and Python sorts by what that function returns. So `sort(key=len)` sorts by string length.

### Bonus: enumerate

This is not a list method, but it pairs naturally with one. When you loop and you want both the position and the value, use `enumerate`.

```python
for i, name in enumerate(["alice", "bob", "carol"]):
    print(i, name)
```

Without it, you would write `for i in range(len(...))` which is messier. `enumerate` is cleaner.

### Quick summary

Most list work is one of four things:

* **Add** with `append`, `extend`, `insert`.
* **Remove** with `remove`, `pop`, `clear`.
* **Find** with `in`, `index`, `count`.
* **Sort** with `sort`, `sorted`.

Memorise these and you can handle nearly every list task in Python.
