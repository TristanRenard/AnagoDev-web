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
      .where({ userId: user.id, status: "paid" })
      .withGraphFetched(
        "[orderPrices, orderPrices.price, orderPrices.price.product]",
      )
      .orderBy("id", "asc")
    const ordersWithQuantities = orders.map((order) => {
      const totalQuantity =
        order.orderPrices?.reduce((sum, op) => sum + (op.quantity || 0), 0) || 0

      return {
        ...order,
        totalQuantity,
      }
    })

    return res.status(200).json({ orders: ordersWithQuantities })
  }

  return res.status(405).json({ message: "Method Not Allowed" })
}
export default handler
