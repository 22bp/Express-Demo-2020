// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);
const shortid = require("shortid");

// Set some defaults (required if your JSON file is empty)
db.defaults({ todos: [] }).write();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var todos = db.get("todos").value();

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.send("I love CodersX");
});

app.get("/todos", (req, res) => {
  var filtered = [...todos];

  if (req.query.q) {
    var q = req.query.q;

    filtered = todos.filter(
      todo => todo.text.toLowerCase().indexOf(q.toLowerCase()) !== -1
    );
  }

  res.render("todos", { todos: filtered });
});

app.post("/todos/create", (req, res) => {
  db.get("todos")
    .push({ id: shortid.generate(), text: req.body.text })
    .write();
  res.redirect("/todos");
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
