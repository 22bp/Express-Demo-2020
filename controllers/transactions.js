const shortid = require("shortid");
const db = require("../db");

var users = db.get("users").value();
var books = db.get("books").value();
var transactions = db.get("transactions").value();

// Show all transactions
module.exports.index = (req, res) => {
  var filtered = [...transactions];

  if (req.query.q) {
    filtered = transactions.filter(
      transaction =>
        transaction.id.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  res.render("transactions", { transactions: filtered });
};

// Show transaction
module.exports.view = (req, res) => {
  var transaction = db
    .get("transactions")
    .find({ id: req.params.id })
    .value();

  if (transaction) {
    var user = db
      .get("users")
      .find({ id: transaction.user })
      .value();
    var books = [];
    transaction.books.forEach(bookId => {
      var book = db
        .get("books")
        .find({ id: bookId })
        .value();
      books.push(book);
    });
    res.render("transactions/view-transaction", { transaction, user, books });
  } else {
    res.render("404", { resource: "Transaction" });
  }
};

// Create transaction
module.exports.create = (req, res) => {
  res.render("transactions/create-transaction", { users, books });
};

module.exports.postCreate = (req, res) => {
  if (req.body) {
    if (typeof req.body.books === "string") {
      req.body.books = [req.body.books];
    }
    var newTransaction = req.body;
    newTransaction.id = shortid.generate();
    newTransaction.isComplete = false;

    db.get("transactions")
      .push(newTransaction)
      .write();
    res.redirect("/transactions");
  }
};

// Edit transaction
module.exports.edit = (req, res) => {
  var transaction = db
    .get("transactions")
    .find({ id: req.params.id })
    .value();
  if (transaction) {
    res.render("transactions/edit-transaction", { transaction, users, books });
  } else {
    res.render("404", { resource: "Transaction" });
  }
};

module.exports.postEdit = (req, res) => {
  if (req.body) {
    if (typeof req.body.books === "string") {
      req.body.books = [req.body.books];
    }
    db.get("transactions")
      .find({ id: res.transaction.id })
      .assign(req.body)
      .write();
    res.redirect("/transactions/" + res.transaction.id + "/view");
  }
};

// Delete transaction
module.exports.deleteTran = (req, res) => {
  var transaction = db
    .get("transactions")
    .find({ id: req.params.id })
    .value();
  if (transaction) {
    db.get("transactions")
      .remove({ id: transaction.id })
      .write();
    res.redirect("/transactions");
  } else {
    res.render("404", { resource: "Transaction" });
  }
};

// Complete transaction
module.exports.complete = (req, res) => {
  var transaction = db
    .get("transactions")
    .find({ id: req.params.id })
    .value();
  if (transaction) {
    db.get("transactions")
      .find({ id: transaction.id })
      .assign({ isComplete: !transaction.isComplete })
      .write();
    res.redirect("/transactions");
  } else {
    res.render("404", { resource: "Transaction" });
  }
};
