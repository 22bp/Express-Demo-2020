const db = require("../db");
const shortid = require("shortid");

// Add to cart
module.exports.add = (req, res) => {
  const count = db
    .get("cartSessions")
    .find({ id: req.signedCookies.cartSession })
    .get("cart." + req.params.bookId, 0)
    .value();

  db.get("cartSessions")
    .find({ id: req.signedCookies.cartSession })
    .set("cart." + req.params.bookId, count + 1)
    .write();

  res.redirect("/books");
};

// Index
module.exports.index = (req, res) => {
  var cart = [];
  for (let bookId in res.locals.cartSession.cart) {
    var book = db
      .get("books")
      .find({ id: bookId })
      .value();
    book.quantity = res.locals.cartSession.cart[bookId];
    cart.push(book);
  }

  res.render("cart", { cart });
};

// Delete book
module.exports.deleteBook = (req, res) => {
  var cart = res.locals.cartSession.cart;
  delete cart[req.params.bookId];

  db.get("cartSessions")
    .find({ id: req.signedCookies.cartSession })
    .assign({ cart })
    .write();

  res.redirect("/cart");
};

// Decrease number
module.exports.decrease = (req, res) => {
  const count = db
    .get("cartSessions")
    .find({ id: req.signedCookies.cartSession })
    .get("cart." + req.params.bookId)
    .value();

  if (count <= 1) {
    var cart = res.locals.cartSession.cart;
    delete cart[req.params.bookId];

    db.get("cartSessions")
      .find({ id: req.signedCookies.cartSession })
      .assign({ cart })
      .write();
  } else {
    db.get("cartSessions")
      .find({ id: req.signedCookies.cartSession })
      .set("cart." + req.params.bookId, count - 1)
      .write();
  }

  res.redirect("/cart");
};

// Increase number
module.exports.increase = (req, res) => {
  const count = db
    .get("cartSessions")
    .find({ id: req.signedCookies.cartSession })
    .get("cart." + req.params.bookId)
    .value();

  db.get("cartSessions")
    .find({ id: req.signedCookies.cartSession })
    .set("cart." + req.params.bookId, count + 1)
    .write();

  res.redirect("/cart");
};

// Change number
module.exports.number = (req, res) => {
  const number = parseInt(req.query.number);

  if (number <= 0) {
    var cart = res.locals.cartSession.cart;
    delete cart[req.params.bookId];

    db.get("cartSessions")
      .find({ id: req.signedCookies.cartSession })
      .assign({ cart })
      .write();
  } else {
    db.get("cartSessions")
      .find({ id: req.signedCookies.cartSession })
      .set("cart." + req.params.bookId, number)
      .write();
  }

  res.redirect("/cart");
};

// Make transaction
module.exports.transaction = (req, res) => {
  if (res.locals.countCart) {
    if (!res.locals.user) {
      return res.redirect("/auth/login");
    }

    var cart = res.locals.cartSession.cart;

    // Create new transaction
    var books = [];
    for (let bookId in cart) {
      books.push(bookId);
    }

    var newTransaction = {
      id: shortid.generate(),
      isComplete: false,
      user: res.locals.user.id,
      books
    };

    db.get("transactions")
      .push(newTransaction)
      .write();

    // Delete books in cart
    db.get("cartSessions")
      .find({ id: req.signedCookies.cartSession })
      .assign({ cart: {} })
      .write();

    res.redirect("/transactions");
  }
};
