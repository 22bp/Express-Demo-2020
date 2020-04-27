const express = require("express");
const router = express.Router();

const { add, index, deleteBook, decrease, increase, number, transaction } = require("../controllers/cart");

// Add to cart
router.get("/add/:bookId", add);

// Cart index
router.get("/", index);

// Delete book
router.get("/delete/:bookId", deleteBook);

// Change number
router.get("/decrease/:bookId", decrease);
router.get("/increase/:bookId", increase);
router.get("/number/:bookId", number);

// Make transaction
router.get("/transaction", transaction);

module.exports = router;
