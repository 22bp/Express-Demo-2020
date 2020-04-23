const db = require("../db");

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

module.exports.edit = (req, res, next) => {
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
    res.book = book;
    next();
  } else {
    res.render("404", { resource: "Book" });
  }
};
