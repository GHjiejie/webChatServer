const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const friendRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  requestedAt: { type: Date, default: Date.now },
});

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default: "http://localhost:3000/uploads/default.png",
    },
    status: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "offline",
    },
    phone: { type: String, default: "18196576670" },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [friendRequestSchema],
    sentFriendRequests: [friendRequestSchema],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
