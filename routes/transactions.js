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

const validations = require("../validations/transactions");

const { requiredAdmin } = require('../middlewares/auth');

// Show all transactions
router.get("/", index);

// Show transaction
router.get("/:id/view", view);

router.use(requiredAdmin);

// Create transaction
router.get("/create", create);

router.post("/create", validations.create, postCreate);

// Edit transaction
router.get("/:id/edit", edit);

router.post("/:id/edit", validations.edit, postEdit);

// Delete transaction
router.get("/:id/delete", deleteTran);

// Complete transaction
router.get("/:id/complete", complete);

module.exports = router;
