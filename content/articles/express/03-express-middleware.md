# Express Middleware

If you have used Express for more than a day, you have seen the word "middleware". It sounds scary, but the idea is simple. Let me show you.

### What is Middleware?

Basically, imagine a security checkpoint at an airport. Every passenger (request) walks through it. The guard can check their ID, stamp their passport, or send them back. Middleware is that guard.

In Express, a middleware is a function that runs between the request coming in and the response going out. It can do anything: log, check auth, parse data, add fields to `req`, or pass the request along.

### A simple example

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();   // pass it along
});
```

This logs every incoming request, then calls `next()` to let the request continue. Without `next()`, the request would just stop there.

### Built-in middlewares

Express ships with a couple you'll use all the time:

```js
app.use(express.json());            // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // parse form data
app.use(express.static("public"));  // serve files from a folder
```

`express.json()` lets you read `req.body` when someone POSTs JSON. Without it, `req.body` is empty. People hit this on day one.

### Order matters

Actually, middleware runs in the order you write `app.use(...)`. So write the request-parsing middleware first, then auth checks, then your routes. If you mix it up, your routes might run before the data is parsed.

### A custom auth example

```js
function requireApiKey(req, res, next) {
  if (req.headers["x-api-key"] !== "secret") {
    return res.status(401).send("Unauthorized");
  }
  next();
}

app.get("/private", requireApiKey, (req, res) => {
  res.send("Welcome to the private area!");
});
```

The route only runs if `requireApiKey` calls `next()`. Otherwise the request gets the 401 reply and stops there.

### Why does it matter?

Because middleware is how Express stays small and flexible. You compose a server by stacking middlewares: parser, logger, auth, route. Each one does one job.

One small tip: think of `req` as a notepad. Middlewares can add things to it (`req.user = ...`). Later middlewares and the route can read those notes. Very handy for auth.
