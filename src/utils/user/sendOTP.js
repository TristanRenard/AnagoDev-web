import PhoneVerification from "@/db/models/PhoneVerification"
import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import generateOTP from "@/utils/user/generateOTP"
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)
const sendOTP = async (email, phonenb) => {
  const codeOTP = generateOTP()

  if (email && !phonenb) {
    const user = await User.query(knexInstance).findOne({ email })

    if (user) {
      const { phone } = user

      try {
        await client.messages.create({
          body: `Votre code de vérification est ${codeOTP}, si vous n'êtes pas à l'origine de cette demande veuillez ignorer ce message ET NE PARTAGEZ JAMAIS CE CODE.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        })

        await User.query(knexInstance).patchAndFetchById(user.id, { verificationToken: codeOTP, otpCreation: new Date() })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  }

  if (!email && phonenb) {
    try {
      await PhoneVerification.query(knexInstance).insert({ phoneNumber: phonenb, code: codeOTP })
      await client.messages.create({
        body: `Votre code de vérification est ${codeOTP}, si vous n'êtes pas à l'origine de cette demande veuillez ignorer ce message ET NE PARTAGEZ JAMAIS CE CODE.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phonenb,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  return { message: "If User exists, OTP has been sent to the phone number else check your mail or create an account" }
}

export default sendOTP