const User = require("../models/User");

module.exports.getUser = async (req, res, next) => {
  if (req.signedCookies.userId) {
    var userMain = await User.findById(req.signedCookies.userId);

    res.locals.userMain = userMain;
  }
  
  next();
};

module.exports.requiredAuth = async (req, res, next) => {
  if (!req.signedCookies.userId) {
    return res.redirect("/auth/login");
  }

  var user = await User.findById(req.signedCookies.userId);

  if (!user) {
    return res.redirect("/auth/login");
  }

  req.user = user;
  next();
};

module.exports.requiredAdmin = async (req, res, next) => {
  if (!req.signedCookies.userId) {
    return res.redirect("/auth/login");
  }

  if (!res.locals.userMain.isAdmin) {
    return res.redirect("/books");
  }

  next();
};

module.exports.loggedIn = async (req, res, next) => {
  if (req.signedCookies.userId) {
    var user = await User.findById(req.signedCookies.userId);

    if (!user) {
      return res.redirect("/auth/login");
    }

    next();
  }

  next();
};
