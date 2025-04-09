/* eslint-disable no-nested-ternary */
import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import register from "@/utils/user/register"

const registerController = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    consentMail,
    consentConditions,
  } = req.body

  if (!firstName || !lastName || !email || !password || !phone) {
    // eslint-disable-next-line no-nested-ternary
    return res.status(400).json({
      message: "Missing required fields",
      missing: !firstName
        ? "firstName"
        : !lastName
          ? "lastName"
          : !email
            ? "email"
            : !password
              ? "password"
              : "phone",
    })
  }

  const user = await User.query(knexInstance).findOne({ email })

  if (user) {
    return res.status(400).json({ message: "User already exists" })
  }

  return await register(req, res, {
    email,
    firstName,
    lastName,
    phone,
    password,
    consentMail,
    consentConditions,
  })
}

export default registerController
