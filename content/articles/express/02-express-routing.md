# Express Routing

Once you have an Express app running, the next thing you do is set up routes. A route is just a rule that says "when someone visits this URL, do this".

### What is a Route?

Basically, imagine a hotel reception desk. Different guests ask for different things. One wants the menu, another wants to check in, another wants their bill. Each request goes to a different clerk. Routes are those clerks.

### Basic routes

```js
const express = require("express");
const app = express();

app.get("/menu", (req, res) => {
  res.send("Today: pizza, pasta, salad");
});

app.get("/checkin", (req, res) => {
  res.send("Welcome! Your room key is ready.");
});

app.listen(3000);
```

Visiting `/menu` shows the menu. Visiting `/checkin` shows the welcome message. Each URL maps to its own little function.

### Route parameters

What if the URL has a variable part, like a user's name? Use a colon.

```js
app.get("/hello/:name", (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});
```

Now `/hello/alice` returns *Hello, alice!*. `/hello/bob` returns *Hello, bob!*. The `:name` part becomes available as `req.params.name`.

### Different HTTP methods

Actually, routes work with more than just `GET`. There is also `POST` (for creating things), `PUT` (for updating), `DELETE`, and so on.

```js
app.post("/users",   (req, res) => { /* create a user */ });
app.put("/users/:id",(req, res) => { /* update a user */ });
app.delete("/users/:id", (req, res) => { /* delete a user */ });
```

### Why does it matter?

Because every backend you build is basically a collection of routes. Once you understand `app.METHOD(path, handler)`, you can model almost any API in your head.

One small tip: keep route handlers short. If a handler grows past 10-15 lines, move the logic out into its own function. Easier to test, easier to read.
