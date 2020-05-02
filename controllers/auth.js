const bcrypt = require("bcrypt");

const User = require("../models/User");
const Shop = require("../models/Shop");

// Login
module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.postLogin = async (req, res) => {
  res.cookie("userId", req.user.id, { signed: true });

  var shop = await Shop.findOne({ user: req.user.id });

  if (shop) {
    res.cookie("shopId", shop.id, { signed: true });
  } else {
    res.cookie("shopId", "");
  }

  res.redirect("/transactions");
};

// Register
module.exports.register = (req, res) => {
  res.render("auth/register");
};

module.exports.postRegister = async (req, res) => {
  var newUser = req.body;

  newUser.password = await bcrypt.hash(newUser.password, 10);

  var user = await User.create(newUser);

  res.cookie("userId", user.id, { signed: true });

  res.redirect("/transactions");
};
