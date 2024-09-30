import registerController from "@/controllers/register"

const handler = async (req, res) => await registerController(req, res)

export default handler
