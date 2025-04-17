import User from "@/db/models/User"
import knexInstance from "@/lib/db"

// eslint-disable-next-line complexity, consistent-return
const handler = async (req, res) => {
  const { "x-user-data": userData } = req.headers
  const user = (userData && JSON.parse(userData)) || {}
  const isAdmin = user?.role === "admin"

  if (req.method === "GET") {
    if (isAdmin) {
      const users = await User.query(knexInstance)
        .select("*")
        .orderBy("created_at", "desc")
      //.withGraphFetched("[category, prices]")

      return res.status(200).json(users)
    }

    return res.status(401).json({ message: "Unauthorized" })
  }

  if (req.method === "PATCH") {
    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { id, role } = req.body

    if (!id || !["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid request data" })
    }

    try {
      const updatedUser = await User.query(knexInstance)
        .patchAndFetchById(id, { role })

      return res.status(200).json(updatedUser)
    } catch (error) {
      console.error("Error updating user role:", error)

      return res.status(500).json({ message: "Failed to update user role" })
    }
  }

  // Définir les méthodes autorisées
  res.setHeader("Allow", ["POST", "GET", "DELETE", "PATCH"])

  // Si la méthode n'est pas prise en charge
  if (!["POST", "GET", "DELETE", "PATCH"].includes(req.method)) {
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler
