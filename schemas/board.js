const mongoose = require("mongoose");

const { Schema } = mongoose;
const boardSchema = new Schema({
  postId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  showing: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("board", boardSchema);