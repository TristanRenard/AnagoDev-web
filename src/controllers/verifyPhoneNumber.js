import PhoneVerification from "@/db/models/PhoneVerification"
import knexInstance from "@/lib/db"

const verifyPhoneNumberController = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed", success: false })
  }

  const { phone, otp } = req.body

  if (!phone || !otp) {
    return res.status(400).json({ message: "Missing required fields", missing: !phone ? "phone" : "otp", success: false })
  }

  const phoneVerification = await PhoneVerification.query(knexInstance).findOne({ phoneNumber: phone })

  if (!phoneVerification) {
    return res.status(400).json({ message: "Invalid Phone number", success: false })
  }

  if (phoneVerification.code !== otp) {
    return res.status(400).json({ message: "Invalid OTP", success: false })
  }

  // 15 minutes
  if (phoneVerification.createdAt + 900000 < Date.now()) {
    await PhoneVerification.query(knexInstance).delete().where({ phoneNumber: phone })

    return res.status(400).json({ message: "OTP expired", success: false })
  }

  return res.status(200).json({ message: "Phone number verified", success: true, })
}

export default verifyPhoneNumberController