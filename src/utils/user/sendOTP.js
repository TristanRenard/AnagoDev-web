import PhoneVerification from "@/db/models/PhoneVerification"
import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import mailFormater from "@/utils/mail/mailFormater"
import { sendOTPMailTemplate } from "@/utils/mail/mailTemplates"
import sendEmail from "@/utils/mail/sendMail"
import generateOTP from "@/utils/user/generateOTP"
import { track } from "@vercel/analytics/server"

const sendOTP = async (email, phonenb) => {
  const codeOTP = generateOTP()

  if (email) {
    const user = await User.query(knexInstance).findOne({ email })

    if (user) {
      const template = sendOTPMailTemplate
      const params = [
        { name: "name", value: `${user.firstName} ${user.lastName}` },
        { name: "otp", value: codeOTP },
      ]
      const body = mailFormater(template, params)

      try {
        await User.query(knexInstance).patchAndFetchById(user.id, {
          verificationToken: codeOTP,
          otpCreation: new Date(),
        })

        await sendEmail(email, "Account Verification".toLocaleLowerCase(), body)

        if (process.env.NODE_ENV !== "production") {
          return { message: "OTP envoyé à votre email.", code: codeOTP }
        }

        track("emailSent", { email })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  } else if (phonenb) {
    try {
      await PhoneVerification.query(knexInstance)
        .delete()
        .where({ phoneNumber: phonenb })
      await PhoneVerification.query(knexInstance).insert({
        phoneNumber: phonenb,
        code: codeOTP,
      })

      if (process.env.NODE_ENV !== "production") {
        return {
          message: "OTP envoyé à votre email.",
          code: `${codeOTP.substring(0, 3)}-${codeOTP.substring(3)}`,
        }
      }

      track("emailSent", { email })

      await sendEmail(
        email,
        "Account Verification",
        `Votre code de vérification est ${codeOTP.substring(0, 3)}-${codeOTP.substring(3)}. Ne partagez jamais ce code.`,
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  return {
    message: "Si l'utilisateur existe, un OTP a été envoyé à son email.",
  }
}

export default sendOTP
