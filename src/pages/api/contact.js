import mailFormater from "@/utils/mail/mailFormater"
import { contactMailTemplate, contactMailTemplateConfirmation } from "@/utils/mail/mailTemplates"
import sendEmail from "@/utils/mail/sendMail"

const contact = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" })
    }

    const { name, email, message } = req.body

    if (!name || !email || !message) {
        return res.status(400).json({ message: "Missing fields" })
    }

    try {
        const html = mailFormater(contactMailTemplate, [
            { name: "name", value: name },
            { name: "email", value: email },
            { name: "message", value: message },
        ])
        const htmlConfirmation = mailFormater(contactMailTemplateConfirmation, [
            { name: "name", value: name },
            { name: "message", value: message },
        ])

        await sendEmail("schmittlea92@yahoo.com", "New Contact Form Submission", html)
        await sendEmail(email, "Confirmation of your demande", htmlConfirmation)

        return res.status(200).json({ success: true })
    } catch (err) {
        console.error("Error sending contact emails:", err)

        return res.status(500).json({ message: "Failed to send emails" })
    }
}

export default contact