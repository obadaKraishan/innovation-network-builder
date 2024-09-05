const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define a schema for nested comments (interest group discussions)
const interestGroupDiscussionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "interestGroupDiscussion",
    default: null,
  }, // Added for replies
  createdAt: { type: Date, default: Date.now },
});

// Define a schema for invitations
const invitationSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "InterestGroup", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Define the InterestGroup schema to include the discussion schema and invitations schema
const interestGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  objectives: { type: String },
  hobbies: [{ type: String }],
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
  invitations: [invitationSchema], // Reference the invitation schema here
  interestGroupDiscussions: [interestGroupDiscussionSchema], // Add the discussions array
});

// Define model
module.exports = mongoose.model("InterestGroup", interestGroupSchema);