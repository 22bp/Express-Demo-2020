const express = require("express");
const router = express.Router();

const {
  index,
  view,
  add,
  postAdd,
  edit,
  postEdit,
  deleteUser
} = require("../controllers/users");

const validations = require('../validations/users')

// Show all users
router.get("/", index);

// Show user
router.get("/:id/view", view);

// Add user
router.get("/add", add);

router.post("/add", validations.add, postAdd);

// Edit user
router.get("/:id/edit", edit);

router.post("/:id/edit", validations.edit, postEdit);

// Delete user
router.get("/:id/delete", deleteUser);

module.exports = router;
