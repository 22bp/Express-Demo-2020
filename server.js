const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const booksRoute = require("./routes/books");
const usersRoute = require("./routes/users");
const transactionsRoute = require("./routes/transactions");
const authRoute = require("./routes/auth");

const { requiredAuth, requiredAdmin, loggedIn } = require("./middlewares/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser(process.env.SECRET_COOKIE));

app.set("view engine", "pug");
app.set("views", "./views");

// Index
app.get("/", (req, res) => {
  res.redirect("/books");
});

app.use("/auth", loggedIn, authRoute);

app.use(requiredAuth);

app.use("/books", booksRoute);
app.use("/users", requiredAdmin, usersRoute);
app.use("/transactions", transactionsRoute);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
