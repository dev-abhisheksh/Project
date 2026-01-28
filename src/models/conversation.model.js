import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true
    },

    solutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    expertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    },

    closedAt: {
        type: Date
    }
}, { timestamps: true })

conversationSchema.index({ problemId: 1, solutionId: 1 }, { unique: true })

export const Conversation = mongoose.model("Conversation", conversationSchema)