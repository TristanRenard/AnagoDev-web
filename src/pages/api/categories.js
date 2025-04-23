import Category from "@/db/models/Category"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
  try {
    // Gestion sécurisée des headers utilisateur
    const { "x-user-data": userData } = req.headers
    let user = {}
    let isAdmin = false

    // Vérification de la présence et validité du userData
    if (userData) {
      try {
        user = JSON.parse(userData || "{}")
        isAdmin = user?.role === "admin"
      } catch (e) {
        console.error("Erreur de parsing des données utilisateur:", e)
        // Continue avec les valeurs par défaut
      }
    }

    if (req.method === "GET") {
      try {
        const categories = await Category.query(knexInstance)
          .select("*")
          .orderBy("order", "asc")

        return res.status(200).json(categories || [])
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error)

        return res.status(500).json({
          message: "Erreur lors de la récupération des catégories",
          error: error.message
        })
      }
    }

    if (req.method === "POST") {
      if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const { name, description, images, order } = req.body

      if (!name || !description || !images || !order) {
        return res.status(400).json({
          message: "Missing required fields",
          missingFields: {
            name: !name,
            description: !description,
            images: !images,
            order: !order,
          },
        })
      }

      try {
        const newCategory = await Category.query(knexInstance).insert({
          title: name,
          description,
          images,
          order,
        })

        return res.status(201).json(newCategory)
      } catch (error) {
        console.error("Erreur lors de la création d'une catégorie:", error)

        return res.status(500).json({
          message: "Erreur lors de la création d'une catégorie",
          error: error.message
        })
      }
    }

    if (req.method === "PUT" && req.query.action === "reorder") {
      if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const { categoryIds } = req.body

      if (!categoryIds || !Array.isArray(categoryIds)) {
        return res.status(400).json({
          message: "Missing or invalid categoryIds field",
        })
      }

      try {
        // Utiliser une transaction pour garantir l'intégrité des données
        await knexInstance.transaction(async (trx) => {
          // Mettre à jour l'ordre de chaque catégorie
          for (let i = 0; i < categoryIds.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            await Category.query(trx)
              .findById(categoryIds[i])
              .patch({ order: categoryIds.length - 1 - i })
          }
        })

        return res
          .status(200)
          .json({ success: true, message: "Categories reordered successfully" })
      } catch (error) {
        console.error("Error reordering categories:", error)

        return res
          .status(500)
          .json({ message: "Failed to reorder categories", error: error.message })
      }
    }

    return res.status(405).json({ message: `Method ${req.method} Not Allowed` })
  } catch (error) {
    console.error("Erreur non gérée dans l'API categories:", error)

    return res.status(500).json({
      message: "Une erreur s'est produite sur le serveur",
      error: error.message
    })
  }
}

export default handler