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

  if (isAll) {
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admins only." })
    }

    const orders = await Order.query(knexInstance)
      .select("*")
      .withGraphFetched("[user, orderPrices, orderPrices.price, orderPrices.price.product]")

    return res.status(200).json({ orders })
  }

  const orders = await Order.query(knexInstance)
    .select("*")
    .where({ userId: user.id })
    .withGraphFetched("[orderPrices, orderPrices.price, orderPrices.price.product]")

  return res.status(200).json({ orders })
}

export default handler