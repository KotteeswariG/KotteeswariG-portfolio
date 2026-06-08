# Binary Search

If you've ever played the "guess my number between 1 and 100" game, you've already used binary search. It is one of the most useful algorithms in computing, and once you see how it works, you'll never forget it.

### What is Binary Search?

Basically, imagine you're looking up a name in a phonebook. You wouldn't start at "A" and read every page. You'd flip to the middle, see if the name is before or after, and then flip to the middle of that half. Repeat until you find it.

That is binary search. Cut the search range in half each time.

### The rules

For binary search to work, two things must be true:

1. The data is **sorted**.
2. You can access items by position (so an array is fine, a linked list is not great).

### Step by step

Say you have a sorted list of numbers and you want to find 27.

```
[2, 5, 9, 14, 19, 23, 27, 31, 38, 44]
                       ^
            mid -------+
```

1. Look at the middle: 19. Too small. Search the right half.
2. Right half: `[23, 27, 31, 38, 44]`. Middle: 31. Too big. Search the left half of that.
3. Left half: `[23, 27]`. Middle: 23. Too small. Search the right half.
4. Right half: `[27]`. Found it!

Four checks to find one number in a list of ten. With a regular linear search you'd do up to ten.

### In code

```python
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2

        if arr[mid] == target:
            return mid          # found it
        elif arr[mid] < target:
            low = mid + 1       # search right half
        else:
            high = mid - 1      # search left half

    return -1                   # not found
```

`low` and `high` shrink toward each other. The loop runs about `log2(n)` times. For a million-item list, that is around 20 steps.

### Why is it so fast?

Each step throws away **half** the remaining items. So the work doubles when you add an item, but the steps only go up by one. That's the magic of O(log n).

| Items     | Linear search | Binary search |
| --------- | ------------- | ------------- |
| 100       | up to 100     | 7             |
| 1,000     | up to 1,000   | 10            |
| 1,000,000 | up to 1 million| 20           |

### Why does it matter?

Because sorted data is everywhere — sorted user lists, alphabetical names, dates. Whenever you find yourself doing a linear scan over sorted data, binary search can usually take its place and be hundreds of times faster.

One small tip: don't write `mid = (low + high) / 2` in languages where that could overflow. The safer form is `mid = low + (high - low) // 2`. In Python you don't really hit this, but it is good to know once you switch to a language with fixed-size integers.
