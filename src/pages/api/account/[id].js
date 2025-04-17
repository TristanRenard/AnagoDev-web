import User from "@/db/models/User"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
  const { method, query } = req
  const { id } = query

  if (method !== "GET") {
    return res.status(200).json({ message: "Method not allowed" })
  }

  const user = await User.query(knexInstance).findOne({ id })

  return res.status(200).json({ user })
}

export default handler
