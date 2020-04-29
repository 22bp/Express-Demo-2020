const cloudinary = require("cloudinary").v2;

const Book = require("../models/Book");
const calPagination = require("../utils/pagination");

// Show all books
module.exports.index = async (req, res) => {
  var books = await Book.find();
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
module.exports.view = async (req, res) => {
  var book = await Book.findById(req.params.id);

  if (!book) {
    return res.render("404", { resource: "Book" });
  }

  res.render("books/view-book", { book });
};

// Add book
module.exports.add = (req, res) => {
  res.render("books/add-book");
};

module.exports.postAdd = async (req, res) => {
  var newBook = req.body;

  if (req.file && req.file.path) {
    var result = await cloudinary.uploader.upload(req.file.path, {
      public_id: "BookManagement/Books/" + req.file.filename
    });

    newBook.coverUrl = result.url;
  }

  await Book.create(newBook);
  res.redirect("/books");
};

// Edit book
module.exports.edit = async (req, res) => {
  var book = await Book.findById(req.params.id);

  if (!book) {
    return res.render("404", { resource: "Book" });
  }

  res.render("books/edit-book", { book });
};

module.exports.postEdit = async (req, res) => {
  var book = await Book.findById(req.params.id);

  if (req.file && req.file.path) {
    var result = await cloudinary.uploader.upload(req.file.path, {
      public_id: "BookManagement/Books/" + req.file.filename
    });

    book.coverUrl = result.url;
  }

  for (let x in req.body) {
    book[x] = req.body[x];
  }

  await book.save();

  res.redirect("/books/" + req.book.id + "/view");
};

// Delete book
module.exports.deleteBook = async (req, res) => {
  var book = await Book.findById(req.params.id);

  if (!book) {
    return res.render("404", { resource: "Book" });
  }

  await book.remove();

  res.redirect("/books");
};
