import { moderateText } from "../utils/moderateText.js";


export const aiModeration = async (req, res, next) => {
    const { answer } = req.body;

    if (!answer || typeof answer !== "string") {
        return next();
    }

    const bannedWords = /(asshole|bitch|fuck|shit|gay|curse)/i;
    if (bannedWords.test(answer)) {
        return res.status(400).json({
            message: "Solution contains inappropriate language"
        });
    }

    if (req.user?.role === "admin") {
        return next();
    }

    try {
        const decision = await moderateText(answer);
        if (decision === "BLOCK") {
            return res.status(400).json({
                message: "Solution contains inappropriate or abusive content"
            });
        }
        next();
    } catch {
        next();
    }
};

