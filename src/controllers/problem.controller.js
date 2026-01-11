import { Notification } from "../models/notification.model.js";
import { Problem } from "../models/problem.model.js ";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const createProblem = async (req, res) => {
    try {
        let { title, description, category, tags, expertOnly } = req.body;
        if (!title || !description || !category) {
            return res.status(400).json({ message: "Title , description and category are required" })
        }

        title = title.trim()
        description = description.trim()
        category = category.trim().toLowerCase()

        if (tags && !Array.isArray(tags)) {
            return res.status(400).json({ message: "Tags must be an array" })
        }

        const normalizedTags = tags ? tags.map(tag => tag.trim().toLowerCase()) : [];

        const problem = await Problem.create({
            title,
            description,
            category,
            tags: normalizedTags,
            expertOnly: expertOnly === true,
            createdBy: req.user._id
        })

        if (normalizedTags.length > 0) {
            try {
                console.log("Normalized tags:", normalizedTags);

                const experts = await User.find({
                    role: "expert",
                    expertTags: { $in: normalizedTags }
                }).select("_id expertTags");

                console.log("Matched experts:", experts);


                if (experts.length > 0) {
                    const notifications = experts.map(expert => ({
                        userId: expert._id,
                        problemId: problem._id,
                        message: "A new problem was posted related to ypur expertise"
                    }))

                    await Notification.insertMany(notifications)
                }
            } catch (error) {
                console.error("Failed to create notifications", error)
            }
        }
        console.log("DB NAME:", mongoose.connection.name);


        return res.status(201).json({
            message: "Problem created successfully",
            problem
        })
    } catch (error) {
        console.error("Failed to create problem", error)
        return res.status(500).json({ message: "Failed to create problem" })
    }
}

const getProblems = async (req, res) => {
    try {
        let { category, tags, expertOnly } = req.query;

        let page = Number(req.query.page) || 1
        let limit = Number(req.query.limit) || 10

        let skip = (page - 1) * limit

        const filter = {
            isDeleted: false
        }

        if (category) filter.category = category.toLowerCase()
        if (expertOnly !== undefined) filter.expertOnly = expertOnly === "true";
        if (tags) {
            const parsedTags = tags
                .split(",")
                .map(tag => tag.trim().toLowerCase())
                .filter(Boolean)
            if (parsedTags.length) {
                filter.tags = { $in: parsedTags }
            }
        }

        const problems = await Problem.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "fullName role")

        const total = await Problem.countDocuments(filter)

        return res.status(200).json({
            message: "Fetched problems successfully",
            page,
            limit,
            total,
            results: problems.length,
            problems
        })

    } catch (error) {
        console.error("Failed to fetch problems", error)
        return res.status(500).json({ message: "Failed to fetch problems" })
    }
}

export {
    createProblem,
    getProblems
}