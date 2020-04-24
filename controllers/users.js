const shortid = require("shortid");
const db = require("../db");
const bcrypt = require("bcrypt");
const calPagination = require("../utils/pagination");

var users = db
  .get("users")
  .filter({ isAdmin: false })
  .value();

// Show all users
module.exports.index = (req, res) => {
  var filtered = [...users];

  if (req.query.q) {
    filtered = users.filter(
      user => user.name.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1
    );
  }

  // Pagination
  var result = calPagination(req.query.page, filtered);

  res.render("users", {
    users: result.filtered,
    pagination: result.pagination
  });
};

// Show user
module.exports.view = (req, res) => {
  var user = db
    .get("users")
    .find({ id: req.params.id })
    .value();
  if (user) {
    res.render("users/view-user", { user });
  } else {
    res.render("404", { resource: "User" });
  }
};

// Add user
module.exports.add = (req, res) => {
  res.render("users/add-user");
};

module.exports.postAdd = (req, res) => {
  var newUser = req.body;
  newUser.id = shortid.generate();
  newUser.isAdmin = false;

  var hash = bcrypt.hashSync(newUser.password, 10);
  newUser.password = hash;

  db.get("users")
    .push(newUser)
    .write();
  res.redirect("/users");
};

// Edit user
module.exports.edit = (req, res) => {
  var user = db
    .get("users")
    .find({ id: req.params.id })
    .value();
  if (user) {
    res.render("users/edit-user", { user });
  } else {
    res.render("404", { resource: "User" });
  }
};

module.exports.postEdit = (req, res) => {
  db.get("users")
    .find({ id: res.user.id })
    .assign(req.body)
    .write();
  res.redirect("/users/" + res.user.id + "/view");
};

// Delete user
module.exports.deleteUser = (req, res) => {
  var user = db
    .get("users")
    .find({ id: req.params.id })
    .value();
  if (user) {
    db.get("users")
      .remove({ id: user.id })
      .write();
    res.redirect("/users");
  } else {
    res.render("404", { resource: "User" });
  }
};
