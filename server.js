const express = require("express");
const app = express();

const booksRoute = require("./routes/books");
const usersRoute = require("./routes/users");
const transactionsRoute = require('./routes/transactions')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set("view engine", "pug");
app.set("views", "./views");

// Index
app.get("/", (req, res) => {
  res.redirect("/books");
});

app.use("/books", booksRoute);
app.use("/users", usersRoute);
app.use("/transactions", transactionsRoute);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
