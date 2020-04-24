const db = require("../db");
const bcrypt = require("bcrypt");

module.exports.login = (req, res, next) => {
  var errors = [];
  var user = null;

  if (req.body.email === "") {
    errors.push("Email is required");
  }

  if (req.body.password === "") {
    errors.push("Password is required");
  } else {
    user = db
      .get("users")
      .find({ email: req.body.email })
      .value();

    if (!user) {
      errors.push("User doesn't exist");
    } else {
      if (user.wrongLoginCount >= 3) {
        errors.push("Locked account for wrong login over 4 times.");
        return res.render("auth/login", { errors });
      }
      var result = bcrypt.compareSync(req.body.password, user.password);
      if (!result) {
        db.get("users")
          .find({ id: user.id })
          .assign({ wrongLoginCount: user.wrongLoginCount + 1 })
          .write();
        errors.push("Wrong password");
      }
    }
  }

  if (errors.length) {
    return res.render("auth/login", { errors, values: req.body });
  }

  db.get("users")
    .find({ id: user.id })
    .assign({ wrongLoginCount: 0 })
    .write();
  res.user = user;

  next();
};

module.exports.register = (req, res, next) => {
  var errors = [];

  if (req.body.email === "") {
    errors.push("Email is required");
  } else {
    var user = db
      .get("users")
      .find({ email: req.body.email })
      .value();
    if (user) {
      errors.push("Email already used");
    }
  }

  if (req.body.password === "") {
    errors.push("Password is required");
  } else if (req.body.password.length < 6) {
    errors.push("Password must equal or more 6 chars");
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
    return res.render("auth/register", { errors, values: req.body });
  }

  next();
};
