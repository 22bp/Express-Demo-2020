const db = require("../db");

var users = db.get("users").value();
var books = db.get("books").value();

module.exports.create = (req, res, next) => {
  var errors = [];

  if (!req.body.user) {
    errors.push("Please select user");
  }

  if (!req.body.books) {
    errors.push("Please select books");
  }

  if (errors.length) {
    return res.render("transactions/create-transaction", {
      users,
      books,
      errors,
      values: req.body
    });
  }

  next();
};

module.exports.edit = (req, res, next) => {
  var transaction = db
    .get("transactions")
    .find({ id: req.params.id })
    .value();
  if (transaction) {
    var errors = [];

    if (!req.body.user) {
      errors.push("Please select user");
    }

    if (!req.body.books) {
      errors.push("Please select books");
    }

    if (errors.length) {
      return res.render("transactions/create-transaction", {
        users,
        books,
        errors,
        values: req.body,
        transaction
      });
    }

    res.transaction = transaction;
    next();
  } else {
    res.render("404", { resource: "Transaction" });
  }
};
