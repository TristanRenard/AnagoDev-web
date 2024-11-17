import categoryController from "@/controllers/category"

const handler = async (req, res) => await categoryController(req, res)

export default handler
