import { Reputation } from "../models/reputation.model.js";
import { User } from "../models/user.model.js";

const POINTS_MAP = {
    commented: 1,
    solution_accepted: 5,
    reported: -1
}

export const addReputationEvent = async ({ userId, solutionId, type }) => {
    const points = POINTS_MAP[type];
    if (!points) return;

    if (type === "reported") {
        const exists = await Reputation.findOne({ userId, solutionId, type })
        if (exists) return;
    }

    await Reputation.create({ userId, solutionId, type, points });
    await User.findByIdAndUpdate(userId, { $inc: { reputation: points } })
}