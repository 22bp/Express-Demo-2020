const cloudinary = require("cloudinary");

const Shop = require("../models/Shop");
const User = require("../models/User");
const Book = require("../models/Book");
const calPagination = require("../utils/pagination");

// Show books in shop
module.exports.books = async (req, res) => {
  var shop = await Shop.findById(req.params.id);
  if (!shop) {
    return res.render("404", { resource: "Shop" });
  }

  var books = await Book.find({ shop: req.params.id });
  var filtered = [...books];

  if (req.query.q) {
    filtered = books.filter(
      book => book.title.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  // Pagination
  var result = calPagination(req.query.page, filtered);

  res.render("shops/view-shop", {
    shop,
    books: result.filtered,
    pagination: result.pagination
  });
};

// Create shop
module.exports.createShop = async (req, res) => {
  var shop = await Shop.findOne({ user: req.user.id });

  if (shop) {
    return res.render("error", {
      error: "You had the shop. Every user own only one shop."
    });
  }

  res.render("shops/create-shop");
};

module.exports.postCreateShop = async (req, res) => {
  var shop = await Shop.create({
    user: res.locals.userMain.id,
    name: req.body.name.toLowerCase().replace(/\s+/g, " ")
  });

  res.cookie("shopId", shop.id, { signed: true });

  res.redirect("/shops/" + shop.id + "/books");
};

// // Admin
// Show all shops
module.exports.index = async (req, res) => {
  var shops = await Shop.find();
  var filtered = [...shops];

  if (req.query.q) {
    filtered = shops.filter(
      shop => shop.name.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  // Pagination
  var result = calPagination(req.query.page, filtered);

  res.render("shops", {
    shops: result.filtered,
    pagination: result.pagination
  });
};

// Add shop
module.exports.add = async (req, res) => {
  var users = await User.find({ isAdmin: false });
  res.render("shops/add-shop", { users });
};

module.exports.postAdd = async (req, res) => {
  await Shop.create({
    name: req.body.name.toLowerCase().replace(/\s+/g, " "),
    user: req.body.user
  });
  res.redirect("/shops");
};

// Edit shop
module.exports.edit = async (req, res) => {
  var shop = await Shop.findById(req.params.id);
  var users = await User.find({ isAdmin: false });

  if (!shop) {
    return res.render("404", { resource: "Shop" });
  }

  res.render("shops/edit-shop", { shop, users });
};

module.exports.postEdit = async (req, res) => {
  var shop = await Shop.findById(req.params.id);

  for (let x in req.body) {
    if (x === "name") {
      shop[x] = req.body[x].toLowerCase().replace(/\s+/g, " ");
    } else {
      shop[x] = req.body[x];
    }
  }

  await shop.save();

  res.redirect("/shops/" + req.shop.id + "/books");
};

// Delete shop
module.exports.deleteShop = async (req, res) => {
  var shop = await Shop.findById(req.params.id);

  if (!shop) {
    return res.render("404", { resource: "Shop" });
  }

  await shop.remove();

  res.redirect("/shops");
};

// // Shop owner
// Add book
module.exports.addBook = (req, res) => {
  res.render("books/add-book");
};

module.exports.postAddBook = async (req, res) => {
  var newBook = req.body;

  if (req.file && req.file.path) {
    var result = await cloudinary.uploader.upload(req.file.path, {
      public_id: "BookManagement/Books/" + req.file.filename
    });

    newBook.coverUrl = result.url;
  }

  newBook.shop = res.locals.shopMain.id;

  await Book.create(newBook);
  res.redirect("/shops/" + res.locals.shopMain.id + "/books");
};

// Edit book
module.exports.editBook = async (req, res) => {
  var book = await Book.findById(req.params.id);

  if (!book) {
    return res.render("404", { resource: "Book" });
  }

  if (
    !book.shop ||
    (book.shop && book.shop.toString() !== res.locals.shopMain.id)
  ) {
    return res.render("error", { error: "You don't own this book." });
  }

  res.render("books/edit-book", { book });
};

module.exports.postEditBook = async (req, res) => {
  var book = req.book;

  if (
    !book.shop ||
    (book.shop && book.shop.toString() !== res.locals.shopMain.id)
  ) {
    return res.render("error", { error: "You don't own this book." });
  }

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

  if (
    !book.shop ||
    (book.shop && book.shop.toString() !== res.locals.shopMain.id)
  ) {
    return res.render("error", { error: "You don't own this book." });
  }

  await book.remove();

  res.redirect("/shops/" + res.locals.shopMain.id + "/books");
};
