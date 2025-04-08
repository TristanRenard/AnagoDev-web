import User from "@/db/models/User"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
  try {
    const { method } = req
    const bearer = req.headers.authorization

    if (!bearer) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = bearer.split(" ")

    if (!token[1] || token[1] !== process.env.API_KEY) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (method === "GET") {
      const { id } = req.query

      try {
        const user = await User.query(knexInstance).findOne({
          id
        })

        if (!user) {
          return res.status(404).json({ message: "User not found" })
        }

        delete user.password

        return res.status(200).json({ user })
      } catch (dbError) {
        return res.status(500).json({ message: "Database error", error: dbError })
      }
    }

    return res.status(405).json({ message: "Method Not Allowed" })
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error })
  }
}

export default handler