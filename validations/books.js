const Book = require('../models/Book');

module.exports.add = (req, res, next) => {
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

  next();
};

module.exports.edit = async (req, res, next) => {
  var book = await Book.findById(req.params.id);

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
    
    req.book = book;
    next();
  } else {
    res.render("404", { resource: "Book" });
  }
};
