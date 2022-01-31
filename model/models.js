const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
// Schemas
const ExcerciseSchema = new Schema({
  username: { type: String, required: true },
  date: Date,
  description: String,
  duration: Number,
});

const UserSchema = new Schema({
  username: { type: String, required: true },
});

const LogSchema = new Schema({
  username: String,
  count: Number,
  log: Array,
});

// Models
const UserInfo = mongoose.model("userInfo", UserSchema);
const ExerciseInfo = mongoose.model("excerciseInfo", ExcerciseSchema);
const LogInfo = mongoose.model("logInfo", LogSchema);

module.exports = { UserInfo, ExerciseInfo, LogInfo };
