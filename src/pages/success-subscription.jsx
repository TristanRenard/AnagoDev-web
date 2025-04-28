/* eslint-disable camelcase */
import Subscription from "@/db/models/Subscription"
import knexInstance from "@/lib/db"
import authProps from "@/serverSideProps/authProps"
import Link from "next/link"
import { stripe } from "@/lib/stripe"

export const getServerSideProps = async (context) => {
  const { user } = await authProps(context)
  const { session_id } = context.query

  if (!session_id) {
    return {
      redirect: {
        destination: "/cart",
        permanent: false,
      },
    }
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["subscription"],
  })
  const { subscription } = session
  const priceId = subscription.items.data[0].price.id
  const stripePrice = await stripe.prices.retrieve(priceId)
  const isAnnually = stripePrice.recurring.interval === "year"
  const price = stripePrice.unit_amount / 100
  const hasSubscription = await Subscription.query(knexInstance).findOne(
    user.id,
  )

  if (hasSubscription) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
  
  console.log("Creating subscription for user:", user.id)

  await Subscription.query(knexInstance).insert({
    isAnnually,
    price,
    userId: user.id,
  })

  console.log("Subscription created successfully")

  return {
    props: {
      isAnnually,
      price,
    },
  }
}
const SuccessSubscription = ({ isAnnually, price }) => (
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
    <Link
      href="/"
      className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Go to Home
    </Link>
  </div>
)

export default SuccessSubscription
