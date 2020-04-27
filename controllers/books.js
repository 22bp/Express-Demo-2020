const shortid = require("shortid");
const cloudinary = require("cloudinary").v2;

const db = require("../db");
const calPagination = require("../utils/pagination");

var books = db.get("books").value();

// Show all books
module.exports.index = (req, res) => {
  var filtered = [...books];

  if (req.query.q) {
    filtered = books.filter(
      book => book.title.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  // Pagination
  var result = calPagination(req.query.page, filtered);

  res.render("books", {
    books: result.filtered,
    pagination: result.pagination
  });
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
  if (res.locals.user.isAdmin) {
    var newBook = req.body;
    newBook.id = shortid.generate();

    if (req.file && req.file.path) {
      cloudinary.uploader.upload(
        req.file.path,
        { public_id: "BookManagement/Books/" + req.file.filename },
        function(error, result) {
          newBook.coverUrl = result.url;
          db.get("books")
            .push(newBook)
            .write();
          res.redirect("/books");
        }
      );
    } else {
      newBook.coverUrl = "/uploads/books/371f645d721a5be1f722fa80f22b5fc8";
      db.get("books")
        .push(newBook)
        .write();
      res.redirect("/books");
    }
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
  if (res.locals.user.isAdmin) {
    if (req.file && req.file.path) {
      cloudinary.uploader.upload(
        req.file.path,
        { public_id: "BookManagement/Books/" + req.file.filename },
        function(error, result) {
          req.body.coverUrl = result.url;
          db.get("books")
            .find({ id: req.book.id })
            .assign(req.body)
            .write();
          res.redirect("/books/" + req.book.id + "/view");
        }
      );
    } else {
      db.get("books")
        .find({ id: req.book.id })
        .assign(req.body)
        .write();
      res.redirect("/books/" + req.book.id + "/view");
    }
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
