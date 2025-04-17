import User from "@/db/models/User"
import knexInstance from "@/lib/db"

const handler = async (reg, res) => {
  if (reg.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { customerId } = reg.query
  await User.query(knexInstance).delete().where({ customerId })

  return res.status(200).json({ message: "User deleted successfully" })
}

export default handler