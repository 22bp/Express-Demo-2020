const User = require("../models/User");
const Book = require("../models/Book");
const Transaction = require("../models/Transaction");

module.exports.create = async (req, res, next) => {
  var users = await User.find({ isAdmin: false });
  var books = await Book.find();

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

module.exports.edit = async (req, res, next) => {
  var transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.render("404", { resource: "Transaction" });
  }

  var errors = [];
  var users = await User.find({ isAdmin: false });
  var books = await Book.find();

  if (!req.body.user) {
    errors.push("Please select user");
  }

  if (!req.body.books) {
    errors.push("Please select books");
  }

  if (errors.length) {
    return res.render("transactions/edit-transaction", {
      users,
      books,
      errors,
      values: req.body,
      transaction
    });
  }

  req.transaction = transaction;
  next();
};
