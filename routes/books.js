const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const db = require('../db');

var books = db.get("books").value();

// Show all books
router.get("/", (req, res) => {
  var filtered = [...books];

  if (req.query.q) {
    filtered = books.filter(
      book => book.title.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  res.render("books", { books: filtered });
});

// Show single book
router.get("/:id/view", (req, res) => {
  var book = db
    .get("books")
    .find({ id: req.params.id })
    .value();
  if (book) {
   res.render("books/view-book", { book }); 
  } else {
    res.send('Book not found')
  }
});

// Add book
router.get("/add", (req, res) => {
  res.render("books/add-book");
});

router.post("/add", (req, res) => {
  if (req.body && req.body.title !== '' && req.body.description !== '') {
    var newBook = req.body;
    newBook.id = shortid.generate();

    db.get("books")
      .push(newBook)
      .write();
    res.redirect("/books");
  }
});

// Edit book
router.get("/:id/edit", (req, res) => {
  var book = db.get('books').find({ id: req.params.id }).value();
  if (book) {
   res.render("books/edit-book", { book }); 
  } else {
    res.send('Book not found');
  }
});

router.post('/:id/edit', (req, res) => {
  db.get('books').find({ id: req.params.id }).assign(req.body).write();
  res.redirect('/books/'+ req.params.id + '/view');
})

// Delete book
router.get('/:id/delete', (req, res) => {
  var book = db.get('books').find({ id: req.params.id }).value();
  if (book) {
   db.get('books').remove({ id: book.id }).write();
    res.redirect('/books')
  } else {
    res.send('Book not found');
  }
})

module.exports = router;