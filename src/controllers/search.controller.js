import { Problem } from "../models/problem.model.js";
import { User } from "../models/user.model.js";

export const search = async (req, res) => {
    let { type, query } = req.body;
    if (!type || !query) return res.status(400).json({ message: "both fields are required" })

    if (typeof type !== "string") type = String(type)
    if (typeof query !== "string") query = String(query)

    type = type.toLowerCase();
    query = query.toLowerCase();

    try {
        let results;
        switch (type) {
            case "problem":
                results = await Problem.find({ title: { $regex: query, $options: "i" } })
                    .select("title createdBy coverImage")
                    .limit(10)
                break;

            case "user":
                results = await User.find({
                    $or: [
                        { fullName: { $regex: query, $options: "i" } },
                        { email: query.toLowerCase() }
                    ]
                }).select("fullName coverImage")
                    .limit(10)
                break;
            default:
                return res.status(400).json({ message: "Invalid search type" })
        }

        return res.json({ results })

    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
}