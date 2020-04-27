const db = require("../db");

module.exports.getUser = (req, res, next) => {
  if (req.signedCookies.userId) {
    var user = db
      .get("users")
      .find({ id: req.signedCookies.userId })
      .value();

    res.locals.user = user;

    next();
  } else {
    next();
  }
};

module.exports.requiredAuth = (req, res, next) => {
  if (req.signedCookies.userId) {
    var user = db
      .get("users")
      .find({ id: req.signedCookies.userId })
      .value();

    if (!user) {
      return res.redirect("/auth/login");
    }

    req.user = user;
    next();
  } else {
    return res.redirect("/auth/login");
  }
};

module.exports.requiredAdmin = (req, res, next) => {
  if (req.signedCookies.userId) {
    var user = db
      .get("users")
      .find({ id: req.signedCookies.userId })
      .value();

    if (!user) {
      return res.redirect("/auth/login");
    }

    if (!user.isAdmin) {
      return res.redirect("/transactions");
    }

    req.user = user;
    next();
  } else {
    return res.redirect("/books");
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
