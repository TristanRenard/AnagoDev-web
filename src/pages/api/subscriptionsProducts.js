import Product from "@/db/models/Product"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
  const { method } = req

  if (method === "GET") {
    const products = await Product.query(knexInstance)
      .select("*")
      .where({ isActive: true, isSubscription: true })
      .withGraphFetched("[category, prices]")
      .orderBy("created_at", "desc")
      .orderBy("isTopProduct", "desc")

    return res.status(200).json(products || [])
  }


  return res.status(405).json({
    message: "Method not allowed",
  })
}

export default handler

