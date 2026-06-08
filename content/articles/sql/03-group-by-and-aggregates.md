# SQL GROUP BY and Aggregates

A lot of the questions you ask a database are "how many?", "what's the total?", or "what's the average?". For those, you need *aggregate functions* and `GROUP BY`. They sound fancy but the idea is simple.

### Aggregate functions in plain English

Basically, imagine you have a sales table. Each row is one sale.

```
sales
+----+--------+-------+
| id | region | total |
+----+--------+-------+
| 1  | east   | 100   |
| 2  | west   | 200   |
| 3  | east   | 150   |
| 4  | west   | 50    |
| 5  | east   | 200   |
+----+--------+-------+
```

Common aggregates:

* `COUNT(*)` — how many rows.
* `SUM(column)` — total.
* `AVG(column)` — average.
* `MAX(column)` / `MIN(column)` — biggest and smallest.

So:

```sql
SELECT COUNT(*) AS num_sales, SUM(total) AS total_money
FROM sales;
```

Gives one row: `num_sales = 5`, `total_money = 700`. Everything squashed into a single answer.

### Now add GROUP BY

What if you want the total *per region*, not for the whole table? Add `GROUP BY`.

```sql
SELECT region, SUM(total) AS total_money
FROM sales
GROUP BY region;
```

Result:

```
region | total_money
-------+------------
east   | 450
west   | 250
```

Same aggregate, but now one row **per region** instead of one row overall. `GROUP BY region` says "do the maths once for each unique value of region".

### Multiple groups

You can group by more than one column.

```sql
SELECT region, country, SUM(total) AS total_money
FROM sales
GROUP BY region, country;
```

Now you get a row per `(region, country)` combination.

### Filter on groups with HAVING

`WHERE` filters rows **before** the grouping. `HAVING` filters **after**. So if you want only regions with more than 300 in sales:

```sql
SELECT region, SUM(total) AS total_money
FROM sales
GROUP BY region
HAVING SUM(total) > 300;
```

The east region passes, west doesn't. Use `HAVING` when the filter depends on the aggregate.

### Order to remember

Actually, the structure is always:

```
SELECT   ... columns and aggregates ...
FROM     ... table ...
WHERE    ... filter rows ...
GROUP BY ... what to group by ...
HAVING   ... filter groups ...
ORDER BY ... sort ...
```

If you mix the order up, the database complains.

### Why does it matter?

Because most reports are "X per Y": revenue per region, signups per day, orders per customer. `GROUP BY` plus an aggregate is the answer to almost every one of these.

One small tip: every column you put in `SELECT` should either be in `GROUP BY` or wrapped in an aggregate. If you mix the two without doing this, some databases complain and others silently pick a wrong value. Either way, easy to get wrong.
