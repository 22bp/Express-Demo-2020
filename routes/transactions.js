const express = require("express");
const router = express.Router();

const {
  index,
  view,
  create,
  postCreate,
  edit,
  postEdit,
  deleteTran,
  complete
} = require("../controllers/transactions");

// Show all transactions
router.get("/", index);

// Show transaction
router.get("/:id/view", view);

// Create transaction
router.get("/create", create);

router.post("/create", postCreate);

// Edit transaction
router.get("/:id/edit", edit);

router.post("/:id/edit", postEdit);

// Delete transaction
router.get("/:id/delete", deleteTran);

// Complete transaction
router.get("/:id/complete", complete);

module.exports = router;
