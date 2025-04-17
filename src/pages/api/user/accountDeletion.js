import accountDeletionController from "@/controllers/accountDeletion"

const handler = async (req, res) => await accountDeletionController(req, res)

export default handler
