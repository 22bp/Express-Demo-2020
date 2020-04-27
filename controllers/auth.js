const db = require("../db");
const shortid = require("shortid");
const bcrypt = require("bcrypt");

// Login
module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.postLogin = (req, res) => {
  res.cookie("userId", req.user.id, { signed: true });
  res.redirect("/transactions");
};

// Register
module.exports.register = (req, res) => {
  res.render("auth/register");
};

module.exports.postRegister = (req, res) => {
  var newUser = req.body;
  newUser.id = shortid.generate();
  newUser.isAdmin = false;
  newUser.avatarUrl = "/uploads/avatars/f648dfdd0b3a85231de874e91f694070";

  var hash = bcrypt.hashSync(newUser.password, 10);
  newUser.password = hash;

  var user = db
    .get("users")
    .push(newUser)
    .write();

  res.cookie("userId", newUser.id, { signed: true });
  res.redirect("/transactions");
};
