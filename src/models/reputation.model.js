import mongoose from "mongoose";

const reputationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    type: {
        type: String,
        enum: ["solution_accepted", "like", "abuse"],
        required: true
    },

    points: {
        type: Number,
        required: true
    },

    solutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution"
    }

}, { timestamps: true });

reputationSchema.index({ userId: 1, createdAt: -1 });

export const Reputation = mongoose.model("Reputation", reputationSchema);
