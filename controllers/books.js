const shortid = require("shortid");
const db = require("../db");

var books = db.get("books").value();

// Show all books
module.exports.index = (req, res) => {
  var filtered = [...books];

  if (req.query.q) {
    filtered = books.filter(
      book => book.title.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  res.render("books", { books: filtered });
};

// Show book
module.exports.view = (req, res) => {
  var book = db
    .get("books")
    .find({ id: req.params.id })
    .value();
  if (book) {
    res.render("books/view-book", { book });
  } else {
    res.render("404", { resource: "Book" });
  }
};

// Add book
module.exports.add = (req, res) => {
  res.render("books/add-book");
};

module.exports.postAdd = (req, res) => {
  var errors = [];

  if (req.body.title === "") {
    errors.push("Title is required");
  }

  if (req.body.description === "") {
    errors.push("Description is required");
  }

  if (errors.length) {
    return res.render("books/add-book", { errors, values: req.body });
  }

  if (req.body) {
    var newBook = req.body;
    newBook.id = shortid.generate();

    db.get("books")
      .push(newBook)
      .write();
    res.redirect("/books");
  }
};

// Edit book
module.exports.edit = (req, res) => {
  var book = db
    .get("books")
    .find({ id: req.params.id })
    .value();
  if (book) {
    res.render("books/edit-book", { book });
  } else {
    res.render("404", { resource: "Book" });
  }
};

module.exports.postEdit = (req, res) => {
  var book = db
    .get("books")
    .find({ id: req.params.id })
    .value();
  if (book) {
    var errors = [];

    if (req.body.title === "") {
      errors.push("Title is required");
    }

    if (req.body.description === "") {
      errors.push("Description is required");
    }

    if (errors.length) {
      return res.render("books/edit-book", { errors, values: req.body, book });
    }

    db.get("books")
      .find({ id: book.id })
      .assign(req.body)
      .write();
    res.redirect("/books/" + book.id + "/view");
  } else {
    res.render("404", { resource: "Book" });
  }
};

// Delete book
module.exports.deleteBook = (req, res) => {
  var book = db
    .get("books")
    .find({ id: req.params.id })
    .value();
  if (book) {
    db.get("books")
      .remove({ id: book.id })
      .write();
    res.redirect("/books");
  } else {
    res.render("404", { resource: "Book" });
  }
};
