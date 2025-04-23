/* eslint-disable max-lines-per-function */
import Price from "@/db/models/Price"
import Product from "@/db/models/Product"
import knexInstance from "@/lib/db"
import { stripe } from "@/lib/stripe"
import axios from "axios"

// eslint-disable-next-line complexity, consistent-return
const handler = async (req, res) => {
  const { "x-user-data": userData } = req.headers
  const user = (userData && JSON.parse(userData)) || {}
  const isAdmin = user?.role === "admin"

  if (req.method === "POST") {
    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const {
        name,
        description,
        prices,
        images,
        isSubscription,
        categoryId = 2,
        stock = -1,
        duties = -1,
        isTopProduct,
      } = req.body

      if (
        !name ||
        !description ||
        !Array.isArray(prices) ||
        prices.length === 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Données d'entrée invalides. Nom, description, prix et catégorie sont requis.",
          details: {
            name: !name,
            description: !description,
            prices: !Array.isArray(prices) || prices.length === 0,
            categoryId: !categoryId,
          },
        })
      }

      const processedImages = images.map((image) => {
        if (image.startsWith("http")) {
          return encodeURI(image)
        }

        return encodeURI(`${process.env.HOST_NAME_PRODUCTION}${image}`)
      })

      console.log("Processed images:", processedImages)

      const newProduct = await stripe.products.create({
        name,
        description,
        metadata: {
          isSubscription: isSubscription ? "true" : "false",
        },
      })
      const basePrice = prices[0].unit_amount / 100
      const dbProduct = await Product.query(knexInstance).insert({
        title: name,
        stripeId: newProduct.id,
        description,
        isMarkdown: true,
        price: basePrice,
        isSubscription: Boolean(isSubscription),
        images,
        stock,
        duties,
        isTopProduct,
        categoryId,
      })
      const pricePromises = prices.map(async (price) => {
        // Ne pas inclure recurring si ce n'est pas un abonnement
        const stripePriceData = {
          "unit_amount": price.unit_amount,
          currency: price.currency,
          nickname: price.nickname,
          product: newProduct.id,
        }

        // Ajouter recurring seulement si c'est un abonnement
        if (isSubscription && price.recurring) {
          stripePriceData.recurring = price.recurring
        }

        const stripePrice = await stripe.prices.create(stripePriceData)

        return Price.query(knexInstance).insert({
          stripeId: stripePrice.id,
          recurring: Boolean(isSubscription && price.recurring),
          nickname: price.nickname,
          "unit_amount": price.unit_amount,
          currency: price.currency,
          interval:
            isSubscription && price.recurring ? price.recurring.interval : "",
          productId: dbProduct.id,
        })
      })
      const createdPrices = await Promise.all(pricePromises)

      await axios.post(
        `${process.env.HOST_NAME}/api/temp/translations`,
        {
          texts: [name, description],
          key: `products`,
        },
        {
          headers: {
            "x-user-data": userData,
          },
        },
      )

      res.status(200).json({
        success: true,
        product: newProduct,
        prices: createdPrices,
      })
    } catch (error) {
      console.error(error)

      return res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  }

  if (req.method === "GET") {
    const { backoffice } = req.query
    const { id, categoryId } = req.query

    if (isAdmin && backoffice) {
      const products = await Product.query(knexInstance)
        .select("*")
        .orderBy("created_at", "desc")
        .withGraphFetched("[category, prices]")

      return res.status(200).json(products)
      // eslint-disable-next-line no-else-return
    } else {
      if (id) {
        const product = await Product.query(knexInstance)
          .findById(id)
          .withGraphFetched("[category, prices]")

        return res.status(200).json(product)
      }

      if (categoryId) {
        const products = await Product.query(knexInstance)
          .select("*")
          .where({ isActive: true, isSubscription: false })
          .where("categoryId", categoryId)
          .orderBy("created_at", "desc")
          .withGraphFetched("[category, prices]")

        return res.status(200).json(products)
      }

      const products = await Product.query(knexInstance)
        .select("*")
        .where({ isActive: true, isSubscription: false })
        .orderBy("created_at", "desc")
        .withGraphFetched("[category, prices]")

      return res.status(200).json(products)
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" })
    }

    const product = await Product.query(knexInstance).findOne({ stripeId: id })

    try {
      await stripe.products.update(id, {
        active: !product.isActive,
      })
      await Product.query(knexInstance)
        .patch({
          isActive: !product.isActive,
        })
        .where({ stripeId: id })

      return res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  // Gestion de la méthode PATCH
  if (req.method === "PATCH") {
    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const { id } = req.query
      const {
        name,
        description,
        prices,
        images,
        isSubscription,
        categoryId,
        stock,
        duties,
        isActive,
        isTopProduct,
      } = req.body

      if (!id) {
        return res.status(400).json({ message: "Product ID is required" })
      }

      // Récupérer le produit à partir de l'ID de la base de données
      const dbProduct = await Product.query(knexInstance).findById(id)

      if (!dbProduct) {
        return res.status(404).json({ message: "Product not found" })
      }

      // Mettre à jour le produit dans Stripe
      const updateData = {}

      if (name) {
        updateData.name = name
      }

      if (description) {
        updateData.description = description
      }

      if (isSubscription !== undefined) {
        updateData.metadata = {
          ...dbProduct.metadata,
          isSubscription: isSubscription ? "true" : "false",
        }
      }

      // Mise à jour du produit dans Stripe
      const updatedStripeProduct = await stripe.products.update(
        dbProduct.stripeId,
        updateData,
      )
      // Préparer les données pour la mise à jour dans la base de données PostgreSQL
      const dbUpdateData = {}

      if (name) {
        dbUpdateData.title = name
      }

      if (description) {
        dbUpdateData.description = description
      }

      if (images) {
        dbUpdateData.images = images
      }

      if (isSubscription !== undefined) {
        dbUpdateData.isSubscription = Boolean(isSubscription)
      }

      if (categoryId) {
        dbUpdateData.categoryId = categoryId
      }

      if (stock !== undefined) {
        dbUpdateData.stock = stock
      }

      if (duties !== undefined) {
        dbUpdateData.duties = duties
      }

      if (isActive !== undefined) {
        dbUpdateData.isActive = isActive
      }

      if (isTopProduct !== undefined) {
        dbUpdateData.isTopProduct = isTopProduct
      }

      // Mise à jour du produit dans la base de données PostgreSQL
      await Product.query(knexInstance).findById(id).patch(dbUpdateData)

      // Mise à jour des prix si fournis
      let updatedPrices = []

      if (prices && Array.isArray(prices)) {
        // Récupérer les prix existants
        const existingPrices = await Price.query(knexInstance).where(
          "productId",
          id,
        )
        // Traiter les mises à jour de prix
        // eslint-disable-next-line consistent-return
        const pricePromises = prices.map(async (price) => {
          if (price.id) {
            // Mise à jour d'un prix existant
            const existingPrice = existingPrices.find(
              (ep) => ep.id === price.id,
            )

            if (existingPrice) {
              // Pour Stripe, nous ne pouvons pas modifier un prix existant, nous devons en créer un nouveau et archiver l'ancien
              if (
                price.unit_amount !== existingPrice.unit_amount ||
                price.currency !== existingPrice.currency ||
                JSON.stringify(price.recurring) !==
                JSON.stringify(existingPrice.recurring)
              ) {
                // Archiver l'ancien prix dans Stripe
                await stripe.prices.update(existingPrice.stripeId, {
                  active: false,
                })

                // Préparer les données pour le nouveau prix Stripe
                const newStripePriceData = {
                  "unit_amount": price.unit_amount,
                  currency: price.currency,
                  nickname: price.nickname || existingPrice.nickname,
                  product: dbProduct.stripeId,
                }

                // Ajouter recurring seulement si c'est un abonnement
                if (isSubscription || dbProduct.isSubscription) {
                  // eslint-disable-next-line max-depth
                  if (price.recurring) {
                    newStripePriceData.recurring = price.recurring
                  }
                }

                // Créer un nouveau prix dans Stripe
                const newStripePrice =
                  await stripe.prices.create(newStripePriceData)

                // Mettre à jour l'enregistrement de prix dans PostgreSQL
                return Price.query(knexInstance)
                  .findById(price.id)
                  .patch({
                    stripeId: newStripePrice.id,
                    recurring: Boolean(isSubscription && price.recurring),
                    nickname: price.nickname || existingPrice.nickname,
                    "unit_amount": price.unit_amount,
                    currency: price.currency,
                    interval:
                      isSubscription && price.recurring
                        ? price.recurring.interval
                        : "",
                  })
              }

              // Si seul le nickname change, nous pouvons le mettre à jour directement
              if (price.nickname && price.nickname !== existingPrice.nickname) {
                await stripe.prices.update(existingPrice.stripeId, {
                  nickname: price.nickname,
                })

                return Price.query(knexInstance)
                  .findById(price.id)
                  .patch({ nickname: price.nickname })
              }

              // Aucune modification nécessaire pour ce prix
              return existingPrice
            }
          } else {
            // Création d'un nouveau prix
            // Préparer les données pour le nouveau prix Stripe
            const newStripePriceData = {
              "unit_amount": price.unit_amount,
              currency: price.currency,
              nickname: price.nickname,
              product: dbProduct.stripeId,
            }

            // Ajouter recurring seulement si c'est un abonnement
            if (
              isSubscription !== undefined
                ? isSubscription
                : dbProduct.isSubscription
            ) {
              if (price.recurring) {
                newStripePriceData.recurring = price.recurring
              }
            }

            const stripePrice = await stripe.prices.create(newStripePriceData)
            const isProductSubscription =
              isSubscription !== undefined
                ? isSubscription
                : dbProduct.isSubscription

            return Price.query(knexInstance).insert({
              stripeId: stripePrice.id,
              recurring: Boolean(isProductSubscription && price.recurring),
              nickname: price.nickname,
              "unit_amount": price.unit_amount,
              currency: price.currency,
              interval:
                isProductSubscription && price.recurring
                  ? price.recurring.interval
                  : "",
              productId: id,
            })
          }
        })

        updatedPrices = await Promise.all(pricePromises)
      }

      // Mettre à jour les traductions si le nom ou la description a changé
      if (name || description) {
        await axios.post(
          `${process.env.HOST_NAME}/api/temp/translations`,
          {
            texts: [
              name || dbProduct.title,
              description || dbProduct.description,
            ],
            key: `products`,
          },
          {
            headers: {
              "x-user-data": userData,
            },
          },
        )
      }

      // Récupérer le produit mis à jour avec ses relations
      const updatedProduct = await Product.query(knexInstance)
        .findById(id)
        .withGraphFetched("[category, prices]")

      res.status(200).json({
        success: true,
        product: updatedProduct,
        stripeProduct: updatedStripeProduct,
        prices: updatedPrices,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  }

  // Définir les méthodes autorisées
  res.setHeader("Allow", ["POST", "GET", "DELETE", "PATCH"])

  // Si la méthode n'est pas prise en charge
  if (!["POST", "GET", "DELETE", "PATCH"].includes(req.method)) {
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler
