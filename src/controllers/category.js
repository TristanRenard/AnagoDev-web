/* eslint-disable no-nested-ternary */
import Category from "@/db/models/Category"
import knexInstance from "@/lib/db"

const categoryController = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
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

export default categoryController