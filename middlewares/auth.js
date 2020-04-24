const db = require("../db");

module.exports.requiredAuth = (req, res, next) => {
  if (req.signedCookies.userId) {
    var user = db
      .get("users")
      .find({ id: req.signedCookies.userId })
      .value();

    if (!user) {
      return res.redirect("/auth/login");
    }

    res.locals.user = user;
    res.user = user;
    next();
  } else {
    return res.redirect("/auth/login");
  }
};

module.exports.requiredAdmin = (req, res, next) => {
  if (!res.user.isAdmin) {
    return res.redirect("/transactions");
  }

  next();
};

module.exports.loggedIn = (req, res, next) => {
  if (!req.signedCookies.userId) {
    next();
  } else {
    var user = db
      .get("users")
      .find({ id: req.signedCookies.userId })
      .value();

    if (!user) {
      return res.redirect("/auth/login");
    }

    return res.redirect("/transactions");
  }
};
