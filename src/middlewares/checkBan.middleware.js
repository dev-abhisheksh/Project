import { isUserBanned } from "../utils/isUserBanned.js";

export const checkBan = (req, res, next) => {
    console.log("checkBan running");
    console.log("User:", req.user);

    if (isUserBanned(req.user)) {
        console.log("User is banned");
        return res.status(403).json({
            message: "User banned temporary",
            bannedUntil: req.user.banExpiresAt
        });
    }

    console.log("User allowed");
    next();
}
