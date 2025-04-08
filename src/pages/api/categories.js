import Category from "@/db/models/Category"
import knexInstance from "@/lib/db"


const handler = async (req, res) => {
  if (req.method === "GET") {
    const categories = await Category.query(knexInstance)
      .select("*")
      .orderBy("order", "desc")

    return res.status(200).json(categories)
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`)
}

export default handler