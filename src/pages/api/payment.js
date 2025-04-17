/* eslint-disable camelcase */
import { stripe } from "@/lib/stripe"

const handler = async (req, res) => {
  const { method } = req

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { price } = req.body
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Products",
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.HOST_NAME}/success`,
    cancel_url: `${process.env.HOST_NAME}/cart`,
  })

  return res.status(200).json({ url: session.url })
}

export default handler
