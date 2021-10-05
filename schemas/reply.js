const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  postId: String,
  userId: String,
  nickname: String,
  comment: String,
  showing: Number,
});
ReplySchema.virtual("replyId").get(function () {
  return this._id.toHexString();
});
ReplySchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Reply", ReplySchema);