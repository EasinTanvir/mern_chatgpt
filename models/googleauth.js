const mongoose = require("mongoose");

const auth = new mongoose.Schema({
  email: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("gauth", auth);
