import Order from "@/db/models/Order"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
  const { method } = req

  if (method === "GET") {
    const { "x-user-data": userData } = req.headers

    if (!userData) {
      return res.status(401).json({ message: "Unauthorized. You must log in." })
    }

    const user = JSON.parse(userData)
    const orders = await Order.query(knexInstance)
      .select("*")
      .where({ userId: user.id })
      .withGraphFetched("[orderPrices, orderPrices.price, orderPrices.price.product]")

    return res.status(200).json({ orders })
  }

  return res.status(405).json({ message: "Method Not Allowed" })
}
export default handler