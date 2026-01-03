import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema({
    answer: {
        type: String,
        required: true,
        trim: true
    },

    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true
    },

    answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    isAccepted: {
        type: Boolean,
        default: false
    },

    isEdited: {
        type: Boolean,
        default: false
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    votes: {
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 }
    }
}, { timestamps: true })

solutionSchema.index({ problemId: 1, answeredBy: 1 }, { unique: true })

export const Solution = mongoose.model("Solution", solutionSchema)  