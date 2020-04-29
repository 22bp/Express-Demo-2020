const CartSession = require("../models/CartSession");

module.exports.cartSession = async (req, res, next) => {
  var cartSession;
  // If not Cart Session
  if (!req.signedCookies.cartSession) {
    cartSession = await CartSession.create({ cart: [] });

    if (res.locals.userMain) {
      cartSession.user = res.locals.userMain.id;
    }

    await cartSession.save();

    res.cookie("cartSession", cartSession.id, { signed: true });
  } else {
    cartSession = await CartSession.findById(req.signedCookies.cartSession);
  }

  // Count cart
  var count = 0;
  if (cartSession.cart) {
    for (let item of cartSession.cart) {
      count += item.quantity;
    }
  }

  res.locals.countCart = count;
  next();
};
