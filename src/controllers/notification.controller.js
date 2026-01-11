import { Notification } from "../models/notification.model.js";
import mongoose from "mongoose";


const getNotifications = async (req, res) => {
    try {
        console.log("REQ.USER:", req.user);
        console.log("DB NAME:", mongoose.connection.name);

        // console.log(req.user.role)
        if (req.user.role !== "expert") {
            return res.status(403).json({ message: "Only Experts can view notifications" })
        }

        const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 })
        if (!notifications) return res.status(404).json({ message: "No notifications" })

        return res.status(200).json({
            message: "Fetched Notifications",
            count: notifications.length,
            notifications
        })
    } catch (error) {
        console.error("Failed to fetch notifications")
        return res.status(500).json({ message: "Failed to fetch notifications" })
    }
}

export {
    getNotifications
}