# Python Dictionaries

A list is great when you want a row of items. But what if you want to look something up by name? Like a phone book. That is where a dictionary comes in.

### What is a Dictionary?

Basically, imagine a phone book. You have a name, and you want the number. A dictionary works the same way. Each item has a *key* (the name) and a *value* (the number).

You make one with curly brackets and colons:

```python
phone_book = {
    "Alice": "0412 111 222",
    "Bob":   "0412 333 444",
    "Carol": "0412 555 666",
}
```

To look up Alice's number:

```python
phone_book["Alice"]     # "0412 111 222"
```

That is the whole idea.

### Adding, changing, and removing

```python
phone_book["Dave"] = "0412 777 888"   # add a new entry
phone_book["Alice"] = "0412 000 999"  # change an entry
del phone_book["Bob"]                 # remove an entry
```

Actually, watch this. If you look up a key that does not exist, Python throws an error:

```python
phone_book["Zoe"]    # KeyError!
```

The safe way is `.get()`. It returns `None` (or a value you pick) if the key is missing:

```python
phone_book.get("Zoe")              # None
phone_book.get("Zoe", "Not found") # "Not found"
```

Use `.get()` when you are not sure the key is there.

### Looping through a dictionary

```python
for name, number in phone_book.items():
    print(name, number)
```

`.items()` gives you both the key and the value. Very clean.

If you only need one side:

```python
phone_book.keys()      # all the names
phone_book.values()    # all the numbers
```

### Check if a key is there

```python
"Alice" in phone_book   # True
"Zoe"   in phone_book   # False
```

The same `in` as with lists. Always handy.

### Why does it matter?

Because so much real-world data fits a "name and value" shape. Settings, user profiles, JSON data from web APIs, word counts. If you find yourself searching a list for "the one with this name", a dictionary is almost always the better tool.

One small tip: dictionary keys must be unique. If you write the same key twice, the second one quietly wins. Worth knowing the first time it bites you.
