const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  message: String,
  author: String,
  time: String,
});

const messages = mongoose.model("messages", userSchema);

module.exports = messages;
