import Order from "@/db/models/Order"
import knexInstance from "@/lib/db"
import { stripe } from "@/lib/stripe"

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { "x-user-data": userData } = req.headers
  const user = JSON.parse(userData)
  const sessionId = await Order.query(knexInstance)
    .select("stripeSessionId")
    .where({ status: "cart", userId: user.id })
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
  }

  return res.status(200).json({
    session,
  })
}

export default handler
