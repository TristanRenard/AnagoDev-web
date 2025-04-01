import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import { accountDeletionMailTemplate } from "../mail/mailTemplates"
import mailFormater from "../mail/mailFormater"
import sendEmail from "../mail/sendMail"
import { track } from "@vercel/analytics/server"

const accountDeletion = async (email) => {
  if (email) {
    const user = await User.query(knexInstance).findOne({ email })

    if (user) {
      const template = accountDeletionMailTemplate
      const params = [
        { name: "name", value: `${user.firstName} ${user.lastName}` },
        {
          name: "accountDeletionLink",
          // eslint-disable-next-line no-underscore-dangle
          value: `${process.env.HOST_NAME || process.env.__NEXT_PRIVATE_ORIGIN}user/delete?customerId=${user.customerId}`,
        },
      ]
      const body = mailFormater(template, params)

      try {
        await sendEmail(email, "Account Deletion", body)

        if (process.env.NODE_ENV !== "production") {
          return { message: "Account deletion email sent.", code: email }
        }

        track("emailSent", { email })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  }

  return {
    message:
      "Account deletion email sent, please check your email. If you don't see it, please check your spam folder.",
  }
}

export default accountDeletion
