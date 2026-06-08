# Express Request and Response Objects

Every Express route handler gets two important objects: `req` and `res`. They are the heart of how you read a request and send a reply. Let me walk through the useful bits.

### What are they?

Basically, imagine you got a letter. `req` is the letter you received. `res` is the letter you'll send back. You read information from `req` and write information to `res`.

```js
app.get("/", (req, res) => {
  // read from req, write to res
});
```

### Useful things on `req`

```js
req.method      // "GET", "POST", etc.
req.url         // "/users/42?show=details"
req.params      // route params, like { id: "42" }
req.query       // query string, like { show: "details" }
req.body        // JSON or form body (needs express.json())
req.headers     // all headers, lowercase keys
req.ip          // the client's IP address
```

So for a URL like `/users/42?show=details`:

```js
app.get("/users/:id", (req, res) => {
  console.log(req.params.id);    // "42"
  console.log(req.query.show);   // "details"
});
```

### Useful things on `res`

```js
res.send("text or HTML")        // simple reply
res.json({ ok: true })          // send JSON (sets the right content-type)
res.status(404).send("missing") // set HTTP status + body
res.redirect("/login")          // 302 redirect
res.set("X-Custom", "value")    // set a header
res.cookie("token", "abc123")   // set a cookie
```

You can chain most of these:

```js
res.status(201).json({ id: 7, name: "Alice" });
```

### One thing to remember

Actually, this catches everyone out once. You can only send a response **once**. Calling `res.send()` or `res.json()` twice gives you the dreaded *"Cannot set headers after they are sent"* error. Make sure your handler ends in exactly one response.

### Why does it matter?

Because every interaction with your backend is "read `req`, decide what to do, write `res`". Once these are second nature, the rest of Express is just glue.

One small tip: use `res.json()` for APIs and `res.send()` for HTML or plain text. They look similar, but `res.json()` makes sure the content-type and serialization are correct for JSON responses.
