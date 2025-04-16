/* eslint-disable max-depth */
/* eslint-disable camelcase */
// pages/api/cart.ts
import knexInstance from "@/lib/db"
import { stripe } from "@/lib/stripe"
import cookie from "cookie"
import Order from "@/db/models/Order"
import OrderPrice from "@/db/models/OrderPrice"

const handler = async (req, res) => {
  const { "x-user-data": userData } = req.headers
  const user = JSON.parse(userData || "{}")
  const cookies = cookie.parse(req.headers.cookie || "")
  let { guestCustomerId } = cookies

  if (!userData && !guestCustomerId) {
    const guestCustomer = await stripe.customers.create({
      description: "Guest User",
    })
    guestCustomerId = guestCustomer.id

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

  const customerId = user.customerId || guestCustomerId
  const userId = user.id || guestCustomerId

  if (!customerId) {
    return res.status(400).json({ message: "User has no stripe account" })
  }

  const { method } = req

  if (method === "GET") {
    try {
      const order = await Order.query(knexInstance)
        .where({ userId, status: "inProgress" })
        .first()

      if (!order) {
        return res.status(200).json({
          orderPrice: [],
          allProducts: [],
          quantity: [],
        })
      }

      const orderItems = await OrderPrice.query(knexInstance)
        .where("orderId", order.id)
        .orderBy("id", "asc")
        .withGraphFetched("[price, price.product]")
      const orderPrice = orderItems.map((item) => ({
        priceId: item.priceId,
        unit_amount: item.price.unit_amount,
      }))
      const allProducts = orderItems.map((item) => ({
        ...item.price.product,
        default_price: item.priceId,
      }))
      const quantity = orderItems.map((item) => ({
        quantity: item.quantity,
      }))

      return res.status(200).json({ orderPrice, allProducts, quantity })
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching cart", error: error.message })
    }
  }

  if (method === "POST") {
    const { selectedPrice, action } = req.body

    try {
      let order = await Order.query(knexInstance)
        .where({ userId, status: "inProgress" })
        .first()

      order ||= await Order.query(knexInstance)
        .insert({
          status: "inProgress",
          userId,
          addressId: 1,
          paymentMethodId: 1,
        })
        .returning("*")

      const existing = await OrderPrice.query(knexInstance)
        .where({
          orderId: order.id,
          priceId: selectedPrice,
        })
        .first()

      if (existing) {
        if (action === "add") {
          await OrderPrice.query(knexInstance)
            .where({ id: existing.id })
            .increment("quantity", 1)
        } else if (action === "remove") {
          if (existing.quantity <= 1) {
            await OrderPrice.query(knexInstance).deleteById(existing.id)
          } else {
            await OrderPrice.query(knexInstance)
              .where({ id: existing.id })
              .decrement("quantity", 1)
          }
        }
      } else {
        await OrderPrice.query(knexInstance).insert({
          orderId: order.id,
          priceId: selectedPrice,
          quantity: 1,
        })
      }

      return res.status(200).json({ message: "Cart updated successfully" })
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating cart", error: error.message })
    }
  }

  if (method === "DELETE") {
    try {
      const sessions = await stripe.checkout.sessions.list({
        customer: customerId,
        status: "open",
      })

      await Promise.all(
        sessions.data.map((session) =>
          stripe.checkout.sessions.expire(session.id),
        ),
      )

      return res.status(200).json({ message: "All sessions have been expired" })
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error expiring sessions", error: error.message })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default handler
