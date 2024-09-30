import User from "@/db/models/User"
import knexInstance from "@/lib/db"

const verifyUser = async (user) => {
  await User.query(knexInstance).patchAndFetchById(user.id, { isVerified: true, verificationToken: "" })
}

export default verifyUser