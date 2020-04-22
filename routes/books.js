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

// Show all books
router.get("/", index);

// Show single book
router.get("/:id/view", view);

// Add book
router.get("/add", add);

router.post("/add", postAdd);

// Edit book
router.get("/:id/edit", edit);

router.post("/:id/edit", postEdit);

// Delete book
router.get("/:id/delete", deleteBook);

module.exports = router;
