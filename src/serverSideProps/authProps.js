import User from "@/db/models/User"
import knexInstance from "@/lib/db"

const authProps = async (context) => {
  const userData = await context.req.headers["x-user-data"]

  if (!userData) {
    return {
      user: null,
    }
  }

  const user = await User.query(knexInstance).findOne({
    id: userData,
  })

  delete user.password
  delete user.phone
  delete user.email

  if (!user) {
    return {
      user: null,
    }
  }

  return {
    user: await JSON.parse(JSON.stringify(user)),
  }
}

export default authProps
