/* eslint-disable camelcase */
import Subscription from "@/db/models/Subscription"
import knexInstance from "@/lib/db"
import * as Minio from "minio"

import { stripe } from "@/lib/stripe"
import authProps from "@/serverSideProps/authProps"
import Link from "next/link"

export const getServerSideProps = async (context) => {
  const { user } = await authProps(context)

  try {
    const { stripeSessionId, ...potentialSubscription } = await Subscription.query(knexInstance)
      .where({ userId: user.id, status: "waiting for payment" })
      .first()
    const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId)
    await console.log("stripeSession", stripeSession)
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

    await Subscription.query(knexInstance)
      .update({
        status: "active",
        isActive: true,
        isAnnually: potentialSubscription.isAnnually,
        stripeSessionId: stripeSession.id,
        priceId: potentialSubscription.priceId,
        userId: user.id,
        invoicePath: await fileUrl.replace("//", "/"),
      })
      .where({ userId: user.id, status: "waiting for payment" })

    return {
      props: {
        isAnnually: potentialSubscription.isAnnually || true,
        price: stripeSession.amount_total / 100,
        invoicePath: filePath,
      },
    }
  } catch (error) {
    const { isAnnually, invoicePath, stripeSessionId } = await Subscription.query(knexInstance)
      .where({ userId: user.id, status: "active" })
      .first()
    const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId)

    return {
      props: {
        isAnnually: isAnnually || true,
        price: stripeSession.amount_total / 100,
        invoicePath: invoicePath || null,
      },
    }
  }
}
const SuccessSubscription = ({ isAnnually, price, invoicePath }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 className="text-4xl font-bold text-green-600">
      Subscription Successful!
    </h1>
    <p className="mt-4 text-lg text-gray-700">
      Thank you for subscribing to our service.
    </p>
    <p className="mt-2 text-md text-gray-600">
      Plan: {isAnnually ? "Annual" : "Monthly"} - ${price}
      {isAnnually ? "/year" : "/month"}
    </p>
    {invoicePath && (
      <p className="mt-2 text-sm text-gray-500">
        Your invoice has been saved and will be available in your account.
      </p>
    )}
    <Link
      href="/"
      className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Go to Home
    </Link>
  </div>
)

export default SuccessSubscription