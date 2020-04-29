const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const User = require("../models/User");

// Index
module.exports.index = (req, res) => {
  res.render("profile", { user: req.user });
};

// Update profile
module.exports.update = (req, res) => {
  res.render("profile/update", { user: req.user });
};

module.exports.postUpdate = async (req, res) => {
  var user = await User.findById(req.user._id);

  for (let x in req.body) {
    user[x] = req.body[x];
  }

  await user.save();

  res.redirect("/profile");
};

// Update avatar
module.exports.avatar = (req, res) => {
  res.render("profile/avatar", { avatarUrl: req.user.avatarUrl });
};

module.exports.postAvatar = async (req, res) => {
  var user = await User.findById(req.user._id);

  var result = await cloudinary.uploader.upload(req.file.path, {
    public_id: "BookManagement/Avatars/" + req.file.filename
  });

  user.avatarUrl = result.url;

  await user.save();

  res.redirect("/profile");
};

// Change password
module.exports.password = (req, res) => {
  res.render("profile/password");
};

module.exports.postPassword = async (req, res) => {
  var user = await User.findById(req.user._id);

  user.password = await bcrypt.hash(req.body.password, 10);

  await user.save();

  res.render("profile", { user, alert: "Password Changed" });
};
