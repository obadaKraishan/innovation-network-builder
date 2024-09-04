const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define a schema for nested comments (interest group discussions)
const interestGroupDiscussionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'interestGroupDiscussion', default: null }, // Added for replies
  createdAt: { type: Date, default: Date.now },
});

// Update the InterestGroup schema to include the new discussion schema
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
  interestGroupDiscussions: [interestGroupDiscussionSchema], // Add the discussions array
});

module.exports = mongoose.model("InterestGroup", interestGroupSchema);
