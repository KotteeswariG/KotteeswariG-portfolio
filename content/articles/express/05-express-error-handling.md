# Express Error Handling

Things go wrong. The database is down, a user sends bad input, your code throws. In Express there is a clean pattern for handling all of these in one place. Let me show you.

### The error middleware

Basically, imagine a complaints desk at the back of the office. If anything goes wrong in any other middleware or route, you send the customer there. In Express, that desk is an error middleware. You spot it by its four arguments instead of three:

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});
```

Notice the `err` parameter at the front. That fourth parameter is what tells Express "this is the error handler".

Put it **after** all your other `app.use(...)` and routes. Express only looks for it when something goes wrong.

### How does an error get there?

Two ways. First, throw inside a sync route:

```js
app.get("/boom", (req, res) => {
  throw new Error("Oops");
});
```

Second, call `next(err)` with an error object:

```js
app.get("/users/:id", (req, res, next) => {
  const user = findUser(req.params.id);
  if (!user) {
    return next(new Error("User not found"));
  }
  res.json(user);
});
```

Both send the request into your error middleware.

### Async routes need a tiny bit of care

Actually, this is where most beginners trip up. If your handler is `async`, you have to pass thrown errors to `next` yourself, or wrap the call in a try/catch:

```js
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.findUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});
```

Express 5 finally handles this on its own. But for Express 4 (still the common one), wrap async handlers in try/catch or use the small `express-async-errors` package.

### A friendlier message

You can shape the response any way you like. Hide internal errors from users, log details for yourself.

```js
app.use((err, req, res, next) => {
  console.error(err.stack);             // for you
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? "Internal Server Error" : err.message,
  });
});
```

### Why does it matter?

Because without a central error handler, every route has to do its own try/catch and 500-handling. With one, all errors flow to one place. Clean logs, consistent responses, one spot to add monitoring.

One small tip: when you create custom errors, attach a `.status` to them. Then in the handler, `err.status || 500` gives you a clean way to send the right HTTP code.
