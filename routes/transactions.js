const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const db = require("../db");

var users = db.get("users").value();
var books = db.get("books").value();
var transactions = db.get("transactions").value();

// Show all transactions
router.get("/", (req, res) => {
  var filtered = [...transactions];

  if (req.query.q) {
    filtered = transactions.filter(
      transaction =>
        transaction.id.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  res.render("transactions", { transactions: filtered });
});

// Show transaction
router.get("/:id/view", (req, res) => {
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
    res.send("Transaction not found");
  }
});

// Create transaction
router.get("/create", (req, res) => {
  res.render("transactions/create-transaction", { users, books });
});

router.post("/create", (req, res) => {
  if (req.body && req.body.user !== "" && req.body.books !== "") {
    if (typeof req.body.books === "string") {
      req.body.books = [req.body.books];
    }
    var newTransaction = req.body;
    newTransaction.id = shortid.generate();

    db.get("transactions")
      .push(newTransaction)
      .write();
    res.redirect("/transactions");
  }
});

// Edit transaction
router.get("/:id/edit", (req, res) => {
  var transaction = db
    .get("transactions")
    .find({ id: req.params.id })
    .value();
  if (transaction) {
    res.render("transactions/edit-transaction", { transaction, users, books });
  } else {
    res.send("Transaction not found");
  }
});

router.post("/:id/edit", (req, res) => {
  if (req.body && req.body.user !== "" && req.body.books !== "") {
    if (typeof req.body.books === "string") {
      req.body.books = [req.body.books];
    }
    db.get("transactions")
      .find({ id: req.params.id })
      .assign(req.body)
      .write();
    res.redirect("/transactions/" + req.params.id + "/view");
  }
});

// Delete transaction
router.get("/:id/delete", (req, res) => {
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
    res.send("Transaction not found");
  }
});

module.exports = router;