# Common Python List Methods

A *method* is a small function that comes attached to a list. You call one like this: `mylist.method_name(...)`. Python lists have a small set of these built in. Let me walk through the ones you will use the most, using a simple shopping list as the example.

### Add items

You have three choices, depending on what you want to add.

```python
shopping = ["milk", "bread"]

shopping.append("eggs")              # ["milk", "bread", "eggs"]
shopping.extend(["butter", "jam"])   # ["milk", "bread", "eggs", "butter", "jam"]
shopping.insert(0, "tea")            # ["tea", "milk", "bread", "eggs", "butter", "jam"]
```

* `append(value)` → add **one** item to the end.
* `extend(other_list)` → add **many** items to the end.
* `insert(position, value)` → add an item at a chosen position.

Tip: if you do `shopping.append(["butter", "jam"])`, the whole inner list is added as one item. Almost never what you want. Use `extend` when you want to merge two lists.

### Remove items

Same idea, but going the other way.

```python
shopping = ["milk", "bread", "eggs", "milk"]

shopping.remove("milk")    # removes the first "milk"  -> ["bread", "eggs", "milk"]
shopping.pop()             # removes the last item     -> "milk", list becomes ["bread", "eggs"]
shopping.pop(0)            # removes at position 0     -> "bread", list becomes ["eggs"]
shopping.clear()           # empty the whole list
```

* `remove(value)` → finds a value and drops it.
* `pop()` → removes the last item and gives it back to you.
* `pop(position)` → removes at a given position and gives it back.
* `clear()` → empties the list.

Useful fact: `pop` returns the thing it removed, so you can use it. `remove` does not.

### Find things

Three tools for asking questions about a list.

```python
fruits = ["apple", "banana", "mango", "banana"]

"mango" in fruits        # True
"grape" in fruits        # False
fruits.index("banana")   # 1   - position of the first "banana"
fruits.count("banana")   # 2   - how many "banana"s in the list
```

* `value in list` → True or False.
* `list.index(value)` → position of the first match.
* `list.count(value)` → how many times the value appears.

Small note: `index` throws an error if the value is not in the list. Best to check with `in` first.

### Sort items

For sorting, you have two options. They look alike but behave differently.

```python
words = ["pear", "apple", "cherry"]

words.sort()               # changes the list  -> ["apple", "cherry", "pear"]
words.sort(reverse=True)   # reverse order     -> ["pear", "cherry", "apple"]
words.sort(key=len)        # sort by string length
```

* `list.sort()` → changes the list in place.
* `sorted(list)` → makes a new sorted list and leaves the original alone.

The `key=` option is very handy. It takes a small function and sorts by what that function returns. So `sort(key=len)` sorts by length.

### Bonus: enumerate

Not a list method, but it goes nicely with loops. When you want both the position and the value as you loop, use `enumerate`.

```python
guests = ["Alice", "Bob", "Carol"]

for i, name in enumerate(guests):
    print(i, name)

# 0 Alice
# 1 Bob
# 2 Carol
```

So much cleaner than writing `for i in range(len(guests))`.

### Summary

Most list work falls into four buckets:

* **Add** with `append`, `extend`, `insert`
* **Remove** with `remove`, `pop`, `clear`
* **Find** with `in`, `index`, `count`
* **Sort** with `sort`, `sorted`

Memorize these and you can handle nearly every list job in Python.
