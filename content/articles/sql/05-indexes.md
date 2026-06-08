# SQL Indexes

If you've ever wondered why some queries are slow even with a small bit of data, the answer is usually indexes. They are the database's secret weapon for speed. Let me explain in plain terms.

### What is an Index?

Basically, imagine a thick book with no table of contents. To find a topic, you'd have to flip through every page. Painful.

A book has an index at the back. You look up "elephants", it tells you "page 247", you jump straight there.

A database index works the same way. It is a small, sorted lookup that helps the database **jump straight to the rows** without scanning the whole table.

### Without an index

Say you have a `users` table with a million rows.

```sql
SELECT * FROM users WHERE email = 'alice@example.com';
```

Without an index on `email`, the database reads **every single row** to check the email. That's a million checks. Slow.

### With an index

```sql
CREATE INDEX idx_users_email ON users(email);
```

Now the database keeps a sorted lookup of emails on the side. The same query becomes a quick lookup, then a jump to the row. Often hundreds of times faster.

### When should I add an index?

A simple rule. Add an index on a column when:

* You filter by it in `WHERE` (`WHERE email = ...`)
* You join on it (`ON orders.user_id = users.id`)
* You sort by it (`ORDER BY created_at`)

Most databases automatically index your primary key (`id`). For everything else, you add them.

### The trade-off

Actually, indexes aren't free. Every time you `INSERT`, `UPDATE`, or `DELETE`, the database also updates its indexes. So:

* **Many indexes** → reads are fast, writes are slower.
* **No indexes** → reads are slow, writes are fast.

Most apps read much more than they write, so adding the right indexes is almost always a win.

### A common mistake

Not every index helps. The database has to think the index will save it time. So:

```sql
SELECT * FROM users WHERE LOWER(email) = 'alice@example.com';
```

This will *not* use the index on `email`, because `LOWER(email)` is a computation. Either change the query to `email = 'alice@example.com'` or build the index on the lower-cased version.

### How to check if it's being used

Most databases have an `EXPLAIN` command.

```sql
EXPLAIN SELECT * FROM users WHERE email = 'alice@example.com';
```

If you see "Index Scan using idx_users_email", great. If you see "Seq Scan" on a big table, your index isn't being used.

### Why does it matter?

Because the difference between a query taking 5 milliseconds and 5 seconds is almost always an index. They are the single biggest lever you have for database performance.

One small tip: don't add an index "just in case". Add them when a query is actually slow. Each extra index uses memory and slows writes. Aim for the smallest set that makes your real queries fast.
