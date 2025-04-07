import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import bcrypt from "bcrypt"
import cookie from "cookie"
import jwt from "jsonwebtoken"

const login = async ({ email, password, otp, res }) => {
  try {
    const user = await User.query(knexInstance).findOne({ email })
    const curentTime = new Date()

    if (!user || !user.isVerified || !user.verificationToken || user.verificationToken !== otp || user.otpCreation.getTime() + 600000 < curentTime.getTime()) {
      return res.status(400).json({ message: "Invalid Credentials, if you don't have an account, please create one. If you have, please verify your account or reset your password" })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid Credentials, if you don't have an account, please create one. If you have, please verify your account or reset your password" })
    }

    await User.query(knexInstance).patchAndFetchById(user.id, { otpCreation: null, verificationToken: "" })

    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      path: "/",
    }))

    return res.status(200).json({ message: "User logged in" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export default login