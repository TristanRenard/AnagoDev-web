import verifyController from "@/controllers/verify"


const handler = async (req, res) => await verifyController(req, res)

export default handler