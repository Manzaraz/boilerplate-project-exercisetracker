const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Exercise = new Schema(
  {
    description: String,
    duration: Number,
    Date: { type: Date, default: Date.now() },
  },
  {
    _id: false,
  }
);

const User = new Schema({
  username: String,
  log: [Exercise],
});

module.exports = mongoose.model("User", User);
