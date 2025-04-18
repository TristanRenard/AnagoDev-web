import Address from "@/db/models/Address"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
  const { method } = req

  if (method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { "x-user-data": userData } = req.headers
  const user = JSON.parse(userData)
  const userAddress = await Address.query(knexInstance)
    .where("userId", user.id)

  return res.status(200).json({ message: "Success", address: userAddress })
}

export default handler
