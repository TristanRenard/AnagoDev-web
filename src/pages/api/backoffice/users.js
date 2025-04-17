import User from "@/db/models/User"
import knexInstance from "@/lib/db"

// eslint-disable-next-line complexity, consistent-return
const handler = async (req, res) => {
  const { "x-user-data": userData } = req.headers
  const user = (userData && JSON.parse(userData)) || {}
  const isAdmin = user?.isAdmin || false

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

  // Définir les méthodes autorisées
  res.setHeader("Allow", ["POST", "GET", "DELETE", "PATCH"])

  // Si la méthode n'est pas prise en charge
  if (!["POST", "GET", "DELETE", "PATCH"].includes(req.method)) {
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler
