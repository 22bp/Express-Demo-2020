const db = require("../db");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

// Index
module.exports.index = (req, res) => {
  res.render("profile", { user: res.user });
};

// Update profile
module.exports.update = (req, res) => {
  res.render("profile/update", { user: res.user });
};

module.exports.postUpdate = (req, res) => {
  db.get("users")
    .find({ id: res.user.id })
    .assign(req.body)
    .write();
  res.redirect("/profile");
};

// Update avatar
module.exports.avatar = (req, res) => {
  res.render("profile/avatar", { avatarUrl: res.user.avatarUrl });
};

module.exports.postAvatar = (req, res) => {
  cloudinary.uploader.upload(
    req.file.path,
    { public_id: "BookManagement/Avatars/" + req.file.filename },
    function(error, result) {
      db.get("users")
        .find({ id: res.user.id })
        .assign({ avatarUrl: result.url })
        .write();
      res.redirect("/profile");
    }
  );
};

// Change password
module.exports.password = (req, res) => {
  res.render("profile/password");
};

module.exports.postPassword = (req, res) => {
  var newPassword = bcrypt.hashSync(req.body.password, 10);
  db.get("users")
    .find({ id: res.user.id })
    .assign({ password: newPassword })
    .write();

  res.render("profile", { user: res.user, alert: "Password Change" });
};
