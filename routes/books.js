const express = require("express");
const router = express.Router();

const {
  index,
  view,
  add,
  postAdd,
  edit,
  postEdit,
  deleteBook
} = require("../controllers/books");

const validations = require("../validations/books");

// Show all books
router.get("/", index);

// Show single book
router.get("/:id/view", view);

// Add book
router.get("/add", add);

router.post("/add", validations.add, postAdd);

// Edit book
router.get("/:id/edit", edit);

router.post("/:id/edit", validations.edit, postEdit);

// Delete book
router.get("/:id/delete", deleteBook);

module.exports = router;
