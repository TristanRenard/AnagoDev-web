import User from "@/db/models/User"
import knexInstance from "@/lib/db"


const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { verificationToken } = req.body

  if (!verificationToken) {
    return res.status(400).json({ message: "Missing required fields", missing: "verificationToken" })
  }

  try {
    const user = await User.query(knexInstance).findOne({ verificationToken })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    await User.query(knexInstance).patchAndFetchById(user.id, { isVerified: true, verificationToken: "" })

    return res.status(200).json({ message: "User verified" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export default handler