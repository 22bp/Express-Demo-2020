module.exports.avatar = (req, res, next) => {
  var errors = [];

  if (!req.file) {
    errors.push("Avatar is required");
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports.password = (req, res, next) => {
  var errors = [];

  if (!req.body.password) {
    errors.push("Password is required");
  } else if (req.body.password.length < 6) {
    errors.push("Password must equal or more 6 chars");
  }
  
  if (!req.body.password2) {
    errors.push("Password Confirm is required");
  } else if (req.body.password !== req.body.password2) {
    errors.push("Password Confirm incorrect")
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  next();
};
