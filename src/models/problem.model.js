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
        required: true,
        index: true
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
        required: true,
        index: true
    },

    expertOnly: {
        type: Boolean,
        default: false,
        immutable: true
    },

    bannerImage: {
        type: String,
        default: null
    },


    status: {
        type: String,
        enum: ["open", "solved", "closed"],
        default: "open",
        index: true
    },

    views: {
        type: Number,
        default: 0
    },

    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true })


export const Problem = mongoose.model("Problem", problemSchema)