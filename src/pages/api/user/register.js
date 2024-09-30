import PhoneVerification from "@/db/models/PhoneVerification"
import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import { stripe } from "@/lib/stripe"
import mailFormater from "@/utils/mail/mailFormater"
import { accountVerificationMailTemplate } from "@/utils/mail/mailTemplates"
import sendEmail from "@/utils/mail/sendMail"
import bcrypt from "bcrypt"
import crypto from "crypto"

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { firstName, lastName, email, phone, password, consentMail, consentPhone, otp } = req.body

  if (!firstName || !lastName || !email || !password || !phone) {
    // eslint-disable-next-line no-nested-ternary
    return res.status(400).json({ message: "Missing required fields", missing: !firstName ? "firstName" : !lastName ? "lastName" : !email ? "email" : !password ? "password" : "phone" })
  }

  const phoneVerification = await PhoneVerification.query(knexInstance).findOne({ phoneNumber: phone })

  if (!phoneVerification) {
    return res.status(400).json({ message: "Invalid Phone number" })
  }

  if (phoneVerification.code !== otp) {
    return res.status(400).json({ message: "Invalid Phone number" })
  }

  try {
    const { id: customerId } = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`,
      phone
    })
    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationToken = crypto.createHash("sha256").update(email).digest("hex")
    const newUser = await User.query(knexInstance).insert({
      firstName,
      lastName,
      email,
      phone,
      customerId,
      password: hashedPassword,
      verificationToken,
      consentMail,
      consentPhone
    })

    await PhoneVerification.query(knexInstance).delete().where({ phoneNumber: phone })

    const template = accountVerificationMailTemplate
    const params = [
      {
        name: "name",
        value: `${firstName} ${lastName}`
      },
      {
        name: "verificationLink",
        value: `${process.env.HOST_NAME}/user/verify/${verificationToken}`
      }
    ]
    const body = mailFormater(template, params)

    sendEmail(email, "Account Verification", body)

    return res.status(201).json({
      message: "User created", user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        isAdmin: newUser.isAdmin,
        isVerified: newUser.isVerified,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    })
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error })
  }
}

export default handler
