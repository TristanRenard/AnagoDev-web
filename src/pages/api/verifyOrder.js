import Order from "@/db/models/Order"
import Product from "@/db/models/Product"
import knexInstance from "@/lib/db"
import { stripe } from "@/lib/stripe"

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { "x-user-data": userData } = req.headers
  const user = JSON.parse(userData)
  const sessionId = await Order.query(knexInstance)
    .select("stripeSessionId", "id")
    .where({ status: "cart", userId: user.id })
    .withGraphFetched("[orderPrices.price]")
    .limit(1)
  const [order] = sessionId

  if (!sessionId.length) {
    return res.status(200).json({ message: "No session found" })
  }

  const session = await stripe.checkout.sessions.retrieve(
    sessionId[0].stripeSessionId,
  )

  if (session.payment_status === "paid") {
    await Order.query(knexInstance)
      .update({
        status: "paid",
        userId: user.id,
      })
      .where({
        stripeSessionId: session.id,
      })

    const orderPrices = order.orderPrices.map((item) => ({
      productId: item.price.productId,
      quantity: item.quantity,
    }))

    console.log("orderPrices", orderPrices)

    //Update stock
    await Promise.all(
      orderPrices.map(async (item) => {
        await Product.query(knexInstance).findById(item.productId).decrement("stock", item.quantity)
      })
    )
  }

  return res.status(200).json({
    session,
  })
}

export default handler
