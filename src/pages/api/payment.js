/* eslint-disable camelcase */
import Order from "@/db/models/Order"
import Price from "@/db/models/Price"
import knexInstance from "@/lib/db"
import { stripe } from "@/lib/stripe"

const handler = async (req, res) => {
  const { method } = req

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { "x-user-data": userData } = req.headers
  const user = JSON.parse(userData)
  const { products, quantity } = req.body
  const priceIds = products.map((product) => product.default_price)
  const prices = await Price.query(knexInstance)
    .select("stripeId")
    .whereIn("id", priceIds)
  const stripePrices = await Promise.all(
    prices.map(({ stripeId }) => stripe.prices.retrieve(stripeId)),
  )
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer: user.customerId,
    line_items: [
      ...stripePrices.map((price, index) => ({
        price: price.id,
        quantity: quantity[index].quantity,
      })),
    ],
    mode: "payment",
    success_url: `${req.headers.origin}/success`,
    cancel_url: `${req.headers.origin}/cart`,
  })

  await Order.query(knexInstance)
    .update({
      status: "cart",
      userId: user.id,
      stripeSessionId: session.id,
    })
    .where({
      userId: user.id,
      status: "cart",
    })

  return res.status(200).json({
    prices: stripePrices,
    url: session.url,
    sessionId: session.id,
  })
}

export default handler
