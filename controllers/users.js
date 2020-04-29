const bcrypt = require("bcrypt");
const calPagination = require("../utils/pagination");
const User = require("../models/User");

// Show all users
module.exports.index = async (req, res) => {
  var users = await User.find({ isAdmin: false });
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
module.exports.view = async (req, res) => {
  var user = await User.findById(req.params.id);

  if (!user) {
    return res.render("404", { resource: "User" });
  }

  res.render("users/view-user", { user });
};

// Add user
module.exports.add = (req, res) => {
  res.render("users/add-user");
};

module.exports.postAdd = async (req, res) => {
  var newUser = req.body;

  newUser.password = await bcrypt.hash(newUser.password, 10);

  await User.create(newUser);

  res.redirect("/users");
};

// Edit user
module.exports.edit = async (req, res) => {
  var user = await User.findById(req.params.id);

  if (!user) {
    return res.render("404", { resource: "User" });
  }

  res.render("users/edit-user", { user });
};

module.exports.postEdit = async (req, res) => {
  var user = await User.findById(req.params.id);

  for (let x in req.body) {
    if (x === "password") {
      user.password = await bcrypt.hash(req.body.password, 10);
    } else {
      user[x] = req.body[x];
    }
  }

  await user.save();

  res.redirect("/users/" + req.user.id + "/view");
};

// Delete user
module.exports.deleteUser = async (req, res) => {
  var user = await User.findById(req.params.id);

  if (!user) {
    return res.render("404", { resource: "User" });
  }

  await user.remove();
  res.redirect("/users");
};
