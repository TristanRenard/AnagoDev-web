import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import umami from "@umami/node"
import mailFormater from "../mail/mailFormater"
import { accountDeletionMailTemplate } from "../mail/mailTemplates"
import sendEmail from "../mail/sendMail"

const accountDeletion = async (email) => {
  umami.init({
    hostUrl: process.env.UMAMI_HOST,
    websiteId: process.env.UMAMI_WEBSITE_ID,
  })

  if (email) {
    const user = await User.query(knexInstance).findOne({ email })

    if (user) {
      const template = accountDeletionMailTemplate
      const params = [
        { name: "name", value: `${user.firstName} ${user.lastName}` },
        {
          name: "accountDeletionLink",
          // eslint-disable-next-line no-underscore-dangle
          value: `${process.env.HOST_NAME || process.env.__NEXT_PRIVATE_ORIGIN}/user/delete?customerId=${user.customerId}`,
        },
      ]
      const body = mailFormater(template, params)

      try {
        await sendEmail(email, "Account Deletion", body)

        if (process.env.NODE_ENV !== "production") {
          return { message: "Account deletion email sent.", code: email }
        }

        umami.track("emailSent", { email })
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
