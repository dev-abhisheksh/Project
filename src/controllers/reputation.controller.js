import { Reputation } from "../models/reputation.model.js";


const reputationRanking = async (req, res) => {
    const { range = "all", page = 1 } = req.query;
    const limit = 10;

    if (page > 1 && req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can access more pages" })
    }

    const match = {};
    const now = new Date();

    console.log(req.user.role)

    if (range === "weekly") {
        match.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
    } else {
        match.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) }
    }

    const leaderboard = await Reputation.aggregate([
        { $match: match },
        {
            $group: {
                _id: "$userId",
                totalPoints: { $sum: "$points" }
            }
        },

        { $sort: { totalPoints: -1 } },

        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },

        { $unwind: "$user" },

        {
            $project: {
                userId: "$_id",
                totalPoints: 1,
                fullName: "$user.fullName"
            }
        },

        { $skip: (page - 1) * limit },
        { $limit: limit }
    ])

    res.json({ page, leaderboard })
}

export {
    reputationRanking
}