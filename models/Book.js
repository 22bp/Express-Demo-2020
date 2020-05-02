const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String,
    default: "/uploads/books/371f645d721a5be1f722fa80f22b5fc8"
  },
  shop: {
    type: mongoose.Types.ObjectId,
    ref: "Shop"
  }
});

module.exports = mongoose.model("Book", bookSchema);
