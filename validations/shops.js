const User = require("../models/User");
const Shop = require("../models/Shop");
const Book = require("../models/Book");

// Admin
module.exports.add = async (req, res, next) => {
  var users = await User.find({ isAdmin: false });

  var errors = [];

  if (!req.body.user) {
    errors.push("Please select user");
  } else {
    var shopExist = await Shop.findOne({ user: req.body.user });

    if (shopExist) {
      errors.push("This user had the shop. Every user own only one shop.");
    }
  }

  if (!req.body.name) {
    errors.push("Name is required");
  } else {
    var shopExist = await Shop.findOne({
      name: req.body.name.toLowerCase().replace(/\s+/g, " ")
    });

    if (shopExist) {
      errors.push("This name already used");
    }
  }

  if (errors.length) {
    return res.render("shops/add-shop", {
      users,
      errors,
      values: req.body
    });
  }

  next();
};

module.exports.edit = async (req, res, next) => {
  var shop = await Shop.findById(req.params.id);

  if (!shop) {
    return res.render("404", { resource: "Shop" });
  }

  var errors = [];
  var users = await User.find({ isAdmin: false });

  if (!req.body.user) {
    errors.push("Please select user");
  } else {
    if (shop.user.toString() !== req.body.user) {
      var shopExist = await Shop.findOne({ user: req.body.user });

      if (shopExist) {
        errors.push("This user had shop. Every user own only one shop.");
      }
    }
  }

  if (!req.body.name) {
    errors.push("Name is required");
  } else {
    var shopExist = await Shop.findOne({
      name: req.body.name.toLowerCase().replace(/\s+/g, " ")
    });

    if (shopExist) {
      errors.push("This name already used");
    }
  }

  if (errors.length) {
    return res.render("shops/edit-shop", {
      users,
      errors,
      values: req.body,
      shop
    });
  }

  req.shop = shop;
  next();
};

// Shop owner
module.exports.addBook = (req, res, next) => {
  var errors = [];

  if (!req.body.title) {
    errors.push("Title is required");
  }

  if (!req.body.description) {
    errors.push("Description is required");
  }

  if (!req.file) {
    errors.push("Cover image is required");
  }

  if (errors.length) {
    return res.render("books/add-book", { errors, values: req.body });
  }

  next();
};

module.exports.editBook = async (req, res, next) => {
  var book = await Book.findById(req.params.id);

  if (book) {
    var errors = [];

    if (!req.body.title) {
      errors.push("Title is required");
    }

    if (!req.body.description) {
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

// Create shop
module.exports.createShop = async (req, res, next) => {
  var errors = [];

  if (!req.body.name) {
    errors.push("Name is required");
  } else {
    var shopExist = await Shop.findOne({
      name: req.body.name.toLowerCase().replace(/\s+/g, " ")
    });

    if (shopExist) {
      errors.push("This name already used");
    }
  }

  if (errors.length) {
    return res.render("shops/create-shop", {
      errors,
      values: req.body
    });
  }

  next();
};
