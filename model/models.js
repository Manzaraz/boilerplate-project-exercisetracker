const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  userIId: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date,
});

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("User", UserSchema);
module.exports = mongoose.model("Exercise", ExerciseSchema);
