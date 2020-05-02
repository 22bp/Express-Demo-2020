const User = require("../models/User");
const Shop = require("../models/Shop");

module.exports.getUser = async (req, res, next) => {
  if (req.signedCookies.userId) {
    var userMain = await User.findById(req.signedCookies.userId);

    res.locals.userMain = userMain;

    if (req.signedCookies.shopId) {
      var shopMain = await Shop.findById(req.signedCookies.shopId);

      res.locals.shopMain = shopMain;
    }
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

module.exports.requiredShopOwner = async (req, res, next) => {
  if (!req.signedCookies.userId) {
    return res.redirect("/auth/login");
  }

  if (!res.locals.shopMain) {
    return res.render("error", {
      error:
        "You have not the shop. Please click button Create Your Shop to create one."
    });
  }

  if (res.locals.shopMain.user.toString() !== res.locals.userMain.id) {
    return res.render("error", {
      error: "Have errors. Please clear cookies and login again."
    });
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
