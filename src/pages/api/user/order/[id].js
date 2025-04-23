// /pages/api/user/orders/[id].js
import Order from "@/db/models/Order"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
    const { method } = req
    const { id } = req.query

    if (method !== "PATCH") {
        return res.status(405).json({ message: "Method Not Allowed" })
    }

    const { "x-user-data": userData } = req.headers

    if (!userData) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const user = JSON.parse(userData)

    if (user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" })
    }

    const { status } = req.body

    if (!status) {
        return res.status(400).json({ message: "Status is required" })
    }

    const updatedOrder = await Order.query(knexInstance)
        .patchAndFetchById(id, { status })

    return res.status(200).json({ order: updatedOrder })
}

export default handler