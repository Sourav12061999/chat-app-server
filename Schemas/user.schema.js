const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  profilePic: String,
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "channels" }],
});

const user = mongoose.model("users", userSchema);

module.exports = user;
