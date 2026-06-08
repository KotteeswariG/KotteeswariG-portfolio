# SQL JOINs

Sooner or later, your data lives in more than one table. You have `users` over here and `orders` over there. To answer "what did Alice buy?", you have to combine the two. That is what `JOIN` is for.

### Two tables

Basically, imagine you have these tables:

```
users                       orders
+----+--------+             +----+---------+--------+
| id | name   |             | id | user_id | item   |
+----+--------+             +----+---------+--------+
| 1  | Alice  |             | 1  | 1       | book   |
| 2  | Bob    |             | 2  | 1       | pen    |
| 3  | Carol  |             | 3  | 2       | hat    |
+----+--------+             +----+---------+--------+
```

`orders.user_id` points to `users.id`. You can use a JOIN to stitch them together.

### INNER JOIN

The most common one. Returns only the rows that have a match in both tables.

```sql
SELECT users.name, orders.item
FROM users
INNER JOIN orders ON orders.user_id = users.id;
```

Result:

```
name  | item
------+------
Alice | book
Alice | pen
Bob   | hat
```

Notice Carol is missing — she has no orders.

### LEFT JOIN

Gives you **everyone on the left**, plus matching rows on the right. If there's no match, the right-side columns are `NULL`.

```sql
SELECT users.name, orders.item
FROM users
LEFT JOIN orders ON orders.user_id = users.id;
```

Result:

```
name  | item
------+------
Alice | book
Alice | pen
Bob   | hat
Carol | NULL
```

Now Carol shows up, with a `NULL` item. Perfect for "list all users and any orders they might have".

### RIGHT JOIN

Same idea as LEFT JOIN, but everyone on the **right** stays. You don't see it as often. People usually just swap the table order and use LEFT JOIN instead.

### Quick way to remember

* **INNER JOIN** → rows with a match in *both* tables.
* **LEFT JOIN** → everything from the left + matching rows from the right.
* **RIGHT JOIN** → everything from the right + matching rows from the left.

### A common gotcha

Actually, watch out for filtering joined data with `WHERE`. If you `LEFT JOIN` orders and then add `WHERE orders.item = 'book'`, you've accidentally turned it into an inner join — `NULL` items are excluded. Put the filter in the `ON` clause instead, or use `WHERE orders.item = 'book' OR orders.item IS NULL`.

### Why does it matter?

Because relational databases are *built* around splitting data across multiple tables. JOINs are how you put it back together. Almost every interesting query has at least one.

One small tip: when you write a JOIN, picture which rows you want to keep. "Everyone, even with no orders" → LEFT JOIN. "Only people who actually ordered" → INNER JOIN. The right answer falls out from there.
