# Implementing a Stack in Python

A stack is one of the simplest data structures, and it shows up everywhere — undo buttons, browser back, even the way function calls work inside your computer. Let me show you what a stack is and how to build one in Python in just a few lines.

### What is a Stack?

Basically, imagine a stack of plates in the kitchen. You put a plate on the top, you take a plate off the top. You never reach into the middle. That's a stack.

Two operations matter:

* **push** — add a plate on top.
* **pop** — take the top plate off.

Computer-science people call this **LIFO**: Last In, First Out. The last thing you pushed is the first thing you pop.

### The easiest way in Python

Actually, you do not need a special library. A Python `list` already works as a stack. `append` is push, `pop` is pop.

```python
stack = []

stack.append("plate 1")
stack.append("plate 2")
stack.append("plate 3")

print(stack)        # ["plate 1", "plate 2", "plate 3"]

top = stack.pop()
print(top)          # "plate 3"
print(stack)        # ["plate 1", "plate 2"]
```

That's the whole thing. `append` adds on top, `pop` removes from the top. Both are fast (O(1)).

### A nicer wrapper

If you want a clearer name, wrap it in a class. Same logic, prettier interface.

```python
class Stack:
    def __init__(self):
        self._items = []

    def push(self, value):
        self._items.append(value)

    def pop(self):
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self):
        return self._items[-1] if self._items else None

    def is_empty(self):
        return len(self._items) == 0
```

`peek` shows you the top without removing it. `is_empty` is handy for `while`-loops.

### A real example: matching brackets

A classic problem. Given a string, check if every opening bracket has a matching closing bracket in the right order. Stacks make this easy.

```python
def brackets_match(s):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}

    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack or stack.pop() != pairs[ch]:
                return False

    return not stack

print(brackets_match("({[]})"))   # True
print(brackets_match("({[})"))    # False
```

Every opening bracket gets pushed. Every closing bracket checks the top of the stack. Clean.

### Why does it matter?

Because once you see "the order I just saw things, in reverse" you'll spot stacks everywhere. Undo, navigation history, parsing math expressions, even the function call stack itself.

One small tip: never use `list.insert(0, ...)` and `list.pop(0)` to build a stack-like thing on the bottom. Both are O(n) because they shift everything. If you really want a fast double-ended stack, use `collections.deque`.
