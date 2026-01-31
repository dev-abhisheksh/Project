import { Problem } from "../models/problem.model.js";
import { Solution } from "../models/solution.model.js";
import mongoose from "mongoose";

export const getUserDashboardStats = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        // 1. Total problems posted
        const totalProblems = await Problem.countDocuments({
            createdBy: userId,
            isDeleted: false
        });

        // 2. Total solutions received on user's problems
        const totalSolutionsReceived = await Solution.countDocuments({
            problemId: {
                $in: await Problem.find({ createdBy: userId }).distinct("_id")
            }
        });

        // 3. Problem status breakdown (solved vs unsolved)
        const problemStatus = await Problem.aggregate([
            { $match: { createdBy: userId, isDeleted: false } },
            {
                $group: {
                    _id: "$status", // open / solved / closed
                    count: { $sum: 1 }
                }
            }
        ]);

        // 4. Latest 3 problems
        const latestProblems = await Problem.find({ createdBy: userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .select("title status createdAt");

        // 5. Latest 3 solutions provided by user
        const latestSolutions = await Solution.find({ answeredBy: userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .select("problemId createdAt");

        res.status(200).json({
            totalProblems,
            totalSolutionsReceived,
            problemStatus,
            latestProblems,
            latestSolutions
        });
    } catch (error) {
        res.status(500).json({ message: "Dashboard fetch failed" });
    }
};
