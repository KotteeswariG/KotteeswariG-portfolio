# What is Express.js?

If you have ever wanted to build a website's backend with JavaScript, you have probably heard of Express. It is one of those tools that almost every Node.js project uses. Let me explain what it is and why it became so popular.

### What is Express?

Basically, imagine you want to run a small office where people send letters and you reply to each one. Express is the office. It listens for incoming letters (requests), figures out which clerk should answer (a route), and sends back a reply.

In tech words, Express is a small framework that sits on top of Node.js and makes it easy to handle HTTP requests.

### A tiny example

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

That's it. A full working web server in 7 lines. Open `http://localhost:3000` in a browser and you'll see *Hello, world!*.

### What is happening here?

* `express()` creates the app (the office).
* `app.get("/", ...)` says "when someone visits the home page, run this function".
* `req` is the incoming letter. `res` is your reply.
* `app.listen(3000)` opens the door on port 3000.

### Why does it matter?

Because Express makes the most common backend tasks (routing, sending JSON, accepting forms) feel natural. Without it, you'd have to write a lot of low-level HTTP code yourself.

One small tip: when you install Express, you use `npm install express`. After that, just `require` it and start small. You can build a real API in less than 50 lines.
