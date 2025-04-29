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

  try {
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
      payment_method_types: ["card", "paypal"],
      billing_address_collection: "required",
      customer: user.customerId,
      line_items: [
        ...stripePrices.map((price, index) => ({
          price: price.id,
          quantity: quantity[index].quantity,
        })),
      ],
      mode: "payment",
      success_url: `${req.headers.origin || process.env.HOST_NAME}/success`,
      cancel_url: `${req.headers.origin || process.env.HOST_NAME}/cart`,
      ui_mode: "hosted",
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: "Cyna order",
          metadata: {
            userId: user.id,
          },
        },
      },
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
  } catch (error) {
    console.error("Error creating checkout session:", error)

    return res.status(500).json({ message: "Internal server error", error })
  }
}

export default handler
