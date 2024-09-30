import loginController from "@/controllers/login"

const handler = async (req, res) => await loginController(req, res)

export default handler