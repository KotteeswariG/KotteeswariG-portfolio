# Common Python List Methods

You will end up using lists in basically every Python program you write. Lucky for us, they come with a small set of methods that handle most of what you'd ever want to do. I'll walk you through the ones I actually reach for, with a tiny example for each.

### Adding items

Three methods, and you'll get a feel for when each one fits pretty quickly.

```python
items = [1, 2]

items.append(3)         # [1, 2, 3]
items.extend([4, 5])    # [1, 2, 3, 4, 5]
items.insert(0, 0)      # [0, 1, 2, 3, 4, 5]
```

* `append` adds **one** thing to the end.
* `extend` adds **many** things to the end (when you have another list to merge in).
* `insert(position, value)` puts something at a specific spot.

Quick warning. If you do `items.append([4, 5])`, you'll add the whole inner list as a single item. That's almost never what you want. `extend` is the one you want when you have a list of things to add.

### Removing items

Same idea, different question. Do you know the *value* you want gone, or the *position*?

```python
items = [1, 2, 3, 2, 4]

items.remove(2)   # finds the first 2 and drops it -> [1, 3, 2, 4]
items.pop()       # drops the last and hands it to you -> 4
items.pop(0)      # drops at index 0 and hands it to you -> 1
items.clear()     # wipe the whole list
```

A nice thing about `pop`: it gives you back the thing it removed, so you can use it. `remove` just removes and that's it.

### Finding things

When you want to know whether something is there, use `in`. When you want to know where it is, use `index`. When you want to know how many times it shows up, use `count`. All three feel obvious once you've used them.

```python
nums = [10, 20, 30, 20]

20 in nums       # True
50 in nums       # False
nums.index(20)   # 1   - where the first 20 lives
nums.count(20)   # 2   - how many 20s in total
```

(Heads up: `index` complains loudly if the value isn't in the list. So a quick `if 20 in nums` first is a good habit when you're not sure.)

### Sorting things

This is one of the places where `sort` and `sorted` both exist, and the difference matters. `sort` is a *method* and it changes your list in place. `sorted` is a *function* that gives you a new list and leaves the original alone.

```python
words = ["pear", "apple", "cherry"]

words.sort()              # ["apple", "cherry", "pear"]
words.sort(reverse=True)  # big to small
words.sort(key=len)       # sort by string length
```

That `key=` argument is the gift that keeps giving. Pass it a function and Python will sort by whatever that function returns. So you can sort dicts by their `"price"`, objects by some attribute, strings by length, whatever you need.

### One bonus: enumerate

Not a list method, but if you take only one extra thing from this article, take this. When you're looping through a list and you want both the index and the value, use `enumerate`. It looks like this:

```python
for i, name in enumerate(["alice", "bob", "carol"]):
    print(i, name)
```

So much cleaner than messing around with `range(len(...))`. The first time someone showed me this, my code got noticeably nicer.

### That's the toolkit

Honestly, most of what you'll ever do with a list falls into four buckets: add stuff, remove stuff, find stuff, sort stuff. If you know the methods above and you remember `enumerate`, you can write almost any list-juggling code you'll come across.

Happy listing.
