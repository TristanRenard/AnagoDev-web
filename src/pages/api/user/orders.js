import Order from "@/db/models/Order"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
  const { method, url } = req

  if (method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { "x-user-data": userData } = req.headers

  if (!userData) {
    return res.status(401).json({ message: "Unauthorized. You must log in." })
  }

  const user = JSON.parse(userData)
  const isAll = url.includes("/all") || req.query.all === "true"

  let orders

  if (isAll) {
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admins only." })
    }

    orders = await Order.query(knexInstance)
      .select("*")
      .withGraphFetched(
        "[user, orderPrices, orderPrices.price, orderPrices.price.product]",
      )
      .orderBy("id", "asc")
  } else {
    orders = await Order.query(knexInstance)
      .select("*")
      .where({ userId: user.id, status: "paid" })
      .withGraphFetched(
        "[orderPrices, orderPrices.price, orderPrices.price.product]",
      )
      .orderBy("id", "asc")
  }

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

export default handler
