import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import mailFormater from "@/utils/mail/mailFormater"
import { accountVerificationMailTemplate } from "@/utils/mail/mailTemplates"
import sendEmail from "@/utils/mail/sendMail"
import sendOTP from "@/utils/user/sendOTP"

const sendOTPController = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { email, phone } = req.body

  if (!email && !phone) {
    return res
      .status(400)
      .json({ message: "Missing required fields", missing: "email" })
  }

  if (email) {
    const user = await User.query(knexInstance).findOne({ email })

    if (!user) {
      return res.status(200).json({
        message:
          "If User exists, OTP has been sent to the phone number else check your mail or create an account",
      })
    }

    if (!user.isVerified && user.verificationToken) {
      const template = accountVerificationMailTemplate
      const params = [
        {
          name: "name",
          value: `${user.firstName} ${user.lastName}`,
        },
        {
          name: "verificationLink",
          // eslint-disable-next-line no-underscore-dangle
          value: `${process.env.HOST_NAME || process.env.__NEXT_PRIVATE_ORIGIN}/user/verify/${user.verificationToken}`,
        },
      ]
      const body = mailFormater(template, params)

      sendEmail(email, "Account Verification", body)

      return res.status(200).json({
        message:
          "If User exists, OTP has been sent to the phone number else check your mail or create an account",
      })
    }
  }

  return res.status(200).json(await sendOTP(email, phone))
}

export default sendOTPController
