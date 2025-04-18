import Anthropic from "@anthropic-ai/sdk"

const handler = async (req, res) => {
  const { "x-user-data": userData } = req.headers
  const user = userData ? JSON.parse(userData) : null

  if (req.method === "GET") {
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
    const models = await client.models.list()
    res.status(200).json(models)
  }

  return res.status(405).json({ message: "Method Not Allowed" })
}

export default handler