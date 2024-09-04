const mongoose = require("mongoose");

const interestGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  objectives: { type: String, optional: true },
  hobbies: [{ type: String, optional: true }],
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  invitations: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending",
      },
    },
  ],
});

module.exports = mongoose.model("InterestGroup", interestGroupSchema);
