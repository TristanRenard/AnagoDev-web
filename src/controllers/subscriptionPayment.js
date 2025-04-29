/* eslint-disable camelcase */
import Price from "@/db/models/Price"
import Subscription from "@/db/models/Subscription"
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
      .select("stripeId", "id", "nickname")
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
      success_url: `${req.headers.origin || process.env.HOST_NAME}/success-subscription`,
      cancel_url: `${req.headers.origin || process.env.HOST_NAME}/cart`,
      ui_mode: "hosted",
    })
    console.log("session", session)

    await Subscription.query(knexInstance)
      .where({ "userId": user.id, "status": "waiting for payment" })
      .delete()

    const payload = {
      isAnnually: price[0].nickname === "yearly",
      isActive: false,
      priceId: price[0].id,
      userId: user.id,
      stripeSessionId: session.id,
      status: "waiting for payment",
    }

    await Subscription.query(knexInstance)
      .insert(payload)

    return res.status(200).json({
      user,
      price,
      url: session.url,
      stripePrice,
    })
  } catch (error) {
    console.error("Error creating subscription session:", error)

    return res.status(500).json({ message: "Internal server error", error })
  }
}

export default subscriptionPaymentController
