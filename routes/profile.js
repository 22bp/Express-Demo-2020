const express = require("express");
const router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "public/uploads/avatars/" });

const {
  index,
  update,
  postUpdate,
  avatar,
  postAvatar,
  password,
  postPassword
} = require("../controllers/profile");

const validations = require("../validations/profile");

// Show profile
router.get("/", index);

// Update profile
router.get("/update", update);

router.post("/update", validations.update, postUpdate);

// Update avatar
router.get("/avatar", avatar);

router.post("/avatar", upload.single("avatar"), validations.avatar, postAvatar);

// Change password
router.get("/password", password);

router.post("/password", validations.password, postPassword);

module.exports = router;
