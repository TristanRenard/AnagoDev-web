import login from "@/utils/user/login"
import cookie from "cookie"

const loginController = async (req, res) => {
  if (req.method === "DELETE") {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: false,
        expires: new Date(0),
        sameSite: "strict",
        path: "/",
        domain: process.env.DOMAIN,
      }),
    )

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    })
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { email, password, otp } = req.body

  if (!email || !password || !otp) {
    // eslint-disable-next-line no-nested-ternary
    return res.status(400).json({
      message: "Missing required fields",
      missing: !email ? "email" : !password ? "password" : "otp",
    })
  }

  return await login({ email, password, otp, res })
}

export default loginController
