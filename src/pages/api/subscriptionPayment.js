import subscriptionPaymentController from "@/controllers/subscriptionPayment"

const handler = async (req, res) =>
  await subscriptionPaymentController(req, res)

export default handler
