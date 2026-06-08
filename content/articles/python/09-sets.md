# Python Sets

Sometimes you have a list of things, but you only care about the **unique** ones. No duplicates. That is where a set comes in.

### What is a Set?

Basically, imagine a list that quietly throws away any repeats. That is a set.

You make one with curly brackets:

```python
colors = {"red", "green", "blue"}

print(colors)   # something like {"blue", "red", "green"}
```

Two things to notice:

* No duplicates allowed.
* The order is not kept. Sets do not remember the order you added items.

### Quick way to find unique items

This is probably the most common reason to use a set. Take a list with duplicates, and just wrap it in `set()`:

```python
votes = ["red", "blue", "red", "green", "red", "blue"]

unique = set(votes)
print(unique)         # {"red", "blue", "green"}
print(len(unique))    # 3
```

Three different colors were voted for. One line, no loop.

### Adding and removing

```python
colors = {"red", "green"}

colors.add("blue")        # {"red", "green", "blue"}
colors.remove("green")    # {"red", "blue"}
```

Actually, `remove` throws an error if the item is not there. If you are not sure, use `discard` instead. It just shrugs and does nothing.

```python
colors.discard("yellow")   # no error, no change
```

### Set math (the cool part)

Sets let you do math on collections. This is genuinely useful.

```python
a = {"alice", "bob", "carol"}
b = {"bob", "dave"}

a | b    # union: everyone in either set         -> {"alice", "bob", "carol", "dave"}
a & b    # intersection: only those in BOTH       -> {"bob"}
a - b    # difference: in a but not in b          -> {"alice", "carol"}
```

So if you have two lists of users and you want to know who is in both, you can do it in one line.

### Why does it matter?

Because checking "is this thing already in here?" is a really common task. Lists do it slowly when they get big. Sets are made for it.

```python
"red" in colors    # very fast, no matter how big the set is
```

If you find yourself writing `if x not in seen_list: seen_list.append(x)`, you almost always want a set instead.

One small tip: a set cannot hold lists or dicts (because those can change). It can hold numbers, strings, and tuples. If you need uniqueness, use a set. If you need order, use a list.
