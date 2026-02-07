import { isUserBanned } from "../utils/isUserBanned.js";

export const checkBan = (req, res, next) => {

    if (isUserBanned(req.user)) {
        return res.status(403).json({
            message: "User banned temporary",
            bannedUntil: req.user.banExpiresAt
        });
    }
    next();
}
