import { Problem } from "../models/problem.model.js ";


const createProblem = async (req, res) => {
    try {
        let { title, description, category, tags, expertOnly } = req.body;
        if (!title || !description || !category) {
            return res.status(400).json({ message: "Title , documents and category are required" })
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

        return res.status(201).json({
            message: "Problem created successfully",
            problem
        })
    } catch (error) {
        console.error("Failed to create problem", error)
        return res.status(500).json({ message: "Failed to create problem" })
    }
}


export {
    createProblem
}