const db = require("../db");
const shortid = require("shortid");

module.exports.cartSession = (req, res, next) => {
  if (!req.signedCookies.cartSession) {
    res.cookie("cartSession", shortid.generate(), { signed: true });

    var newCart = {};
    newCart.id = shortid.generate();

    if (res.locals.user) {
      newCart.user = res.locals.user.id;
    }

    db.get("cartSessions")
      .push(newCart)
      .write();
  }

  // Count cart
  console.log(req.signedCookies.cartSession);
  var cartSession = db
    .get("cartSessions")
    .find({ id: req.signedCookies.cartSession })
    .value();

  var cart = cartSession.cart || {};
  
  var count = 0;
  for (let bookId in cart) {
    count += cart[bookId];
  }
  
  res.locals.countCart = count;
  res.locals.cartSession = cartSession;

  next();
};
