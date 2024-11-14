import { stripe } from "@/lib/stripe"


const handler = async (req, res) => {
  // Get products from stripe
  const stripeProducts = await stripe.products.list({
    active: true
  })
  const productsWithPrices = await Promise.all(
    stripeProducts.data.map(async (product) => {
      const prices = await stripe.prices.list({
        product: product.id,
        active: true
      })


      return {
        ...product,
        prices: prices.data
      }
    })
  )
  const products = productsWithPrices.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    prices: product.prices.map((price) => ({
      id: price.id,
      name: price.nickname,
      "unit_amount": price.unit_amount,
      currency: price.currency,
      product: price.product,
    })),
    images: product.images
  }))

  // Return products
  res.status(200).json(products)
}

export default handler