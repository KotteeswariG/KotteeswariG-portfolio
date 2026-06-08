# SQL SELECT Basics

SQL is the language you use to ask questions of a database. The most common question is "give me some rows from this table". That's what `SELECT` is for. Let me walk through the basic shape.

### The simplest SELECT

Basically, imagine a spreadsheet of users. You want to see all of it.

```sql
SELECT * FROM users;
```

The `*` means "all columns". `FROM users` means "from the users table". Hit run and you get every row, every column.

### Pick just the columns you want

You probably don't need every column. Pick the ones you care about.

```sql
SELECT name, email FROM users;
```

This returns just two columns per row. Smaller result, faster query.

### Filter with WHERE

Most of the time, you want only *some* rows. Use `WHERE`.

```sql
SELECT name, email FROM users WHERE country = 'AU';
```

Only rows where the country is `AU`. The `=` is a single equals, not double. (Yes, slightly different from most programming languages.)

You can combine conditions with `AND` / `OR`:

```sql
SELECT name FROM users
WHERE country = 'AU' AND age >= 18;
```

### Sort the results

Use `ORDER BY` to sort. Add `DESC` to go biggest-to-smallest.

```sql
SELECT name, age FROM users
ORDER BY age DESC;
```

### Limit how many you get back

When the table is big, you usually don't want every row. `LIMIT` says how many.

```sql
SELECT name FROM users LIMIT 10;
```

First 10 rows only. Combine with `ORDER BY` to get "top 10":

```sql
SELECT name, score FROM players
ORDER BY score DESC
LIMIT 10;
```

That's a leaderboard query in three lines.

### The order to remember

Actually, the keywords always appear in this order:

```
SELECT  ... columns ...
FROM    ... table ...
WHERE   ... filter rows ...
ORDER BY ... sort ...
LIMIT   ... how many ...
```

If you mix the order, the database complains.

### Why does it matter?

Because almost every report, dashboard, or admin page starts with one of these queries. Once you've internalised `SELECT / FROM / WHERE / ORDER BY / LIMIT`, you can answer almost any "show me data" question.

One small tip: avoid `SELECT *` in production code. Pick the columns you actually need. Faster, less data over the wire, and your code doesn't break when someone adds a column to the table.
