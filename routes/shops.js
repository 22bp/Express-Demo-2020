const express = require("express");
const router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "public/uploads/books/" });

const {
  index,
  books,
  addBook,
  postAddBook,
  editBook,
  postEditBook,
  deleteBook,
  add,
  postAdd,
  edit,
  postEdit,
  deleteShop,
  createShop,
  postCreateShop
} = require("../controllers/shops");

const validations = require("../validations/shops");

const {
  requiredAuth,
  requiredAdmin,
  requiredShopOwner
} = require("../middlewares/auth");

// Show single shop
router.get("/:id/books", books);

// Create shop
router.get("/create", requiredAuth, createShop);

router.post("/create", requiredAuth, validations.createShop, postCreateShop);

// // Require shop owner
// Add book
router.get("/books/add", requiredShopOwner, addBook);

router.post(
  "/books/add",
  requiredShopOwner,
  upload.single("cover"),
  validations.addBook,
  postAddBook
);

// Edit book
router.get("/books/:id/edit", requiredShopOwner, editBook);

router.post(
  "/books/:id/edit",
  requiredShopOwner,
  upload.single("cover"),
  validations.editBook,
  postEditBook
);

// Delete book
router.get("/books/:id/delete", requiredShopOwner, deleteBook);

// // Require admin
// Show all shops
router.get("/", requiredAdmin, index);

// Add shop
router.get("/add", requiredAdmin, add);

router.post("/add", requiredAdmin, validations.add, postAdd);

// Edit shop
router.get("/:id/edit", requiredAdmin, edit);

router.post("/:id/edit", requiredAdmin, validations.edit, postEdit);

// Delete shop
router.get("/:id/delete", requiredAdmin, deleteShop);

module.exports = router;
