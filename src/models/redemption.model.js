import mongoose from "mongoose"

const redemptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    points: {
        type: Number,
        enum: [500, 1000],
        required: true
    },

    rewardType: {
        type: String,
        enum: ["gift_card"],
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true })


export const Redemption = mongoose.model("Redemption", redemptionSchema)