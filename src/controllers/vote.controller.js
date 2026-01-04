import { Solution } from "../models/solution.model.js";
import { Vote } from "../models/vote.model.js";


const toggleLike = async (req, res) => {
    try {
        const { solutionId } = req.params;
        if (!solutionId)
            return res.status(400).json({ message: "Solution ID is required" });

        const existingLike = await Vote.findOne({
            userId: req.user._id,
            solutionId
        });

        if (!existingLike) {
            await Vote.create({ userId: req.user._id, solutionId, type: "up" });
            await Solution.findByIdAndUpdate(solutionId, {
                $inc: { "votes.upvotes": 1 }
            });
            return res.status(200).json({ message: "Liked" });
        }

        await existingLike.deleteOne();
        await Solution.findByIdAndUpdate(solutionId, {
            $inc: { "votes.upvotes": -1 }
        });
        return res.status(200).json({ message: "Like removed" });

    } catch (error) {
        console.error("Like toggle failed", error);
        return res.status(500).json({ message: "Operation failed" });
    }
};


export {
    toggleLike
}