const db = require("../db");

module.exports.add = (req, res, next) => {
  var errors = [];
  
  if (req.body.email === "") {
    errors.push("Email is required");
  } else {
    var user = db.get("users").find({ email: req.body.email }).value();
    if (user) {
      errors.push("Email already used")
    }
  }
  
  if (req.body.password === "") {
    errors.push("Password is required");
  } else if (req.body.password.length < 6) {
    errors.push("Password must equal or more 6 chars")
  }

  if (req.body.name === "") {
    errors.push("Name is required");
  } else if (req.body.name.length > 30) {
    errors.push("Name is not over 30 chars");
  }

  if (req.body.phone === "") {
    errors.push("Phone is required");
  }

  if (errors.length) {
    return res.render("users/add-user", { errors, values: req.body });
  }

  next();
};

module.exports.edit = (req, res, next) => {
  var user = db
    .get("users")
    .find({ id: req.params.id })
    .value();
  if (user) {
    var errors = [];

    if (req.body.name === "") {
      errors.push("Name is required");
    }

    if (req.body.name.length > 30) {
      errors.push("Name is not over 30 chars");
    }

    if (req.body.phone === "") {
      errors.push("Phone is required");
    }

    if (errors.length) {
      return res.render("users/edit-user", { errors, values: req.body, user });
    }

    res.user = user;
    next();
  } else {
    res.render("404", { resource: "User" });
  }
};
