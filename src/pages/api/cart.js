/* eslint-disable max-lines-per-function */
/* eslint-disable no-unused-vars */
import { stripe } from "@/lib/stripe"
import cookie from "cookie"

const handler = async (req, res) => {
  const { "x-user-data": userData } = req.headers
  const cookies = cookie.parse(req.headers.cookie || "")
  let { guestCustomerId } = cookies

  // Si l'utilisateur n'est pas connecté et n'a pas de client invité existant, crée un client Stripe invité
  if (!userData && !guestCustomerId) {
    const guestCustomer = await stripe.customers.create({
      description: "Guest User",
    })
    guestCustomerId = guestCustomer.id

    // Enregistrer l'ID du client invité dans les cookies
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("guestCustomerId", guestCustomerId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      })
    )
  }

  const customerId = userData ? JSON.parse(userData).customerId : guestCustomerId

  if (!customerId) {
    return res.status(400).json({ message: "User has no stripe account" })
  }

  const { method } = req

  if (method === "GET") {
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: "open",
    })
    const sessionData = await Promise.all(
      sessions.data.map(async (session) => {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
        const products = await Promise.all(
          lineItems.data.map(async (item) => {
            const price = await stripe.prices.retrieve(item.price.id)
            const product = await stripe.products.retrieve(price.product)

            return {
              product: price.product,
              name: product.name,
              description: product.description,
              images: product.images,
              price: {
                priceName: price.nickname || "Standard",
                priceId: item.price.id,
                "unit_amount": price.unit_amount,
              },
              "amount_total": item.amount_total,
              quantity: item.quantity,
              interval: price.recurring?.interval || "one_time",
            }
          })
        )
        const interval = products[0].price.priceName || "one time payment"

        return {
          [interval]: {
            customer: customerId,
            "payment_method_types": session.payment_method_types,
            mode: session.mode,
            products,
            "success_url": session.success_url,
            "cancel_url": session.cancel_url,
            checkoutURL: session.url,
            "amount_total": session.amount_total,
            currency: session.currency,
          },
        }
      })
    )

    return res.status(200).json(sessionData)
  }

  if (method === "POST") {
    const { priceId, quantity } = req.body

    if (!priceId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: "open",
    })

    let lineItems = []

    if (sessions.data.length > 0) {
      const pricesInCart = await stripe.checkout.sessions.listLineItems(sessions.data[0].id)
      lineItems = pricesInCart.data.map((item) => ({
        price: item.price.id,
        quantity: item.quantity,
        interval: item.price.recurring?.interval || "one_time",
      }))

      const existingItem = lineItems.find((item) => item.price === priceId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        const priceData = await stripe.prices.retrieve(priceId)
        lineItems.push({
          price: priceId,
          quantity,
          interval: priceData.recurring?.interval || "one_time",
        })
      }

      await stripe.checkout.sessions.expire(sessions.data[0].id)
    } else {
      const priceData = await stripe.prices.retrieve(priceId)
      lineItems.push({ price: priceId, quantity, interval: priceData.recurring?.interval || "one_time" })
    }

    const groupedItems = lineItems.reduce((acc, item) => {
      // eslint-disable-next-line logical-assignment-operators
      (acc[item.interval] = acc[item.interval] || []).push({
        price: item.price,
        quantity: item.quantity,
      })

      return acc
    }, {})
    const sessionResponses = []
    for (const [interval, items] of Object.entries(groupedItems)) {
      // eslint-disable-next-line no-await-in-loop
      const session = await stripe.checkout.sessions.create({
        "payment_method_types": ["card"],
        "line_items": items,
        mode: interval === "one_time" ? "payment" : "subscription",
        "success_url": `${process.env.HOST_NAME}/success`,
        "cancel_url": `${process.env.HOST_NAME}/cancel`,
        customer: customerId,
      })
      sessionResponses.push(session)
    }

    return res.status(200).json({ sessions: sessionResponses, message: "Sessions créées par intervalle de facturation" })
  }



  if (method === "DELETE") {
    try {
      const sessions = await stripe.checkout.sessions.list({
        customer: customerId,
        status: "open",
      })

      await Promise.all(
        sessions.data.map(async (session) => {
          await stripe.checkout.sessions.expire(session.id)
        })
      )

      return res.status(200).json({ message: "All sessions have been expired" })
    } catch (error) {
      return res.status(500).json({ message: "Error expiring sessions", error: error.message })
    }
  }

  return res.status(200).json({ user: { customerId } })
}

export default handler
