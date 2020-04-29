const calPagination = require("../utils/pagination");
const Book = require("../models/Book");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Show all transactions
module.exports.index = async (req, res) => {
  var transactions;

  if (req.user.isAdmin) {
    transactions = await Transaction.find();
  } else {
    transactions = await Transaction.find({ user: req.user.id });
  }

  var filtered = [...transactions];

  // Search
  if (req.query.q) {
    filtered = transactions.filter(
      transaction =>
        transaction.id.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  // Pagination
  var result = calPagination(req.query.page, filtered);

  res.render("transactions", {
    transactions: result.filtered,
    pagination: result.pagination
  });
};

// Show transaction
module.exports.view = async (req, res) => {
  var transaction = await Transaction.findById(req.params.id).populate("books user");

  if (!transaction) {
    return res.render("404", { resource: "Transaction" });
  }

  res.render("transactions/view-transaction", { transaction });
};

// Create transaction
module.exports.create = async (req, res) => {
  var books = await Book.find();
  var users = await User.find({ isAdmin: false });

  res.render("transactions/create-transaction", { users, books });
};

module.exports.postCreate = async (req, res) => {
  if (typeof req.body.books === "string") {
    req.body.books = [req.body.books];
  }
  var newTransaction = req.body;

  await Transaction.create(newTransaction);

  res.redirect("/transactions");
};

// Edit transaction
module.exports.edit = async (req, res) => {
  var transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return res.render("404", { resource: "Transaction" });
  }

  var books = await Book.find();
  var users = await User.find({ isAdmin: false });

  res.render("transactions/edit-transaction", { transaction, users, books });
};

module.exports.postEdit = async (req, res) => {
  var transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.render("404", { resource: "Transaction" });
  }

  if (typeof req.body.books === "string") {
    transaction.books = [req.body.books];
  } else {
    transaction.books = req.body.books;
  }

  transaction.user = req.body.user;

  await transaction.save();

  res.redirect("/transactions/" + req.transaction.id + "/view");
};

// Delete transaction
module.exports.deleteTran = async (req, res) => {
  var transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.render("404", { resource: "Transaction" });
  }

  await transaction.remove();

  res.redirect("/transactions");
};

// Complete transaction
module.exports.complete = async (req, res) => {
  var transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.render("404", { resource: "Transaction" });
  }

  transaction.isComplete = !transaction.isComplete;

  await transaction.save();

  res.redirect("/transactions");
};
