import login from "@/utils/user/login"

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { email, password, otp } = req.body

  if (!email || !password || !otp) {
    // eslint-disable-next-line no-nested-ternary
    return res.status(400).json({ message: "Missing required fields", missing: !email ? "email" : !password ? "password" : "otp" })
  }

  return await login({ email, password, otp, res })
}

export default handler