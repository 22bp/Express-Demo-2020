const User = require("../models/User");

module.exports.add = async (req, res, next) => {
  var errors = [];

  if (!req.body.email) {
    errors.push("Email is required");
  } else {
    var user = await User.findOne({ email: req.body.email });

    if (user) {
      errors.push("Email already used");
    }
  }

  if (!req.body.password) {
    errors.push("Password is required");
  } else if (req.body.password.length < 6) {
    errors.push("Password must equal or more 6 chars");
  }

  if (!req.body.name) {
    errors.push("Name is required");
  } else if (req.body.name.length > 30) {
    errors.push("Name is not over 30 chars");
  }

  if (!req.body.phone) {
    errors.push("Phone is required");
  }

  if (errors.length) {
    return res.render("users/add-user", { errors, values: req.body });
  }

  next();
};

module.exports.edit = async (req, res, next) => {
  var user = await User.findById(req.params.id);

  if (!user) {
    return res.render("404", { resource: "User" });
  }

  var errors = [];

  if (!req.body.name) {
    errors.push("Name is required");
  }

  if (req.body.name.length > 30) {
    errors.push("Name is not over 30 chars");
  }

  if (!req.body.phone) {
    errors.push("Phone is required");
  }

  if (errors.length) {
    return res.render("users/edit-user", { errors, values: req.body, user });
  }

  next();
};
