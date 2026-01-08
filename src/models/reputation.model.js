import mongoose from "mongoose";

const reputationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  solutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Solution",
    required: true,
    index: true
  },

  type: {
    type: String,
    enum: ["solution_accepted", "commented", "reported"],
    required: true,
    index: true
  },

  points: {
    type: Number,
    required: true
  }
}, { timestamps: true });

reputationSchema.index(
  { userId: 1, solutionId: 1, type: 1 },
  { unique: true, partialFilterExpression: { type: "reported" } }
);

export const Reputation = mongoose.model("Reputation", reputationSchema);
