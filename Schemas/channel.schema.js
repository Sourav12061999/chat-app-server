const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "messages" }],
});

const channels = mongoose.model("channels", userSchema);

module.exports = channels;
