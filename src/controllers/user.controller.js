import { User } from "../models/user.model.js"

const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-refreshTokens -password")
      .sort({ createdAt: -1 })

    const proUsers = users.filter(u => u.isPro).length

    const usersGraph = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    return res.status(200).json({
      message: "Fetched all users",
      count: users.length,
      proUsers,
      users,
      usersGraph   // 👈 REQUIRED for graph
    })
  } catch (error) {
    console.error("Failed to fetch users", error)
    return res.status(500).json({ message: "Failed to fetch users" })
  }
}

export { fetchAllUsers }
