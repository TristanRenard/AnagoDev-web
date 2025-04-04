/* eslint-disable no-console */
import Product from "@/db/models/Product"
import knexInstance from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { buffer } from "micro"

// Désactiver le parsing du body par défaut de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
}
const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed")
  }

  const sig = req.headers["stripe-signature"]

  try {
    const rawBody = await buffer(req)
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      "whsec_bab004a88c86790d5dc565f8bbd9c31b7a21c6da2c7a79c0d216e972983669ba",
    )
    const productId = event?.data?.object?.id
    const active = event?.data?.object?.active
    console.log("Produit mis à jour:", event.data.object)
    console.log(!event)

    switch (event.type) {
      case "product.updated":

        if (!active) {
          await Product.query(knexInstance)
            .findOne({ stripeId: productId })
            .patch({
              isActive: false,
            })
        }

        break

      case "product.deleted":
        console.log("Produit supprimé:", event.data.object)
        await Product.query(knexInstance)
          .findOne({ stripeId: productId })
          .delete()

        break
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error("Error verifying webhook signature:", err)

    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
}

export default handler
