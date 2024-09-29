import nodemailer from "nodemailer"

/**
 * Fonction d'envoi d'email
 * @param {string} email - L'adresse email du destinataire
 * @param {string} subject - Le sujet de l'email
 * @param {string} body - Le contenu HTML de l'email
 */
const sendEmail = async (email, subject, body) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
  const mailOptions = {
    from: `"Cyna" ${process.env.EMAIL_USER}`,
    to: email,
    subject,
    text: body,
    html: body,
  }
  await transporter.sendMail(mailOptions)
}

export default sendEmail