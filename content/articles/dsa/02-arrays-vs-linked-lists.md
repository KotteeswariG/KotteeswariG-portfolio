# Arrays vs Linked Lists

Two of the most common ways to store a row of items are arrays and linked lists. They look alike from the outside but work very differently inside. Let me explain the difference in simple terms.

### What is an Array?

Basically, imagine a row of mailboxes outside an apartment building. They are numbered 1, 2, 3, all sitting in a line. If I tell you "open box 17", you walk straight to box 17. Quick.

An array works the same way. Every item has a fixed position, and the computer can jump straight to any position. Fast lookup.

```python
mail = ["bill", "letter", "magazine", "postcard"]
mail[2]    # "magazine"  - instant
```

The catch: if you want to insert a new mailbox in the middle, you have to shift every box after it. That is slow.

### What is a Linked List?

Now imagine a treasure hunt. Each clue tells you where the next clue is. You can't jump straight to clue 5. You have to follow clue 1, then 2, then 3, then 4, then 5.

A linked list works the same way. Each item holds its value **plus a pointer to the next item**.

```
[bill] -> [letter] -> [magazine] -> [postcard] -> end
```

Looking up the third item means walking from the start. Slow.

But here is the trade-off: inserting a new item in the middle is fast. You just change two pointers.

### Quick comparison

| Operation       | Array     | Linked List |
| --------------- | --------- | ----------- |
| Get item at N   | O(1) fast | O(n) slow   |
| Add at the end  | O(1)*     | O(1)        |
| Insert middle   | O(n) slow | O(1) fast** |
| Memory          | tight     | extra (for pointers) |

\* When the array has spare space.
\*\* Once you've already walked to that position.

### A real example

A music playlist is a great fit for a linked list. You're always at the current song, and you mostly insert "next song" or "add to queue". You rarely jump to song number 73.

A score table in a game is a great fit for an array. You look up player 5's score directly all the time.

### Python's `list`?

Actually, Python's built-in `list` is an *array* under the hood, even though it's called "list". For a real linked list in Python, use `collections.deque` or build your own. Most of the time, the array-based `list` is what you want.

### Why does it matter?

Because the right data structure makes the difference between fast and slow code. Same problem, different shape, different speed.

One small tip: when in doubt, start with an array. Switch to a linked list only when you have a real "lots of inserts in the middle" use case. In day-to-day code, arrays win.
