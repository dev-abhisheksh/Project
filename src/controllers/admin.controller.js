import { ExpertApplication } from "../models/expertApplication.model.js"

const expertApplicationRequests = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only Admins are allowed" })
        }

        const requests = await ExpertApplication.find({ status: "pending" })
            .populate("userId", "fullName role createdAt")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            message: "Fetched all pending Expert Applications requests",
            count: requests.length,
            requests
        })

    } catch (error) {
        console.error("Failed to fetch expert application requests", error)
        return res.status(500).json({ message: "Failed to fetch expert application requests" })
    }
}

export{
    expertApplicationRequests
}