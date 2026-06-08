# SQL INSERT, UPDATE, DELETE

`SELECT` reads data. The other three commands you'll use day to day are `INSERT`, `UPDATE`, and `DELETE` — for adding, changing, and removing rows. They are short and almost intuitive once you've seen the shape.

### INSERT: add a row

Basically, imagine a `users` table with columns `name` and `email`. To add a new user:

```sql
INSERT INTO users (name, email)
VALUES ('Alice', 'alice@example.com');
```

You name the columns in brackets, then the values in the same order. Strings go in single quotes.

Insert multiple rows in one go:

```sql
INSERT INTO users (name, email)
VALUES
  ('Bob', 'bob@example.com'),
  ('Carol', 'carol@example.com');
```

Much faster than running INSERT three times.

### UPDATE: change rows

The pattern: `UPDATE table SET column = value WHERE condition`.

```sql
UPDATE users
SET email = 'alice@newdomain.com'
WHERE name = 'Alice';
```

Three parts: which table, what to change, which rows.

You can change multiple columns at once:

```sql
UPDATE users
SET email = 'alice@newdomain.com', country = 'AU'
WHERE id = 1;
```

### DELETE: remove rows

```sql
DELETE FROM users WHERE id = 1;
```

That's it. The row is gone. As with UPDATE, `WHERE` decides which rows.

### The most important rule

Actually, this is the one that catches everyone, including me. **Never forget the WHERE clause** in UPDATE or DELETE.

```sql
UPDATE users SET country = 'AU';   -- updates EVERY user!
DELETE FROM users;                 -- deletes EVERY user!
```

Without a `WHERE`, the command applies to the entire table. Most databases will happily do exactly what you typed.

The safe habit: write your `WHERE` clause first, then add the rest. Or even safer, run a `SELECT` with the same `WHERE` first to confirm what you'll hit:

```sql
SELECT * FROM users WHERE id = 1;   -- check first
DELETE FROM users WHERE id = 1;     -- then delete
```

### Returning what changed

Some databases (PostgreSQL, SQLite, MariaDB) let you ask for the rows you just touched, with a `RETURNING` clause:

```sql
INSERT INTO users (name) VALUES ('Dave')
RETURNING id, name;
```

Saves a separate `SELECT` afterwards.

### Why does it matter?

Because almost every backend feature ends in one of these three. Sign up a user → INSERT. Change a password → UPDATE. Delete an account → DELETE. The four-letter words run the world.

One small tip: wrap risky updates and deletes in a transaction (`BEGIN; ... COMMIT;` or `ROLLBACK;`). If something goes wrong mid-way, you can `ROLLBACK` and pretend nothing happened. The database keeps you safe.
