import User from "@/db/models/User"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
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
    const user = await User.query(knexInstance).findOne({
      id
    })

    delete user.password

    return res.status(200).json({ user })
  }

  return res.status(405).json({ message: "Method Not Allowed" })
}

export default handler