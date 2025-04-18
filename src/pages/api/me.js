import Address from "@/db/models/Address"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
  const { "x-user-data": userData } = req.headers

  if (!userData) {
    return res.status(401).json({ message: "Unauthorized. You must log in." })
  }

  const user = JSON.parse(userData)
  const userAddress = await Address.query(knexInstance)
    .select("*")
    .where({ userId: user.id })

  return res.status(200).json({ user, userAddress })
}

export default handler