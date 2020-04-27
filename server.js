const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const booksRoute = require("./routes/books");
const usersRoute = require("./routes/users");
const transactionsRoute = require("./routes/transactions");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const cartRoute = require("./routes/cart");

const {
  requiredAuth,
  requiredAdmin,
  loggedIn,
  getUser
} = require("./middlewares/auth");

const { cartSession } = require("./middlewares/sessions");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser(process.env.SECRET_COOKIE));

app.set("view engine", "pug");
app.set("views", "./views");

// Routes
app.use(getUser);
app.use(cartSession);

app.get("/", (req, res) => res.redirect("/books"));

app.use("/auth", loggedIn, authRoute);
app.use("/books", booksRoute);
app.use("/cart", cartRoute);

app.use(requiredAuth);

app.use("/users", requiredAdmin, usersRoute);
app.use("/transactions", transactionsRoute);
app.use("/profile", profileRoute);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
