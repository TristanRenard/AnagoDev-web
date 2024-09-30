import verifyPhoneNumberController from "@/controllers/verifyPhoneNumber"

const handler = async (req, res) => await verifyPhoneNumberController(req, res)

export default handler