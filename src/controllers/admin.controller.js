import { ExpertApplication } from "../models/expertApplication.model.js"
import { User } from "../models/user.model.js"

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

const approveExpertApplication = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only Admins are allowed" })
        }

        const { applicationId } = req.params;
        const application = await ExpertApplication.findById(applicationId);
        if (!application || application.status !== "pending") {
            return res.status(404).json({ message: "Application not found or already processed" })
        }

        await User.findByIdAndUpdate(
            application.userId,
            {
                $set: {
                    role: "expert",
                    isExpertVerified: true,
                    bio: application.bio,
                    experience: application.experience,
                    expertCategories: application.expertCategories,
                    portfolioLink: application.portfolioLink
                }
            }
        )

        application.status = "approved",
            application.reviewedBy = req.user._id,
            await application.save()

        return res.status(200).json({ message: "Expert application approved successfully" })

    } catch (error) {
        console.error("Failed to approve expert application", error)
        return res.status(500).json({ message: "Failed to approve expert application" })
    }
}

export {
    expertApplicationRequests,
    approveExpertApplication
}