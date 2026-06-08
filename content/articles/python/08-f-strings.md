# f-strings in Python

Sooner or later you want to print a sentence with a value inside it. Like "Hello, Alice!" where the name comes from a variable. Python has a really clean way to do this. It is called an f-string.

### What is an f-string?

Basically, imagine a normal string with little holes you can fill in. You put a small `f` in front of the quotes, and anything inside `{ }` gets replaced with a Python value.

```python
name = "Alice"
greeting = f"Hello, {name}!"

print(greeting)    # Hello, Alice!
```

That little `f` is the whole trick. It tells Python "this string has placeholders, please fill them in".

### You can put any expression inside

The thing in the curly brackets does not have to be a plain variable. It can be a calculation, a function call, anything.

```python
price = 50
tax = 0.10

print(f"Total: ${price * (1 + tax)}")    # Total: $55.0
print(f"Name in caps: {'alice'.upper()}")  # Name in caps: ALICE
```

Whatever is inside the `{ }` gets evaluated, then the result drops into the string.

### Formatting numbers

Actually, this is where f-strings really shine. You can format the value inside the brackets.

```python
pi = 3.14159

f"{pi:.2f}"        # "3.14"          - 2 decimal places
f"{1234567:,}"     # "1,234,567"     - add commas
f"{0.85:.0%}"      # "85%"           - percentage
```

The format part comes after a colon. Two decimal places, commas, percentages, padding... lots of small tricks live there.

### A debug shortcut

Python 3.8 added a tiny extra: an equals sign at the end of a placeholder, which prints both the name and the value.

```python
score = 92
print(f"{score=}")     # score=92
```

Super handy for quick debugging.

### Why does it matter?

Because printing messages, building log lines, sending emails, building filenames... almost every program does this. f-strings make it short, clear, and fast. Way nicer than the older `%` and `.format()` ways.

One small tip: if you see a string that says something like `"Hello, " + name + "!"`, that is a string you can rewrite as an f-string. Cleaner every time.
