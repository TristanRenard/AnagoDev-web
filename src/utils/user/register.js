import PhoneVerification from "@/db/models/PhoneVerification"
import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import { stripe } from "@/lib/stripe"
import mailFormater from "@/utils/mail/mailFormater"
import { accountVerificationMailTemplate } from "@/utils/mail/mailTemplates"
import sendEmail from "@/utils/mail/sendMail"
import bcrypt from "bcrypt"
import crypto from "crypto"

const register = async (req, res, { email, firstName, lastName, phone, password, consentMail, consentConditions }) => {
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
      consentConditions
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
        value: `${process.env.HOST_NAME}/auth/verify/${verificationToken}`
      }
    ]
    const body = mailFormater(template, params)

    await sendEmail(email, "Account Verification", body)

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

export default register