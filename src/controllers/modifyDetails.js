import Address from "@/db/models/Address"
import User from "@/db/models/User"
import knexInstance from "@/lib/db"

const modiFyDetailsController = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { "x-user-data": userData } = req.headers
  const { field, editedValue } = req.body
  const user = JSON.parse(userData)

  if (field in user) {
    await User.query(knexInstance)
      .update({ [field]: editedValue, email: user.email })
      .where({ id: user.id })
  } else {
    const address = await Address.query(knexInstance)
      .update({ [field]: editedValue, userId: user.id })
      .where({ userId: user.id })

    if (!address) {
      await Address.query(knexInstance).insert({
        userId: user.id,
        [field]: editedValue,
      })
    }
  }

  return res.status(200).json({ message: "User details updated successfully" })
}

export default modiFyDetailsController
