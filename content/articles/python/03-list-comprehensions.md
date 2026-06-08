# List Comprehensions in Python

A list comprehension is a short way to build a new list from an old one. That is the whole idea. Where you would normally write a small loop, you write one line.

### What does it look like?

Basically, imagine you have prices and you want to double each one.

The long way (a loop):

```python
prices = [10, 20, 30]
doubled = []
for p in prices:
    doubled.append(p * 2)
```

The short way:

```python
doubled = [p * 2 for p in prices]
# [20, 40, 60]
```

Read it left to right: *for each `p` in prices, give me `p * 2`*. The square brackets make it a list.

### Skip the ones you don't want

Add an `if` to filter:

```python
numbers = [1, 2, 3, 4, 5, 6]
evens = [n for n in numbers if n % 2 == 0]
# [2, 4, 6]
```

This says: *for each `n`, but only keep it if it is even*.

### Pick between two values

```python
scores = [55, 70, 40, 85]
result = ["pass" if s >= 50 else "fail" for s in scores]
# ["pass", "pass", "fail", "pass"]
```

Actually, watch the difference here:

* `if` at the **end** = filter (keep or skip).
* `if/else` at the **front** = pick between two values.

Same word, different jobs. This trips everyone up once.

### When *not* to use it

If the job needs many lines per item, or you need to print things, or handle errors, just write a regular `for` loop. The whole point of a comprehension is to read like a short sentence.

### Why does it matter?

Because half the small loops in Python can shrink to one line. Your code gets shorter and easier to read.

One small tip: try writing the loop version first, then convert it. After a week of doing that, your brain will skip the loop step and write the comprehension straight away.
