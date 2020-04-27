const express = require("express");
const router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "public/uploads/books/" });

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

const { requiredAdmin } = require('../middlewares/auth');

// Show all books
router.get("/", index);

// Show single book
router.get("/:id/view", view);

router.post("/add", upload.single('cover'), validations.add, postAdd);

router.post("/:id/edit", upload.single('cover'), validations.edit, postEdit);

router.use(requiredAdmin);

// Add book
router.get("/add", add);

// Edit book
router.get("/:id/edit", edit);

// Delete book
router.get("/:id/delete", deleteBook);

module.exports = router;
