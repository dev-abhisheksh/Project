import { Reputation } from "../models/reputation.model.js";


const reputationRanking = async (req, res) => {
    const { range = "all", page = 1 } = req.query;
    const limit = 10;
    const pageNumber = req.query.page

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

    const rawLeaderboard = await Reputation.aggregate([
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

        { $skip: (pageNumber - 1) * limit },
        { $limit: limit }
    ])

    let lastPoints = null;
    let lastRank = 0;
    const offset = (pageNumber - 1) * limit;

    const leaderboard = rawLeaderboard.map((user, index) => {
        if (user.totalPoints !== lastPoints) {
            lastRank = offset + index + 1;
            lastPoints = user.totalPoints
        }

        return {
            rank: lastRank,
            userId: user.userId,
            fullName: user.fullName,
            totalPoints: user.totalPoints
        }

    })

    res.json({
        page: pageNumber,
        leaderboard
    })
}

export {
    reputationRanking
}