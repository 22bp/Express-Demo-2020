module.exports.update = (req, res, next) => {
  var errors = [];

  if (req.body.name === "") {
    errors.push("Name is required");
  }

  if (req.body.phone === "") {
    errors.push("Phone is required");
  }

  if (errors.length) {
    return res.render("profile/update", { errors, values: req.body });
  }

  next();
};

module.exports.avatar = (req, res, next) => {
  var errors = [];

  if (req.file === undefined) {
    errors.push("Avatar is required");
  }

  if (errors.length) {
    return res.render("profile/avatar", { errors, avatarUrl: req.user.avatarUrl });
  }

  next();
};

module.exports.password = (req, res, next) => {
  var errors = [];

  if (req.body.password === "") {
    errors.push("Password is required");
  } else if (req.body.password.length < 6) {
    errors.push("Password must equal or more 6 chars");
  }
  
  if (req.body.password2 === "") {
    errors.push("Password Confirm is required");
  } else if (req.body.password !== req.body.password2) {
    errors.push("Password Confirm incorrect")
  }

  if (errors.length) {
    return res.render("profile/password", { errors });
  }

  next();
};
