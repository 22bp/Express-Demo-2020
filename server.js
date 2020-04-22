const express = require("express");
const app = express();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);
const shortid = require("shortid");

// Set some defaults (required if your JSON file is empty)
db.defaults({ books: [] }).write();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", "./views");

var books = db.get("books").value();

// Index
app.get("/", (req, res) => {
  res.redirect("/books");
});

// Show all books
app.get("/books", (req, res) => {
  var filtered = [...books];

  if (req.query.q) {
    filtered = books.filter(
      book => book.title.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  res.render("books", { books: filtered });
});

// Show single book
app.get("/books/:id/view", (req, res) => {
  var book = db
    .get("books")
    .find({ id: req.params.id })
    .value();
  if (book) {
   res.render("view-book", { book }); 
  } else {
    res.send('Book not found')
  }
});

// Add book
app.get("/books/add", (req, res) => {
  res.render("add-book");
});

app.post("/books/add", (req, res) => {
  if (req.body && req.body.title !== '' && req.description !== '') {
    var newbook = req.body;
    newbook.id = shortid.generate();

    db.get("books")
      .push(newbook)
      .write();
    res.redirect("/books");
  }
});

// Edit book
app.get("/books/:id/edit", (req, res) => {
  var book = db.get('books').find({ id: req.params.id }).value();
  if (book) {
   res.render("edit-book", { book }); 
  } else {
    res.send('Book not found');
  }
});

app.post('/books/:id/edit', (req, res) => {
  db.get('books').find({ id: req.params.id }).assign(req.body).write();
  res.redirect('/books/'+ req.params.id + '/view');
})

// Delete book
app.get('/books/:id/delete', (req, res) => {
  var book = db.get('books').find({ id: req.params.id }).value();
  if (book) {
   db.get('books').remove({ id: book.id }).write();
    res.redirect('/books')
  } else {
    res.send('Book not found');
  }
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
