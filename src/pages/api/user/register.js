/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import mailFormater from "@/lib/mail/mailFormater"
import { accountVerificationMailTemplate } from "@/lib/mail/mailTemplates"
import sendEmail from "@/lib/mail/sendMail"
import { stripe } from "@/lib/stripe"
import bcrypt from "bcrypt"
import crypto from "crypto"

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { first_name, last_name, email, phone, password, consentMail, consentPhone } = req.body

  if (!first_name || !last_name || !email || !password) {
    // eslint-disable-next-line no-nested-ternary
    return res.status(400).json({ message: "Missing required fields", missing: !first_name ? "first_name" : !last_name ? "last_name" : !email ? "email" : "password" })
  }

  try {
    const { id: customer_id } = await stripe.customers.create({
      email,
      name: `${first_name} ${last_name}`,
      phone
    })
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)
    // Generate verification token
    const verificationToken = crypto.createHash("sha256").update(email).digest("hex")
    const newUser = await User.query(knexInstance).insert({
      first_name,
      last_name,
      email,
      phone,
      customer_id,
      password: hashedPassword,
      verificationToken,
      consentMail,
      consentPhone
    })
    const template = accountVerificationMailTemplate
    const params = [
      {
        name: "name",
        value: `${first_name} ${last_name}`
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
        first_name: newUser.first_name,
        last_name: newUser.last_name,
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
