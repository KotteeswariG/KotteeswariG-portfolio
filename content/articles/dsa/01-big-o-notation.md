# Big O Notation in Simple Words

The first time I saw "O(n)" written in a textbook, I had no idea what it meant. It looked like math. Turns out it is not as scary as it looks. Let me explain it the way I wish someone had explained it to me.

### What is Big O?

Basically, imagine you have a stack of papers and you want to find one with a specific name on it. If the stack has 10 papers, it takes 10 quick checks at worst. If the stack has 1000 papers, it takes 1000 checks. The work grows with the size of the stack.

Big O is a way to describe **how the work grows when the input gets bigger**. That's it. No more, no less.

We write it like `O(...)` with a letter inside that stands for the input size.

### The common ones, in plain English

* `O(1)` — *constant*. Same work no matter how big the input is. Like looking up a value in a dictionary by its key.
* `O(n)` — *linear*. Work grows in line with the input. Like reading every name in a list once.
* `O(log n)` — *logarithmic*. Work grows very slowly. Like finding a name in a phonebook by flipping to the middle, then halving each time.
* `O(n²)` — *quadratic*. Work grows quickly. Like comparing every person in a room with every other person.

If you double the input, here is what happens:

* O(1) → no change (1 step is still 1 step)
* O(n) → twice the work
* O(log n) → one extra step
* O(n²) → four times the work

You see why people are excited when an algorithm is O(log n) and worried when it is O(n²).

### A quick example

Two functions that both add up all numbers in a list.

```python
def sum_loop(items):
    total = 0
    for x in items:        # one pass through the list
        total += x
    return total
```

That is O(n). One pass, work grows with size.

```python
def sum_pairs(items):
    total = 0
    for x in items:        # outer loop
        for y in items:    # inner loop
            total += x * y
    return total
```

Two nested loops over the same list. That is O(n²). If `items` has 1000 entries, that is 1 million operations.

### Why does it matter?

Because when your code works fine on 10 items but becomes painful at 10,000, the cause is almost always the Big O. Knowing the rough shape of each algorithm helps you pick the right one *before* it becomes a problem.

One small tip: do not stress about exact numbers. Big O ignores constants. `O(2n)` and `O(n)` mean the same thing in practice. What matters is the **shape** of the growth.
