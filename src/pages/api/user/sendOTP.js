import sendOTPController from "@/controllers/sendOTP"

const handler = async (req, res) => await sendOTPController(req, res)

export default handler