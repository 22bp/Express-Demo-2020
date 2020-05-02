const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    unique: true
  }
});

module.exports = mongoose.model("Shop", shopSchema);
