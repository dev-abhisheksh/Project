import { Reputation } from "../models/reputation.model.js";

const reputationRanking = async (req, res) => {
  try {
    const { range = "all", page = 1 } = req.query;
    const limit = 10;
    const pageNumber = parseInt(page, 10);

    if (pageNumber > 1 && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can access more pages" });
    }

    const match = {};
    const now = new Date();

    if (range === "weekly") {
      match.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
    } else if (range === "monthly") {
      match.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
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
    ]);

    let lastPoints = null;
    let lastRank = 0;
    const offset = (pageNumber - 1) * limit;

    const leaderboard = rawLeaderboard.map((u, index) => {
      if (u.totalPoints !== lastPoints) {
        lastRank = offset + index + 1;
        lastPoints = u.totalPoints;
      }

      return {
        rank: lastRank,
        userId: u.userId,
        fullName: u.fullName,
        totalPoints: u.totalPoints
      };
    });

    return res.json({
      page: pageNumber,
      range,
      leaderboard
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

export { reputationRanking };
