/* eslint-disable camelcase */
import Price from "@/db/models/Price"
import knexInstance from "@/lib/db"
import { stripe } from "@/lib/stripe"

const subscriptionPaymentController = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { "x-user-data": userData } = req.headers
    const user = JSON.parse(userData)
    const { selectedPrice } = req.body
    const price = await Price.query(knexInstance)
      .select("stripeId")
      .where("id", selectedPrice)
    const stripePrice = await stripe.prices.retrieve(price[0].stripeId)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      billing_address_collection: "required",
      customer: user.customerId,
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.origin || process.env.HOST_NAME}/success-subscription?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || process.env.HOST_NAME}/cart`,
    })

    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("Error creating subscription session:", error)

    return res.status(500).json({ message: "Internal server error", error })
  }
}

export default subscriptionPaymentController
