import { Solution } from "../models/solution.model.js";
import { Vote } from "../models/vote.model.js";
import { client } from "../utils/redisClient.js";


const toggleLike = async (req, res) => {
    try {
        const { solutionId } = req.params;
        const userId = req.user._id;

        const solution = await Solution.findById(solutionId);
        if (!solution)
            return res.status(404).json({ message: "Solution not found" });

        const existingVote = await Vote.findOne({ userId, solutionId });

        let currentUserVote = null;

        if (!existingVote) {
            await Vote.create({ userId, solutionId, type: "up" });
            solution.votes.upvotes += 1;
            currentUserVote = "up";
        } else {
            solution.votes.upvotes -= 1;
            await existingVote.deleteOne();
            currentUserVote = null;
        }

        await solution.save();

        // 👇 Bust the cache so next fetch reflects updated vote
        const cacheKey = `solutions:problemId:${solution.problemId}:userId:${userId}`;
        await client.del(cacheKey);

        return res.status(200).json({
            likesCount: solution.votes.upvotes,
            currentUserVote,
        });

    } catch (error) {
        console.error("Vote toggle failed", error);
        return res.status(500).json({ message: "Operation failed" });
    }
};


export {
    toggleLike
}