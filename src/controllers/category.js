/* eslint-disable no-nested-ternary */
import Category from "@/db/models/Category"
import knexInstance from "@/lib/db"

const categoryController = async (req, res) => {
  const { "x-user-data": userData } = req.headers
  const user = userData ? JSON.parse(userData) : null

  if (req.method === "POST") {
    if (!user || !user.role === "admin") {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { title, description, order, images } = req.body

    if (!title || !description || !order) {
      return res.status(400).json({
        message: "Missing required fields",
        missing: !title ? "title" : !description ? "description" : "order",
      })
    }

    try {
      const response = await Category.query(knexInstance).insert({
        title,
        description,
        images,
        order,
      })

      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }

  if (req.method === "GET") {
    const categories = await Category.query(knexInstance).select("*")

    return res.status(200).json(categories)
  }

  return res.status(405).json({ message: "Method Not Allowed" })
}

export default categoryController
