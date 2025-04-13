/* eslint-disable camelcase */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-unused-vars */
import Order from "@/db/models/Order"
import OrderProduct from "@/db/models/OrderProduct"
import Product from "@/db/models/Product"
import knexInstance from "@/lib/db"
import { stripe } from "@/lib/stripe"
import cookie from "cookie"

const handler = async (req, res) => {
  const { "x-user-data": userData } = req.headers
  const user = JSON.parse(userData)
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
      }),
    )
  }

  const customerId = userData
    ? JSON.parse(userData).customerId
    : guestCustomerId

  if (!customerId) {
    return res.status(400).json({ message: "User has no stripe account" })
  }

  const { method } = req

  if (method === "GET") {
    const orderProducts = await Product.query(knexInstance)
      .select("products.*", "orderProducts.*")
      .join("orderProducts", "products.id", "orderProducts.productId")
      .join("orders", "orders.id", "orderProducts.orderId")
      .where("orders.userId", user.id)
      .orderBy("products.id", "asc")
    const productsPrice = await Product.query(knexInstance)
      .select("price")
      .join("orderProducts", "products.id", "orderProducts.productId")
      .join("orders", "orders.id", "orderProducts.orderId")
      .where("orders.userId", user.id)
      .orderBy("products.id", "asc")
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: "open",
    })
    const sessionData = await Promise.all(
      sessions.data.map(async (session) => {
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
        )
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
                unit_amount: price.unit_amount,
              },
              amount_total: item.amount_total,
              quantity: item.quantity,
              interval: price.recurring?.interval || "one_time",
            }
          }),
        )
        const interval = products[0].price.priceName || "one time payment"

        return {
          [interval]: {
            customer: customerId,
            payment_method_types: session.payment_method_types,
            mode: session.mode,
            products,
            success_url: session.success_url,
            cancel_url: session.cancel_url,
            checkoutURL: session.url,
            amount_total: session.amount_total,
            currency: session.currency,
          },
        }
      }),
    )

    return res.status(200).json({ sessionData, orderProducts, productsPrice })
  }

  if (req.method === "POST") {
    const { productId, action } = req.body || {}

    let order = await Order.query(knexInstance)
      .where({ userId: user.id, status: "inProgress" })
      .first()

    if (!order) {
      order = await Order.query(knexInstance).insert({
        status: "inProgress",
        userId: user.id,
      })

      await OrderProduct.query(knexInstance).insert({
        orderId: order.id,
        productId,
        quantity: 1,
      })

      return res.status(200).json({ message: "Order created" })
    }

    const isProductInCart = await OrderProduct.query(knexInstance)
      .where({ productId, orderId: order.id })
      .first()

    if (isProductInCart) {
      if (action === "add") {
        await OrderProduct.query(knexInstance)
          .where({ productId, orderId: order.id })
          .patch({ quantity: isProductInCart.quantity + 1 })
      } else if (action === "remove") {
        if (isProductInCart.quantity <= 1) {
          await OrderProduct.query(knexInstance)
            .where({ productId, orderId: order.id })
            .delete()
        } else {
          await OrderProduct.query(knexInstance)
            .where({ productId, orderId: order.id })
            .patch({ quantity: isProductInCart.quantity - 1 })
        }
      }

      return res.status(200).json({ message: "Product quantity updated" })
    }

    await OrderProduct.query(knexInstance).insert({
      orderId: order.id,
      productId,
      quantity: 1,
    })

    return res.status(200).json({ message: "Product added to order" })
  }

  // If (method === "POST") {
  //   const { priceId, quantity } = req.body

  //   if (!priceId || !quantity) {
  //     return res.status(400).json({ message: "Missing required fields" })
  //   }

  //   const sessions = await stripe.checkout.sessions.list({
  //     customer: customerId,
  //     status: "open",
  //   })

  //   let lineItems = []
  //   let targetSession = null
  //   let itemInterval = "one_time"

  //   // Vérifie si une session avec le même intervalle existe déjà
  //   for (const session of sessions.data) {
  //     // eslint-disable-next-line no-await-in-loop
  //     const pricesInCart = await stripe.checkout.sessions.listLineItems(session.id)
  //     const interval = pricesInCart.data[0]?.price.recurring?.interval || "one_time"

  //     if (pricesInCart.data.some((item) => item.price.id === priceId)) {
  //       // Trouve l'élément existant et met à jour la quantité
  //       lineItems = pricesInCart.data.map((item) => ({
  //         price: item.price.id,
  //         quantity: item.price.id === priceId ? item.quantity + quantity : item.quantity,
  //       }))
  //       targetSession = session
  //       itemInterval = interval

  //       break
  //     }

  //     if (!targetSession && interval === itemInterval) {
  //       // Récupère les items et utilise la session existante
  //       lineItems = pricesInCart.data.map((item) => ({
  //         price: item.price.id,
  //         quantity: item.quantity,
  //       }))
  //       lineItems.push({ price: priceId, quantity })
  //       targetSession = session
  //       itemInterval = interval
  //     }
  //   }

  //   if (!targetSession) {
  //     // Pas de session existante trouvée, crée une nouvelle session
  //     const priceData = await stripe.prices.retrieve(priceId)
  //     itemInterval = priceData.recurring?.interval || "one_time"
  //     lineItems.push({ price: priceId, quantity })
  //   }

  //   if (targetSession) {
  //     await stripe.checkout.sessions.expire(targetSession.id)
  //   }

  //   const session = await stripe.checkout.sessions.create({
  //     "payment_method_types": ["card"],
  //     "line_items": lineItems,
  //     mode: itemInterval === "one_time" ? "payment" : "subscription",
  //     "success_url": `${process.env.HOST_NAME}/success`,
  //     "cancel_url": `${process.env.HOST_NAME}/cart`,
  //     customer: customerId,
  //   })

  //   return res.status(200).json({ session, message: "Session mise à jour avec le panier complet" })
  // }

  if (method === "DELETE") {
    try {
      const sessions = await stripe.checkout.sessions.list({
        customer: customerId,
        status: "open",
      })

      await Promise.all(
        sessions.data.map(async (session) => {
          await stripe.checkout.sessions.expire(session.id)
        }),
      )

      return res.status(200).json({ message: "All sessions have been expired" })
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error expiring sessions", error: error.message })
    }
  }

  return res.status(200).json({ user: { customerId } })
}

export default handler
