// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var todos = ["Đi chợ", "Nấu cơm", "Rửa chén", "Học code tại CodersX"];

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.send("I love CodersX");
});

app.get("/todos", (req, res) => {
  var filtered = [...todos];

  if (req.query.q) {
    var q = req.query.q;

    filtered = todos.filter(
      todo => todo.toLowerCase().indexOf(q.toLowerCase()) !== -1
    );
  }

  res.render("todos", { todos: filtered });
});

app.post("/todos/create", (req, res) => {
  todos.push(req.body.todo);
  res.redirect("/todos");
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
