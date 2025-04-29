import Order from "@/db/models/Order"
import Product from "@/db/models/Product"
import knexInstance from "@/lib/db"
import { stripe } from "@/lib/stripe"
import * as Minio from "minio"

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { "x-user-data": userData } = req.headers
  const user = JSON.parse(userData)
  const sessionId = await Order.query(knexInstance)
    .select("stripeSessionId", "id")
    .where({ status: "cart", userId: user.id })
    .withGraphFetched("[orderPrices.price]")
    .limit(1)
  const [order] = sessionId

  if (!order) {
    return res.status(200).json({ message: "No session found" })
  }

  const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId)

  if (session.payment_status === "paid") {
    const stripeSession = await stripe.checkout.sessions.retrieve(order.stripeSessionId)
    console.log("stripeSession", stripeSession)
    const { invoice_pdf, id: invoiceId } = await stripe.invoices.retrieve(stripeSession.invoice)
    // Upload the invoice to minio
    const minioClient = new Minio.Client({
      endPoint: process.env.MINIO_HOST,
      port: parseInt(process.env.MINIO_PORT, 10),
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
    })
    //Get file name from url
    const filePath = `invoices/${user.id}-${invoiceId}.pdf`
    // Correction: Récupération correcte du buffer depuis l'URL
    const response = await fetch(invoice_pdf)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await minioClient.putObject("anago-dev", filePath, buffer, {
      "Content-Type": "application/pdf",
    })
    console.log("file uploaded to minio", filePath)

    const fileUrl = `/api/backoffice/files/${filePath}`


    await Order.query(knexInstance)
      .update({
        status: "paid",
        userId: user.id,
        invoicePath: await fileUrl.replace("//", "/"),
      })
      .where({
        stripeSessionId: session.id,
      })

    const orderPrices = order.orderPrices.map((item) => ({
      productId: item.price.productId,
      quantity: item.quantity,
    }))

    console.log("orderPrices", orderPrices)

    await Promise.all(
      orderPrices.map(async (item) => {
        const product = await Product.query(knexInstance).findById(
          item.productId,
        )

        if (product.stock !== -1) {
          await Product.query(knexInstance)
            .findById(item.productId)
            .decrement("stock", item.quantity)
        }
      }),
    )
  }

  return res.status(200).json({
    session,
  })
}

export default handler
