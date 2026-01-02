import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true
    },

    tags: [
        {
            type: String,
            required: true
        }
    ],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    expertOnly: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: ["open", "solved", "closed"],
        default: "open"
    },

    views: {
        type: Number,
        default: 0
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


export const Problem = mongoose.model("Problem", problemSchema)