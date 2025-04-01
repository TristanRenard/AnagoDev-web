import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import accountDeletion from "@/utils/user/accountDeletion"

const accountDeletionController = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { email, phone } = req.body

  if (email) {
    const user = await User.query(knexInstance).findOne({ email })

    if (!user) {
      return res.status(200).json({
        message:
          "Cannot find user with this email. If you are sure, please contact support.",
      })
    }
  }

  return res.status(200).json(await accountDeletion(email, phone))
}

export default accountDeletionController
