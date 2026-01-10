import { moderateText } from "../utils/moderateText.js";


export const aiModeration = async (req, res, next) => {
    console.log("AI MODERATION MIDDLEWARE HIT");

    // 1️⃣ FIRST extract answer
    const { answer } = req.body;

    // 2️⃣ Guard: nothing to moderate
    if (!answer || typeof answer !== "string") {
        return next();
    }

    // 3️⃣ Regex pre-filter
    const bannedWords = /(asshole|bitch|fuck|shit|gay|curse)/i;
    if (bannedWords.test(answer)) {
        return res.status(400).json({
            message: "Solution contains inappropriate language"
        });
    }

    // 4️⃣ Admin bypass
    if (req.user?.role === "admin") {
        return next();
    }

    // 5️⃣ AI moderation (slow, fail-open)
    try {
        const decision = await moderateText(answer);
        if (decision === "BLOCK") {
            return res.status(400).json({
                message: "Solution contains inappropriate or abusive content"
            });
        }
        next();
    } catch {
        next(); // fail-open
    }
};

