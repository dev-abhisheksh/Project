import { User } from "../models/user.model.js"


const fetchAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") return res.status(401).json({ message: "Only admins" })

        const users = await User.find()
            .select("-refreshTokens -password")
            .sort({ createdAt: -1 })

        let pro = users.filter(p => p.isPro)

        return res.status(200).json({
            message: "Fetched all users",
            count: users.length,
            proUsers: pro.length,
            users
        })
    } catch (error) {
        console.error("Failed to fetch users", error)
        return res.status(500).json({ message: "Failed to fetch users" })
    }
}

export {
    fetchAllUsers
}